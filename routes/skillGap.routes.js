const router     = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const { analyse } = require("../controllers/skillGapController");
const upload     = require("../config/multer");

// upload.single("resume") tells multer to look for a file
// with the field name "resume" in the form data
router.post("/analyse", protect, upload.single("resume"), analyse);
// router.post(
//   "/analyse",
//   (req, res, next) => {
//     console.log("Route hit");
//     next();
//   },
//   protect,
//   upload.single("resume"),
//   (req, res, next) => {
//     console.log("After multer req.file =", req.file);
//     console.log("Body =", req.body);
//     next();
//   },
//   analyse
// );

// router.post("/analyse", upload.single("resume"), (req,res)=>{
//    console.log(req.file);
//    console.log(req.body);
//    res.json({ok:true});
// });

//router.post("/analyse", upload.single("resume"), analyse);
module.exports = router;