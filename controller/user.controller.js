const { log } = require("console");
var myDB = require("../models/user.model");
var fs = require("fs");

exports.listUser = async (req, res, next) => {
  let title = "Danh sách khách hàng";
  let msg = "";
  let dieuKienLoc = null;
  let dieuKienSapXep = null;
  //tìm kiếm
  if (req.query.fullname != "" && String(req.query.fullname) != "undefined") {
    dieuKienLoc = { fullname: { $regex: req.query.fullname } };
  }
  // sắp xếp
  if (req.params.fullname != "0") {
    if (typeof req.params.fullname != "undefined") {
      dieuKienSapXep = { fullname: Number(req.params.fullname) };
    }
  }

  let listUser = await myDB.userModel
    .find(dieuKienLoc)
    .skip(req.query.Index)
    .limit(5)
    .sort(dieuKienSapXep);
  let count = await myDB.userModel.find().count();

  res.render("user/listUser", {
    title: title,
    msg: msg,
    listUser: listUser,
    name: req.query.fullname,
    sortName: req.params.fullname,
    count: count,
  });
};

exports.addUser = async (req, res, next) => {
  let title = "Thêm User";
  let msg = "";
  if (req.method == "POST") {
    let user = await myDB.userModel.findOne({ username: req.body.username });
    console.log(user);
    if (!user) {
      if (req.body.password == req.body.passwordRe) {
        let obj = new myDB.userModel();
        obj.username = req.body.username;
        obj.password = req.body.password;
        obj.fullname = req.body.fullname;
        obj.email = req.body.email;
        obj.phone = req.body.phone;
        obj.acc_status = true;
        obj.role = false;
        try {
          if (req.file && req.file.fieldname === "upload-avata") {
            fs.renameSync(
              req.file.path,
              "./public/avata_upload/" + req.file.originalname
            );
            obj.avata = "/avata_upload/" + req.file.originalname;
          }
        } catch (error) {
          console.log("================= Ảnh lỗi rồi m ơi: " + error.message);
        }
        try {
          await obj.save();
          res.redirect("/user");
        } catch (error) {
          msg = "Lỗi ghi cơ sở dữ liệu " + error.message;
        }
      } else {
        msg = "Mật khẩu không trùng khớp";
      }
    } else {
      msg = "Tài khoản đã tồn tại! vui lòng tạo tài khoản khác";
    }
  }
  res.render("user/addUser", { title: title, msg: msg });
};

exports.blockUser = async (req, res, next) => {
  let id = req.params.idUser;
  let obj = await myDB.userModel.findById(id);
  obj.acc_status = false;
  try {
    await myDB.userModel.findByIdAndUpdate(id, obj);
    res.redirect("/user");
  } catch (error) {
    console.log(error);
  }

  res.render("user/listUser");
};

exports.unBlockUser = async (req, res, next) => {
  let id = req.params.idUser;
  let obj = await myDB.userModel.findById(id);
  obj.acc_status = true;
  try {
    await myDB.userModel.findByIdAndUpdate(id, obj);
    res.redirect("/user");
  } catch (error) {
    console.log(error);
  }

  res.render("user/listUser");
};
