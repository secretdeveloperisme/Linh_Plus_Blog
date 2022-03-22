const {DataTypes, Model} = require('sequelize');

module.exports = (sequelize)=>{
  class FollowUser extends Model{};
  FollowUser.init({
    FollowerId: {
      type: DataTypes.INTEGER,
      unique: false,
      primaryKey: true,
      references: {
        model: "users",
        key: "id"
      },
      field: "follower_id"
    },
    UserId: {
      type: DataTypes.INTEGER,
      unique: false,
      primaryKey: true,
      references: {
        model: "users",
        key: "id"
      },
      field : "user_id"
    }
  },{
    sequelize,
    timestamps: false,
    tableName: "follow_users",
  })
  return FollowUser;
}