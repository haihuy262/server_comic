var myDB = require("../models/comic.model");
let fs = require("fs");

exports.listComic = async (req, res, next) => {
  let title = "Danh sách truyện";
  let msg = "";
  let dieuKienLoc = null;
  let dieuKienSapXep = null;
  //tìm kiếm
  if (req.query.name != "" && String(req.query.name) != "undefined") {
    dieuKienLoc = { name: { $regex: req.query.name } };
  }
  // sắp xếp theo tên tác giả
  if (req.params.tentacgia != "0") {
    if (typeof req.params.tentacgia != "undefined") {
      dieuKienSapXep = { writer_name: Number(req.params.tentacgia) };
    }
  }
  // sắp xếp theo năm xuất bản
  if (req.params.namxuatban != "0") {
    if (typeof req.params.namxuatban != "undefined") {
      dieuKienSapXep = { publishing_year: Number(req.params.namxuatban) };
    }
  }

  let listComic = await myDB.comicModel
    .find(dieuKienLoc)
    .skip(req.query.Index)
    .limit(5)
    .sort(dieuKienSapXep);
  let count = await myDB.comicModel.countDocuments();

  res.render("comic/listComic", {
    title: title,
    msg: msg,
    listComic: listComic,
    count: count,
    name: req.query.name,
    sortNameWrite: req.params.tentacgia,
    sortYear: req.params.namxuatban,
  });
};

exports.detailComic = async (req, res, next) => {
  try {
    let id = req.params.id;
    let comic = await myDB.comicModel.findById(id);
    if (!comic) {
      // Nếu không tìm thấy comic, hiển thị lỗi 404
      return res.status(404).send("Comic not found");
    }
    // Hiển thị trang chi tiết comic với thông tin của comic
    res.render("comic/detailComic", { comic });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.addComic = async (req, res, next) => {
  let title = "Thêm truyện tranh";
  let msg = "";
  let url_image = "";
  let url_pdf = "";

  if (req.method == "POST") {
    if (req.files["image"]) {
      const imageFile = req.files["image"][0];
      fs.renameSync(
        imageFile.path,
        "./public/uploads/" + imageFile.originalname
      );
      url_image = "/uploads/" + imageFile.originalname;
    }

    if (req.files["pdf"]) {
      const pdfFile = req.files["pdf"][0];
      fs.renameSync(pdfFile.path, "./public/uploads/" + pdfFile.originalname);
      url_pdf = "/uploads/" + pdfFile.originalname;
    }

    const newComic = myDB.comicModel({
      name: req.body.name,
      writer_name: req.body.writer_name,
      publishing_year: req.body.publishing_year,
      story_desc: req.body.story_desc,
      image: url_image,
      pdf: url_pdf,
    });
    await myDB.comicModel.create(newComic);
    res.redirect("/comic");
  }

  res.render("comic/addComic", {
    title: title,
    msg: msg,
  });
};

exports.editComic = async (req, res, next) => {
  let title = "Sửa thông tin truyện";
  let msg = "";

  try {
    let id = req.params.id;
    let comic = await myDB.comicModel.findOne({ _id: id });
    res.render("comic/editComic", {
      data: comic,
      title: title,
      msg: msg,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.putComic = async (req, res, next) => {
  let url_image = "";
  let url_pdf = "";

  if (req.method == "POST") {
    let id = req.params.id;
    const { name, writer_name, publishing_year } = req.body;
    console.log(name, writer_name, publishing_year);
    console.log("aaaaaaaaaaaaa", id);
    try {
      let comic = await myDB.comicModel.findById(id);

      if (!comic) {
        res.status(404).json({
          messages: "Loi roi",
        });
      }

      if (req.files["image"]) {
        const imageFile = req.files["image"][0];
        fs.renameSync(
          imageFile.path,
          "./public/uploads/" + imageFile.originalname
        );
        url_image = "/uploads/" + imageFile.originalname;
      }

      if (req.files["pdf"]) {
        const pdfFile = req.files["pdf"][0];
        fs.renameSync(pdfFile.path, "./public/uploads/" + pdfFile.originalname);
        url_pdf = "/uploads/" + pdfFile.originalname;
      }

      const editComic = await myDB.comicModel.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
          writer_name: req.body.writer_name,
          publishing_year: req.body.publishing_year,
          story_desc: req.body.story_desc,
          image: url_image,
          pdf: url_pdf,
        },
        { new: true }
      );
      res.redirect("/comic");
    } catch (error) {
      console.log(error);
    }
  }
};

exports.deleteComic = async (req, res, next) => {
  let id = req.params.id;
  let obj = await myDB.comicModel.findById(id);
  obj.acc_status = false;
  try {
    await myDB.comicModel.findByIdAndDelete(id, obj);
    res.redirect("/comic");
  } catch (error) {
    console.log(error);
  }

  res.render("comic/listComic");
};
