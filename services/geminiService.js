const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log("Groq key loaded:", process.env.GROQ_API_KEY ? "YES" : "NO");

// ─── Helper — calls Groq and returns parsed JSON ──────────────────────────────
const askGroq = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2048,
  });
  const text = response.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};

// ─── 1. Generate one question (old feature — kept for compatibility) ───────────
const generateInterviewQuestion = async ({ company, role, difficulty, topic }) => {
  const prompt = `
    You are a senior technical interviewer at ${company}.
    Generate a ${difficulty} difficulty interview question for a ${role} role.
    ${topic ? `Focus on: ${topic}.` : ""}
    Return ONLY valid JSON, no markdown, no extra text:
    {
      "company": "${company}",
      "role": "${role}",
      "topic": "topic of question",
      "difficulty": "${difficulty}",
      "question": "the question",
      "hints": ["hint 1", "hint 2", "hint 3"],
      "sampleAnswer": "detailed sample answer",
      "whyThisCompanyAsksThis": "one sentence why ${company} asks this"
    }
  `;
  return askGroq(prompt);
};

// ─── 2. Generate 5 questions for a mock interview ─────────────────────────────
const generateInterviewQuestions = async ({ company, role, difficulty }) => {
  const prompt = `
    You are a senior technical interviewer at ${company}.
    
    Generate exactly 5 ${difficulty} difficulty interview questions 
    for a ${role} position at ${company}.
    
    Rules:
    - Each question must cover a different topic
    - Questions must match ${company}'s actual interview style
    - Mix conceptual and practical questions
    
    Return ONLY valid JSON, no markdown, no extra text:
    {
      "questions": [
        {
          "question": "full question text",
          "topic": "topic name"
        },
        {
          "question": "full question text",
          "topic": "topic name"
        },
        {
          "question": "full question text",
          "topic": "topic name"
        },
        {
          "question": "full question text",
          "topic": "topic name"
        },
        {
          "question": "full question text",
          "topic": "topic name"
        }
      ]
    }
  `;
  return askGroq(prompt);
};

// ─── 3. Evaluate a user's answer ──────────────────────────────────────────────
const evaluateAnswer = async ({ question, userAnswer, role, company }) => {
  const prompt = `
    You are a strict but fair technical interviewer at ${company} 
    interviewing a candidate for ${role}.
    
    Question asked: "${question}"
    Candidate's answer: "${userAnswer}"
    
    Evaluate the answer honestly and return ONLY valid JSON, no markdown:
    {
      "score": <number between 0 and 10>,
      "strengths": "what the candidate did well",
      "improvements": "what was missing or could be better",
      "feedback": "overall 2-3 sentence feedback as if speaking directly to candidate",
      "sampleAnswer": "what an ideal answer would look like"
    }
    
    Scoring guide:
    0-3: Very poor, missed the core concept entirely
    4-5: Basic understanding but significant gaps
    6-7: Good answer with minor gaps
    8-9: Strong answer, well structured
    10: Exceptional, nothing to add
  `;
  return askGroq(prompt);
};

// ─── 4. Generate overall interview feedback ───────────────────────────────────
const generateOverallFeedback = async ({ company, role, questions, totalScore, percentage }) => {
  const summary = questions.map((q, i) =>
    `Q${i + 1} (${q.topic}): score ${q.score}/10`
  ).join(", ");

  const prompt = `
    A candidate just completed a mock interview at ${company} for ${role}.
    
    Results: ${summary}
    Total: ${totalScore}/50 (${percentage}%)
    
    Give overall feedback in ONLY valid JSON, no markdown:
    {
      "overallFeedback": "3-4 sentences of honest overall assessment",
      "strongestArea": "the topic they performed best in",
      "weakestArea": "the topic that needs most improvement",
      "recommendation": "one clear action they should take next"
    }
  `;
  return askGroq(prompt);
};

// ─── 5. Skill Gap Analysis ────────────────────────────────────────────────────
const analyseSkillGap = async ({ resumeText, jobDescription }) => {
  const prompt = `
    You are an expert technical recruiter and career coach.
    
    Carefully analyse this candidate's resume against the job description.
    
    RESUME:
    ${resumeText}
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    Provide a thorough skill gap analysis. Return ONLY valid JSON, no markdown:
    {
      "overallMatch": <number 0-100 representing how well resume matches job>,
      "summary": "2-3 sentence honest summary of the candidate's fit for this role",
      
      "matchingSkills": [
        { "skill": "skill name", "level": "beginner/intermediate/advanced" }
      ],
      
      "missingSkills": [
        {
          "skill": "skill name",
          "importance": "critical/important/nice-to-have",
          "reason": "one sentence why this skill matters for the role"
        }
      ],
      
      "roadmap": [
        {
          "week": "Week 1-2",
          "focus": "main topic to learn",
          "goal": "what you will be able to do by end of this period",
          "resources": [
            { "title": "resource name", "type": "video/docs/course/book", "url": "actual URL if known, else empty string" }
          ],
          "project": "a small hands-on project to build this week to solidify learning"
        }
      ],
      
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "immediateActions": ["action 1", "action 2", "action 3"]
    }
  `;
  return askGroq(prompt);
};

module.exports = {
  generateInterviewQuestion,
  generateInterviewQuestions,
  evaluateAnswer,
  generateOverallFeedback,
  analyseSkillGap
};
  