const mongoose = require('mongoose');
// mongoose.connect('mongodb+srv://cuongnb:j77bkfMNKSzDp13Y@adr-nwk.leqnfi8.mongodb.net/ShopeeManage?retryWrites=true&w=majority')
mongoose.connect('mongodb://127.0.0.1:27017/ReadMiu')
        .catch((err) =>{
            console.log("Loi ket noi CSDL");
            console.log(err);
        });

module.exports= {mongoose}