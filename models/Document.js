const mongoose = require("mongoose");

// Each chunk has its text and embedding vector
const chunkSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  embedding: { type: [Number], required: true }, // array of floats
  index:     { type: Number, required: true },
});

const documentSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    filename:   { type: String, required: true },
    totalChunks:{ type: Number, required: true },
    chunks:     { type: [chunkSchema], required: true },
  },
  { timestamps: true }
);

// One user can only have one active document at a time
// If they upload again, we replace the old one
documentSchema.index({ user: 1 });

module.exports = mongoose.model("Document", documentSchema);