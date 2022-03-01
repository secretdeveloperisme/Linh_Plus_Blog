const {DataTypes, Model} = require('sequelize');
module.exports = (sequelize)=>{
  class Post extends Model{}
  Post.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      field: "user_id",
      allowNull: false
    },
    title:{
      type: DataTypes.STRING(255), 
      allowNull: false
    },
    slug:{
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    StatusId : {
      type: DataTypes.INTEGER,
      references: {
        model: "statuses",
        key: "id",
      },
      field: "status_id",
      allowNull: false
    }
  },{
    sequelize,
    createdAt: true,
    updatedAt: true,
    paranoid: true
  })
  return Post;
}