var express = require("express");
var router = express.Router();
var comicApi = require("../controller/API/comic.api");
var commentApi = require("../controller/API/comment.api");
var userApi = require("../controller/API/users.api");
var accountApi = require("../controller/API/account.api");
var favoriteApi = require("../controller/API/favorite.api");
const multer = require("multer");
var uploadAvata = multer({ dest: "./tmp" });
var uploadComic = multer({ dest: "./tmp" });

//login
router.post("/login", accountApi.login);
router.post("/reg", uploadAvata.single("upload-avata"), accountApi.register);
router.get("/info-user", accountApi.getInfoUser);
router.post("/change-pass/:id", accountApi.changePass);
router.post("/change-info/:id", accountApi.changeInfo);

//user
router.get("/user", userApi.list);
// router.post("/user", uploadAvata.single("upload-avata"), userApi.add);
router.put("/user/:id", uploadAvata.single("upload-avata"), userApi.edit);
router.delete("/user/:id", userApi.delete);

//comic
router.get("/comic", comicApi.list);
router.get("/comic/:id/detail", comicApi.detail);
router.get("/comic/:id/read", comicApi.read);
router.post("/comic", comicApi.add);
router.put("/comic/:id/edit", comicApi.edit);
router.delete("/comic/:id/delete", comicApi.delete);

//comment tốt
router.get("/comment", commentApi.list);
router.post("/comment", commentApi.add);
router.put("/comment/:id", commentApi.edit);
router.delete("/comment/:id", commentApi.delete);

//favorite
router.get("/favorite/:id", favoriteApi.list);
router.post("/favorite", favoriteApi.add);
router.delete("/favorite/:id", favoriteApi.delete);
router.get("/favorite", favoriteApi.getOne);

module.exports = router;
