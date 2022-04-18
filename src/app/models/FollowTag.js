const {DataTypes, Model} = require('sequelize');

module.exports = (sequelize)=>{
  class FollowTag extends Model{};
  FollowTag.init({
    UserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "users",
        key: "id"
      },
      field: "user_id"
    },
    TagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "tags",
        key: "id"
      },
      field : "tag_id"
    }
  },{
    sequelize,
    timestamps: false,
    tableName: "follow_tags"
  })
  return FollowTag;
}