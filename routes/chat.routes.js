// const router   = require("express").Router();
// const { protect } = require("../middlewares/authMiddleware");
// const upload   = require("../config/multer");
// const {
//   uploadDocument,
//   askQuestion,
//   clearDocument,
// } = require("../controllers/chatController");

// // upload.single("document") — multer looks for file with field name "document"
// router.post("/upload",  protect, upload.single("document"), uploadDocument);
// router.post("/ask",     protect, askQuestion);
// router.delete("/clear", protect, clearDocument);

// module.exports = router;

const router      = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const upload      = require("../config/multer");
const {
  uploadDocument,
  askQuestion,
  clearDocument,
  getDocumentInfo,
} = require("../controllers/chatController");

router.post("/upload",  protect, upload.single("document"), uploadDocument);
router.post("/ask",     protect, askQuestion);
router.delete("/clear", protect, clearDocument);
router.get("/info",     protect, getDocumentInfo);

module.exports = router;