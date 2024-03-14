var DB = require("../data/database");

const comicSchema = new DB.mongoose.Schema(
  {
    name: { type: String, require: true }, // tên truyện
    story_desc: { type: String, require: false }, // mô tả truyện
    writer_name: { type: String, require: true }, // tên tác giả
    publishing_year: { type: String, require: true }, // năm xuất bản
    image: { type: String, require: false }, // ảnh bìa
    pdf: { type: String, require: false }, // ds ảnh nd truyện
  },
  {
    collection: "Tb_Comic",
  }
);
let comicModel = DB.mongoose.model("comicModel", comicSchema);

const commentSchema = new DB.mongoose.Schema(
  {
    id_user: { type: DB.mongoose.Schema.Types.ObjectId, ref: "userModel" },
    id_comic: { type: DB.mongoose.Schema.Types.ObjectId, ref: "comicModel" },
    cmt_content: { type: String, require: false }, // nội dung cmt
    cmt_date: { type: Date, require: false }, // ngày comment
  },
  {
    collection: "Tb_Comment",
  }
);
let commentModel = DB.mongoose.model("commentModel", commentSchema);

module.exports = { comicModel, commentModel };
