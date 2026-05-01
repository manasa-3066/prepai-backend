const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../middlewares/errorHandler");
const { processPDF, answerQuestion } = require("../services/ragService");

// This is our in-memory store
// Key = userId, Value = array of chunks with embeddings
// When server restarts, this clears — that is fine for now
const userDocuments = {};

// ─── Upload PDF ───────────────────────────────────────────────────────────────
// POST /api/chat/upload
exports.uploadDocument = asyncHandler(async (req, res, next) => {

  if (!req.file) {
    return next(createError("Please upload a PDF file", 400));
  }

  console.log(`Processing PDF for user ${req.user.id}...`);

  // Process the PDF — extract text, chunk it, create embeddings
  // This takes 10-30 seconds depending on PDF size
  const chunks = await processPDF(req.file.buffer);

  // Store chunks in memory under this user's ID
  // So when they ask questions, we know which document to search
  userDocuments[req.user.id] = chunks;

  res.status(200).json({
    success: true,
    message: "Document processed successfully",
    data: {
      chunks: chunks.length,
      // Tell user how many chunks their document was split into
    },
  });
});

// ─── Ask a question ───────────────────────────────────────────────────────────
// POST /api/chat/ask
exports.askQuestion = asyncHandler(async (req, res, next) => {

  const { question } = req.body;

  if (!question || question.trim().length < 3) {
    return next(createError("Please ask a question", 400));
  }

  // Check if this user has uploaded a document
  const chunks = userDocuments[req.user.id];
  if (!chunks || chunks.length === 0) {
    return next(createError("Please upload a document first", 400));
  }

  // Find relevant chunks and generate answer
  const result = await answerQuestion(question, chunks);

  res.status(200).json({
    success: true,
    data: {
      question,
      answer:  result.answer,
      sources: result.sources,
    },
  });
});

// ─── Clear document ───────────────────────────────────────────────────────────
// DELETE /api/chat/clear
exports.clearDocument = asyncHandler(async (req, res, next) => {

  // Remove this user's document from memory
  delete userDocuments[req.user.id];

  res.status(200).json({
    success: true,
    message: "Document cleared",
  });
});