const {DataTypes, Model} = require('sequelize');

module.exports = (sequelize)=>{
  class PostCategory extends Model{};
  PostCategory.init({
    PostId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "posts",
        key: "id"
      },
      field: "post_id"
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "categories",
        key: "id"
      },
      field: "category_id"
    }
  },{
    sequelize,
    timestamps: false,
    tableName: "post_categories"
  })
  return PostCategory;
}