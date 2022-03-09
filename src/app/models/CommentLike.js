const {DataTypes, Model} = require('sequelize');

module.exports = (sequelize)=>{
  class CommentLikes extends Model{};
  CommentLikes.init({
    CommentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "comments",
        key: "id"
      },
      field: "comment_id"
    },
    UserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "users",
        key: "id"
      },
      field : "user_id"
    },
    TypeLike: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "type_like"
    }
  },{
    sequelize,
    timestamps: false,
    tableName: "comment_likes"
  })
  return CommentLikes;
}