const pdfParse = require("pdf-parse");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// We load the embedding model once and reuse it
// First time it downloads the model (~50MB) — after that it is cached
let embedder = null;

const getEmbedder = async () => {
  if (!embedder) {
    console.log("Loading embedding model... (first time takes 30 seconds)");
    const { pipeline } = await import("@xenova/transformers");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("Embedding model loaded!");
  }
  return embedder;
};

// ─── Split text into chunks ───────────────────────────────────────────────────
const splitIntoChunks = (text, chunkSize = 500) => {
  const words  = text.split(" ");
  const chunks = [];
  let i = 0;

  while (i < words.length) {
    const chunkWords = words.slice(i, i + chunkSize);
    chunks.push(chunkWords.join(" "));
    i += chunkSize;
  }

  return chunks;
};

// ─── Create embedding using local model ──────────────────────────────────────
const createEmbedding = async (text) => {
  const embed  = await getEmbedder();
  const output = await embed(text, { pooling: "mean", normalize: true });
  // Convert to regular array
  return Array.from(output.data);
};

// ─── Cosine similarity ────────────────────────────────────────────────────────
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// ─── Process PDF ──────────────────────────────────────────────────────────────
const processPDF = async (pdfBuffer) => {
  const pdfData = await pdfParse(pdfBuffer);
  const text    = pdfData.text;

  console.log(`PDF extracted: ${text.length} characters`);

  const chunks = splitIntoChunks(text, 500);
  console.log(`Split into ${chunks.length} chunks`);

  const chunksWithEmbeddings = [];

  for (let i = 0; i < chunks.length; i++) {
    console.log(`Embedding chunk ${i + 1} of ${chunks.length}...`);
    const embedding = await createEmbedding(chunks[i]);
    chunksWithEmbeddings.push({
      text: chunks[i],
      embedding,
      index: i,
    });
  }

  return chunksWithEmbeddings;
};

// ─── Find relevant chunks ─────────────────────────────────────────────────────
const findRelevantChunks = async (question, chunks, topK = 3) => {
  const questionEmbedding = await createEmbedding(question);

  const similarities = chunks.map((chunk) => ({
    text:       chunk.text,
    similarity: cosineSimilarity(questionEmbedding, chunk.embedding),
  }));

  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, topK);
};

// ─── Answer question ──────────────────────────────────────────────────────────
const answerQuestion = async (question, chunks) => {
  const relevantChunks = await findRelevantChunks(question, chunks);
  const context = relevantChunks.map((c) => c.text).join("\n\n");

  const prompt = `
  You are an expert study assistant helping a student prepare for their university exams.
  
  The student has shared their course notes with you. Answer their question based on 
  the provided context from their notes.
  
  If the answer is not in the context, say:
  "This topic is not covered in your notes. I recommend checking your textbook or asking your professor."
  
  Context from student's notes:
  ${context}
  
  Student's question: ${question}
  
  Instructions for your answer:
  - Give a complete, detailed answer suitable for a university exam
  - Start with a clear one-line definition or overview
  - Explain with examples wherever possible
  - If it is a concept, explain WHY it works that way, not just WHAT it is
  - Use simple language — explain like the student is reading this for the first time
  - If the topic has multiple parts, explain each part clearly
  - End with a one-line summary they can remember
  - Format your answer in clear paragraphs — no bullet points unless listing steps
  
  Write a thorough answer:
`;

  const response = await groq.chat.completions.create({
    model:      "llama-3.3-70b-versatile",
    messages:   [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens:  1024,
  });

  return {
    answer: response.choices[0].message.content,
    sources: relevantChunks.map((c) => ({
      text:       c.text.substring(0, 150) + "...",
      similarity: Math.round(c.similarity * 100),
    })),
  };
};

module.exports = { processPDF, answerQuestion };