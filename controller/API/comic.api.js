var myDB = require('../../models/comic.model')
var myDBFavorite = require('../../models/user.model')
var fs = require('fs')
var socket = require('../../socket_server');

exports.list = async (req, res, next) => {
    try {
        //lọc theo name
        if (req.query.name) {
            let data = await myDB.comicModel.find({ name: { $regex: req.query.name } })
            return res.status(200).json({
                msg: "Lọc theo TÊN TRUYỆN thành công",
                data: data,
            })
        }
        //lọc theo price
        if (req.query.publishing_year) {
            let data = await myDB.comicModel.find({ publishing_year: req.query.publishing_year })
            return res.status(200).json({
                msg: "Lọc theo NĂM XUẤT BẢN thành công",
                data: data,
            })
        }
        //lọc theo id_cate
        if (req.query.writer_name) {
            let data = await myDB.comicModel.find({ writer_name: req.query.writer_name })
            return res.status(200).json({
                msg: "Lọc theo TÊN TÁC GIẢ thành công",
                data: data,
            })
        }
        //api phân trang http://localhost:3000/product?limit=&page=
        if (req.query.limit && req.query.page) {
            let skip = (req.query.page - 1) * req.query.limit;
            let total = await myDB.comicModel.countDocuments();
            let data = await myDB.comicModel.find().skip(skip).limit(req.query.limit);
            let totalPage = Math.ceil(total / req.query.limit);
            if (req.query.page > totalPage) {
                return res.status(203).json({
                    msg: "Fail Load Data",
                })
            }
            return res.status(200).json({
                msg: "Successful Data Paging",
                data: data,
            })
        }
        // load toàn bộ 
        let list = await myDB.comicModel.find()
        return res.status(200).json({
            msg: "Successful Data Comic",
            data: list
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",

        })
    }

}

exports.detail = async (req, res, next) => {
    try {
        let detail = await myDB.comicModel.findById(req.params.id)
        let favorite = await myDBFavorite.favoriteModel.find({id_comic: req.params.id}).countDocuments()
        return res.status(200).json({
            msg: "Load Detail Comic Successful",
            data: detail,
            sum: favorite,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",
        })
    }
}

exports.read = async (req, res, next) => {
    try {
        let comic = await myDB.comicModel.findById(req.params.id)
        let read = comic.list_photo
        return res.status(200).json({
            msg: "Load Read Comic Successful",
            data: read
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
        let obj = new myDB.comicModel(req.body)
        try {
            const images = req.files;
            if(images){
                for(let key in images){
                   if(key == "cover-img"){
                       images[key].forEach(element => {
                           fs.renameSync(element.path,"./public/comic_upload/" + element.originalname);
                           obj.cover_img = "/comic_upload/" + element.originalname
                       });
                   }
                   else if (key =="list-img"){
                       images[key].forEach(element => {
                           fs.renameSync(element.path,"./public/photo_upload/" + element.originalname);
                           let url = "/photo_upload/" + element.originalname
                           obj.list_photo.push(url);
                       });
                   }
                }
             }
        } catch (error) {
            console.log("Lỗi đọc file " + error);
        }
        let new_prod = await obj.save()
        socket.io.emit("add comic", "Readmiu vừa thêm truyện mới "+ req.body.name)
        return res.status(201).json({
            msg: "Successful Add Product",
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
        let obj = await myDB.comicModel.findById(req.params.id)
        try {
            const images = req.files;
            if(images){
                for(let key in images){
                   if(key == "cover-img"){
                       images[key].forEach(element => {
                           fs.renameSync(element.path,"./public/comic_upload/" + element.originalname);
                           obj.cover_img = "/comic_upload/" + element.originalname
                       });
                   }
                   else if (key =="list-img"){
                       images[key].forEach(element => {
                           fs.renameSync(element.path,"./public/photo_upload/" + element.originalname);
                           let url = "/photo_upload/" + element.originalname
                           obj.list_photo.push(url);
                       });
                   }
                }
             }
        } catch (error) {
            console.log("Lỗi đọc file " + error);
        }
        obj.name = req.body.name
        obj.story_desc = req.body.story_desc
        obj.writer_name = req.body.writer_name
        obj.publishing_year = req.body.publishing_year
        obj.story_content = req.body.story_content

        await myDB.comicModel.findByIdAndUpdate(req.params.id, obj)
        return res.status(200).json({
            msg: "Successful Edit Comic",
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
        await myDB.comicModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            msg: " Successful Delete Comic"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Server Error",

        })
    }
}