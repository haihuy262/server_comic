var myDB = require('../../models/user.model')
var fs = require('fs')
// const bcrypt = require('bcrypt');


exports.list = async (req, res, next) => {
    try {
        //lọc theo username
        if (req.query.username) {
            let data = await myDB.userModel.findOne({ username: req.query.username })
            return res.status(200).json({
                msg: "Successful Data Username",
                data: data,
            })
        }
        //lọc theo email
        if (req.query.email) {
            let list = await myDB.userModel.find({ email: { $regex: req.query.email } })
            return res.status(200).json({
                msg: "Successful Data Email",
                data: list,
            })
        }
        //lọc theo vai trò
        if (req.query.id_role) {
            let list = await myDB.userModel.find({ id_role: req.query.id_role })
            return res.status(200).json({
                msg: "Successful Data Id_role",
                data: list,
            })
        }
        //api phân trang http://localhost:3000/user?limit=&page=
        if (req.query.limit && req.query.page) {
            let skip = (req.query.page - 1) * req.query.limit;
            let total = await myDB.userModel.countDocuments();
            let data = await myDB.userModel.find().skip(skip).limit(req.query.limit)
            let sum = await myDB.userModel.find().count()
            let totalPage = Math.ceil(total / req.query.limit);
            if (req.query.page > totalPage) {
                return res.status(203).json({
                    msg: "Fail Load Data",
                })
            }

            return res.status(200).json({
                msg: "Successful Data Paging",
                sum: sum,
                data: data,
            })
        }
        // load toàn bộ
        let list = await myDB.userModel.find()
        let sum = await myDB.userModel.find().count()
        return res.status(200).json({
            msg: " Successful Data User",
            sum: sum,
            data: list,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",

        })
    }

}

exports.add = async (req, res, next) => {
    try {
        let obj = new myDB.userModel(req.body);
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

        let new_user = await obj.save()
        return res.status(201).json({
            msg: " Successful Add User",
            data: new_user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",

        })
    }
}

exports.edit = async (req, res, next) => {
    try {
        let obj = await myDB.userModel.findById(req.params.id)
        obj.fullname = req.body.fullname
        obj.age = req.body.age
        obj.email = req.body.email
        obj.phone = req.body.phone
        obj.address = req.body.address
        try {
            if (req.file) {
                fs.renameSync(req.file.path, './public/avata_upload/' + req.file.originalname)
                obj.avata = '/avata_upload/' + req.file.originalname
            }
        } catch (error) {
            console.log("================= Ảnh lỗi rồi m ơi: " + error.message);
        }

        await myDB.userModel.findByIdAndUpdate(req.params.id, obj)
        return res.status(200).json({
            msg: " Successful Edit User",
            data: obj
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",

        })
    }
}

exports.delete = async (req, res, next) => {
    try {
        await myDB.userModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            msg: " Successful Delete User"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",

        })
    }
}
