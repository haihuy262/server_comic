var myDB = require('../../models/user.model')
var fs = require('fs')
// const bcrypt = require('bcrypt');


exports.list = async (req, res, next) => {
    try {
        //api phân trang http://localhost:3000/user?limit=&page=
        // if (req.query.limit && req.query.page) {
        //     let skip = (req.query.page - 1) * req.query.limit;
        //     let total = await myDB.favoriteModel.countDocuments();
        //     let data = await myDB.favoriteModel.find().skip(skip).limit(req.query.limit)
        //     let totalPage = Math.ceil(total / req.query.limit);
        //     if (req.query.page > totalPage) {
        //         return res.status(203).json({
        //             msg: "Fail Load Data",
        //         })
        //     }

        //     return res.status(200).json({
        //         msg: "Successful Data Paging",
        //         data: data,
        //     })
        // }
        // load toàn bộ
        let list = await myDB.favoriteModel.find({id_user: req.params.id}).populate('id_comic')
        return res.status(200).json({
            msg: " Successful Data User",
            data: list,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",

        })
    }

}

exports.getOne = async (req, res, next) => {
    try {
        let status = false;
        let list = await myDB.favoriteModel.findOne({id_user: req.query.iduser , id_comic: req.query.idcomic})
        if(list){
            status = true;
            return res.status(200).json({
                msg: "yes",
                status: status,
            })
        }
        return res.status(200).json({
            msg: "no",
            status: status,
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
        let obj = new myDB.favoriteModel(req.body);
        await obj.save()
        return res.status(201).json({
            msg: " Successful Add Favorite",
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
        await myDB.favoriteModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            msg: " Successful Delete Favorite"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",

        })
    }
}