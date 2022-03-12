const {DataTypes, Model} = require('sequelize');

module.exports = (sequelize)=>{
  class Bookmark extends Model{};
  Bookmark.init({
    UserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "users",
        key: "id"
      },
      field: "user_id"
    },
    PostId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "post",
        key: "id"
      },
      field : "post_id"
    }
  },{
    sequelize,
    timestamps: false
  })
  return Bookmark;
}