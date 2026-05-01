// const pdfParse   = require("pdf-parse");
// const asyncHandler = require("../utils/asyncHandler");
// const { createError } = require("../middlewares/errorHandler");
// const { analyseSkillGap } = require("../services/geminiService");

// exports.analyse = asyncHandler(async (req, res, next) => {
//   // req.file comes from multer — it is the uploaded PDF
//   if (!req.file) {
//     return next(createError("Please upload your resume as a PDF", 400));
//   }

//   const { jobDescription } = req.body;
//   if (!jobDescription || jobDescription.trim().length < 50) {
//     return next(createError("Please paste the full job description", 400));
//   }

//   // Extract text from the PDF buffer
//   // req.file.buffer is the raw binary data of the PDF
//   const pdfData    = await pdfParse(req.file.buffer);
//   const resumeText = pdfData.text;

//   if (!resumeText || resumeText.trim().length < 50) {
//     return next(createError("Could not read your PDF. Make sure it is a text-based PDF, not a scanned image.", 400));
//   }

//   // Send both texts to Groq for analysis
//   const analysis = await analyseSkillGap({ resumeText, jobDescription });

//   res.status(200).json({
//     success: true,
//     data: analysis,
//   });
// });

const pdfParse = require("pdf-parse");
const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../middlewares/errorHandler");
const { analyseSkillGap } = require("../services/geminiService");

exports.analyse = asyncHandler(async (req, res, next) => {
  try {
    // Check file uploaded
    if (!req.file) {
      return next(createError("Please upload your resume as a PDF", 400));
    }

    // Get job description
    const { jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 50) {
      return next(
        createError("Please paste the full job description", 400)
      );
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return next(
        createError(
          "Could not read your PDF. Please upload a text-based PDF, not scanned image.",
          400
        )
      );
    }

    // Gemini analysis
    const analysis = await analyseSkillGap({
      resumeText,
      jobDescription,
    });

    return res.status(200).json({
      success: true,
      data: analysis,
    });

  } catch (error) {
  console.error("ANALYSE ERROR:", error);
  return next(createError(error.message || "Failed to analyse resume", 500));
}
});