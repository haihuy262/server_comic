var DB = require('../data/database');

const userSchema = new DB.mongoose.Schema(
    {
        avata       : {type : String  , require : false },
        username    : {type : String  , require : true  },
        password    : {type : String  , require : true  },
        fullname    : {type : String  , require : false },
        email       : {type : String  , require : false },
        phone       : {type : String  , require : false },
        acc_status  : {type : Boolean , require : true, default: true},
        role        : {type : Boolean , require : false },
    },
    {
        collection : 'Tb_User'
    }
)
let userModel = DB.mongoose.model('userModel' , userSchema);

const favoriteSchema = new DB.mongoose.Schema(
    {
        id_user  : { type : DB.mongoose.Schema.Types.ObjectId , ref : 'userModel' },
        id_comic : { type : DB.mongoose.Schema.Types.ObjectId , ref : 'comicModel'},
        favorite : { type : Boolean , require : false },  // nội dung cmt
    },
    {
        collection : 'Tb_Favorite'
    }
)
let favoriteModel = DB.mongoose.model('favoriteModel' , favoriteSchema);

module.exports = {userModel, favoriteModel}