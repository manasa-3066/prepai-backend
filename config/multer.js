// const multer = require("multer");

// // memoryStorage means the file is kept in RAM as a Buffer
// // We never save it to disk — we just read it and throw it away
// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },  // 5MB max
//   fileFilter: (req, file, cb) => {
//     // Only allow PDF files
//     console.log("File received:", file.originalname, file.mimetype);
//     if (file.mimetype === "application/pdf") {
//       cb(null, true);
//     } else {
//       cb(new Error("Only PDF files are allowed"), false);
//     }
//   },
// });

// module.exports = upload;

const multer = require("multer");
const path = require("path");

// Store file in memory (RAM)
const storage = multer.memoryStorage();

const upload = multer({
  storage,

  // Max file size = 5MB
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    console.log("File received:", file.originalname, file.mimetype);

    // Get file extension
    const ext = path.extname(file.originalname).toLowerCase();

    // Allowed MIME types
    const allowedMimeTypes = [
      "application/pdf",
      "application/x-pdf",
      "application/octet-stream",
    ];

    // Validate PDF
    if (ext === ".pdf" && allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

module.exports = upload;