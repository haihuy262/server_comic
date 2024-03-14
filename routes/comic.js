var express = require("express");
var router = express.Router();
var comciCtrl = require("../controller/comic.controller");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploader = multer({
  storage: storage,
  fileFilter: fileFilter,
  dest: "/tmp",
});

router.get("/", comciCtrl.listComic);
router.get("/search", comciCtrl.listComic);
router.get("/sort-name-write/:tentacgia", comciCtrl.listComic);
router.get("/sort-year/:namxuatban", comciCtrl.listComic);

router.get("/add", comciCtrl.addComic);
router.post(
  "/add",
  uploader.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  comciCtrl.addComic
);
// router.post("/", uploadImgComic.single("upload-comic"), comciCtrl.editComic);
router.get("/delete/:id", comciCtrl.deleteComic);
router.get("/detail/:id", comciCtrl.detailComic);

module.exports = router;
