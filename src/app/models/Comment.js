const {DataTypes, Model} = require('sequelize');

module.exports = (sequelize)=>{
  class Comment extends  Model{};
  Comment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    CommentId: {
      type : DataTypes.INTEGER,
      allowNull: true, 
      references: {
        model: "comments",
        key: "id"
      },
      field: "parent_id"
    },
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key : "id"
      },
      allowNull: false,
      field: "user_id"
    },
    PostId: {
      type: DataTypes.INTEGER,
      references: {
        model: "posts",
        key : "id"
      },
      field: "post_id",
      allowNull: false
    },
    content: {
      type : DataTypes.STRING(1000),
      allowNull: false
    }
  },{
    sequelize,
    createdAt: true,
    updatedAt: false
  })
  return Comment;
}