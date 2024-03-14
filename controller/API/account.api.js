var myDB = require('../../models/user.model')
var fs = require('fs')
const bcrypt = require('bcrypt');

exports.login = async (req, res, next) => {
    try {
        let checkLogin = false;
        let errors = "";
        let userLogin = req.query;
        // validate
        if (userLogin.username == "") {
            errors = "errNullU"
            return res.status(203).json({
                msg: "Không được để trống tài khoản",
                checkStatus: checkLogin,
                error: errors,
            })
        }
        if (userLogin.password == "") {
            errors = "errNullP"
            return res.status(203).json({
                msg: "Không được để trống mật khẩu",
                checkStatus: checkLogin,
                error: errors,
            })
        }
        const user = await myDB.userModel.findOne({ username: userLogin.username });
        if (user) {
            const checkPass = await bcrypt.compare(userLogin.password, user.password)
            if (checkPass) {
                checkLogin = true
                return res.status(200).json({
                    msg: "Đăng nhập thành công",
                    checkStatus: checkLogin,
                    error: errors,
                })
            } else {
                errors = "errNotP"
                return res.status(203).json({
                    msg: "Sai mật khẩu",
                    checkStatus: checkLogin,
                    error: errors,
                })
            }
        }
        errors = "errNotU"
        return res.status(203).json({
            msg: "Tài khoản không tồn tại",
            checkStatus: checkLogin,
            error: errors,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",
        })
    }
}

exports.getInfoUser = async (req, res, next) => {
    try {
        let inforUser = await myDB.userModel.findOne({ username: req.query.username });
        return res.status(203).json({
            data: inforUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",
        })
    }
}

exports.register = async (req, res, next) => {
    try {
        let checkReg = false;
        let errors = "";
        let userReg = req.body;
        // validate
        if (userReg.username == "") {
            errors = "errNullUser"
            return res.status(203).json({
                msg: "Không được để trống tài khoản",
                checkStatus: checkReg,
                error: errors,
            })
        }
        if (userReg.password == "") {
            errors = "errNullPass"
            return res.status(203).json({
                msg: "Không được để trống mật khẩu",
                checkStatus: checkReg,
                error: errors,
            })
        }
        if (req.query.re_pass == "") {
            errors = "errNullRePass"
            return res.status(203).json({
                msg: "Bạn cần nhập lại mật khẩu",
                checkStatus: checkReg,
                error: errors,
            })
        }


        let user = await myDB.userModel.findOne({ username: req.body.username })
        console.log("log user " + req.body.username);
        if (!user) {
            if (req.body.password == req.query.re_pass) {
                const salt = await bcrypt.genSalt(10);
                checkReg = true;
                let obj = new myDB.userModel(req.body);
                // mã hóa mk
                obj.password = await bcrypt.hash(req.body.password, salt);
                obj.acc_status = true
                obj.role = false
                try {
                    if (req.file) {
                        fs.renameSync(req.file.path, './public/avata_upload/' + req.file.originalname)
                        obj.avata = '/avata_upload/' + req.file.originalname
                    }
                } catch (error) {
                    console.log("================= Ảnh lỗi rồi m ơi: " + error.message);
                }

                await obj.save()
                errors = ""
                return res.status(201).json({
                    msg: "Thêm thành công",
                    checkStatus: checkReg,
                    error: errors
                })
            } else {
                errors = "rePassErr"
                return res.status(203).json({
                    msg: "Xác thực mật khẩu không chính xác",
                    checkStatus: checkReg,
                    error: errors,
                })
            }
        } else {
            errors = "userExists"
            return res.status(203).json({
                msg: "Tài khoản đã tồn tại !",
                checkStatus: checkReg,
                error: errors,
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",
        })
    }
}

exports.changePass = async (req, res, next) => {
    try {
        let checkChangePass = false;
        let errors = ""
        let userchange = req.query;
         if (userchange.pass == "") {
            errors = "errNullPass"
            return res.status(203).json({
                msg: "Không được để trống mật khẩu cũ",
                checkStatus: checkChangePass,
                error: errors,
            })
        }
        if (userchange.pass_new == "") {
            errors = "errNullPassNew"
            return res.status(203).json({
                msg: "Không được để trống mật khẩu mới",
                checkStatus: checkChangePass,
                error: errors,
            })
        }
        if (userchange.pass_re == "") {
            errors = "errNullPassRe"
            return res.status(203).json({
                msg: "Bạn cần nhập lại mật khẩu mới",
                checkStatus: checkChangePass,
                error: errors,
            })
        }
        let user = await myDB.userModel.findById(req.params.id)
        const checkPass = await bcrypt.compare(userchange.pass, user.password)
        if (checkPass) {
            if (userchange.pass_new == userchange.pass_re) {
                checkChangePass = true;
                // tạo obj lưu mật khẩu ở đây
                const salt = await bcrypt.genSalt(10);
                // mã hóa mk
                user.password = await bcrypt.hash(userchange.pass_new, salt);
                await myDB.userModel.findByIdAndUpdate(req.params.id, user)
                return res.status(200).json({
                    msg: "Đổi mật khẩu thành công",
                    checkStatus: checkChangePass,
                    error: errors,
                })
            } else {
                errors = "errNotPass"
                return res.status(203).json({
                    msg: "Mật khẩu mới không trùng khớp",
                    checkStatus: checkChangePass,
                    error: errors,
                })
            }
        } else {
            errors = "errNotPassErr"
            return res.status(203).json({
                msg: "Mật khẩu cũ sai",
                checkStatus: checkChangePass,
                error: errors,
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",
        })
    }
}

exports.changeInfo = async (req, res, next) => {
    try {
        let checkChangeInfo = false;
        let errors = ""
        let changeinfo = req.query;
         if (changeinfo.fullname == "") {
            errors = "errNullFullname"
            return res.status(203).json({
                msg: "Không được để trống họ và tên",
                checkStatus: checkChangeInfo,
                error: errors,
            })
        }
        if (changeinfo.email == "") {
            errors = "errNullEmail"
            return res.status(203).json({
                msg: "Không được để trống email",
                checkStatus: checkChangeInfo,
                error: errors,
            })
        }
        if (changeinfo.phone == "") {
            errors = "errNullPhone"
            return res.status(203).json({
                msg: "Không được để trống số điện thoại",
                checkStatus: checkChangeInfo,
                error: errors,
            })
        }
        
        let user = await myDB.userModel.findById(req.params.id)
        user.fullname = changeinfo.fullname;
        user.email = changeinfo.email;
        user.phone = changeinfo.phone;
        checkChangeInfo = true;
        await myDB.userModel.findByIdAndUpdate(req.params.id, user)
        return res.status(200).json({
            msg: "Sửa thành công",
            checkStatus: checkChangeInfo,
            error: "",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",
        })
    }
}
