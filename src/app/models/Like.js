const {DataTypes, Model} = require('sequelize');

module.exports = (sequelize)=>{
  class Like extends Model{};
  Like.init({
    PostId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "posts",
        key: "id"
      },
      field : "post_id"
    },
    UserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "users",
        key: "id"
      },
      field: "user_id"
    }
  },{
    sequelize,
    timestamps: false
  })
  return Like;
}