const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../middlewares/errorHandler");
const {
  generateInterviewQuestion,
  generateInterviewQuestions,
  evaluateAnswer,
  generateOverallFeedback,
} = require("../services/geminiService");
const InterviewSession = require("../models/InterviewSession");

// ─── Old single question generator — kept ─────────────────────────────────────
exports.generate = asyncHandler(async (req, res, next) => {
  const { company, role, difficulty, topic } = req.body;
  if (!company || !role || !difficulty) {
    return next(createError("Please provide company, role and difficulty", 400));
  }
  const question = await generateInterviewQuestion({ company, role, difficulty, topic });
  res.status(200).json({ success: true, data: question });
});

// ─── Start a new mock interview ───────────────────────────────────────────────
exports.startInterview = asyncHandler(async (req, res, next) => {
  const { company, role, difficulty } = req.body;

  if (!company || !role || !difficulty) {
    return next(createError("Please provide company, role and difficulty", 400));
  }

  // Generate 5 questions from Groq
  const result = await generateInterviewQuestions({ company, role, difficulty });

  // Create a new session in MongoDB
  const session = await InterviewSession.create({
    user: req.user.id,        // from authMiddleware
    company,
    role,
    difficulty,
    status: "in-progress",
    questions: result.questions.map((q) => ({
      question: q.question,
      topic: q.topic,
    })),
  });

  res.status(201).json({
    success: true,
    data: {
      sessionId: session._id,
      company: session.company,
      role: session.role,
      difficulty: session.difficulty,
      questions: session.questions.map((q) => ({
        id: q._id,
        question: q.question,
        topic: q.topic,
      })),
    },
  });
});

// ─── Evaluate one answer ──────────────────────────────────────────────────────
exports.evaluateAnswer = asyncHandler(async (req, res, next) => {
  const { sessionId, questionIndex, userAnswer } = req.body;

  if (!sessionId || questionIndex === undefined || !userAnswer) {
    return next(createError("sessionId, questionIndex and userAnswer are required", 400));
  }

  // Find the session
  const session = await InterviewSession.findById(sessionId);
  if (!session) return next(createError("Session not found", 404));

  // Make sure this session belongs to the logged in user
  if (session.user.toString() !== req.user.id) {
    return next(createError("Unauthorized", 403));
  }

  const question = session.questions[questionIndex];
  if (!question) return next(createError("Question not found", 404));

  // Ask Groq to evaluate the answer
  const evaluation = await evaluateAnswer({
    question: question.question,
    userAnswer,
    role: session.role,
    company: session.company,
  });

  // Save the evaluation back to MongoDB
  session.questions[questionIndex].userAnswer   = userAnswer;
  session.questions[questionIndex].score        = evaluation.score;
  session.questions[questionIndex].feedback     = evaluation.feedback;
  session.questions[questionIndex].strengths    = evaluation.strengths;
  session.questions[questionIndex].improvements = evaluation.improvements;
  session.questions[questionIndex].sampleAnswer = evaluation.sampleAnswer;

  await session.save();

  res.status(200).json({
    success: true,
    data: evaluation,
  });
});

// ─── Complete interview and generate final report ─────────────────────────────
exports.completeInterview = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.body;

  const session = await InterviewSession.findById(sessionId);
  if (!session) return next(createError("Session not found", 404));

  if (session.user.toString() !== req.user.id) {
    return next(createError("Unauthorized", 403));
  }

  // Calculate total score
  const totalScore = session.questions.reduce((sum, q) => sum + q.score, 0);
  const percentage = Math.round((totalScore / 50) * 100);

  // Get overall feedback from Groq
  const overall = await generateOverallFeedback({
    company: session.company,
    role: session.role,
    questions: session.questions,
    totalScore,
    percentage,
  });

  // Update session as completed
  session.status          = "completed";
  session.totalScore      = totalScore;
  session.percentage      = percentage;
  session.overallFeedback = overall.overallFeedback;
  await session.save();

  res.status(200).json({
    success: true,
    data: {
      totalScore,
      maxScore: 50,
      percentage,
      overallFeedback:  overall.overallFeedback,
      strongestArea:    overall.strongestArea,
      weakestArea:      overall.weakestArea,
      recommendation:   overall.recommendation,
      questions: session.questions,
    },
  });
});

// ─── Get all past sessions for the logged in user ─────────────────────────────
exports.getHistory = asyncHandler(async (req, res, next) => {
  const sessions = await InterviewSession.find({
    user: req.user.id,
    status: "completed",
  })
    .sort({ createdAt: -1 })   // newest first
    .select("company role difficulty totalScore percentage createdAt");

  res.status(200).json({
    success: true,
    data: sessions,
  });
});