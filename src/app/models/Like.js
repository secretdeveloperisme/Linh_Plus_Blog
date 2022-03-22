const {DataTypes, Model} = require('sequelize');

module.exports = (sequelize)=>{
  class Like extends Model{};
  Like.init({
    PostId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: false,
      references: {
        model: "posts",
        key: "id"
      },
      field : "post_id"
    },
    UserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: false,
      references: {
        model: "users",
        key: "id"
      },
      field: "user_id"
    },
    TypeLike: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "type_like"
    }
  },{
    sequelize,
    timestamps: false
  })
  return Like;
}