const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question:      { type: String, required: true },
  topic:         { type: String },
  userAnswer:    { type: String, default: "" },
  feedback:      { type: String, default: "" },
  sampleAnswer:  { type: String, default: "" },
  score:         { type: Number, default: 0, min: 0, max: 10 },
  strengths:     { type: String, default: "" },
  improvements:  { type: String, default: "" },
});

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company:    { type: String, required: true },
    role:       { type: String, required: true },
    difficulty: { type: String, required: true },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
    questions:       { type: [questionSchema], default: [] },
    totalScore:      { type: Number, default: 0 },
    maxScore:        { type: Number, default: 50 },
    percentage:      { type: Number, default: 0 },
    overallFeedback: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);