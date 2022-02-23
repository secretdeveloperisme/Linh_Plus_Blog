const {DataTypes, Model} = require("sequelize");

module.exports = (sequelize)=>{
  class UserRole extends Model{};
  UserRole.init({
    UserId : {
      primaryKey: true,
      type:  DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: "users",
        key: "id"
      },
      field: "user_id"
    },
    RoleId: {
      primaryKey: true,
      type:  DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: "roles",
        key: "id"
      },
      field: "role_id"
    },
  },{
    sequelize,
    timestamps: false,
    tableName: "user_role"
  })
  return UserRole;
}