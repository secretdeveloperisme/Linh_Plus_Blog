const {DataTypes, Model} = require('sequelize');

module.exports = (sequelize)=>{
  class PostTag extends Model{};
  PostTag.init({
    PostId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "posts",
        key: "id"
      },
      field: "post_id"
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
    tableName: "post_tags"
  })
  return PostTag;
}