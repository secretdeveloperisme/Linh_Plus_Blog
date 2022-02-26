const {DataTypes, Model} = require('sequelize');
const bcryptjs = require("bcryptjs");
module.exports = (sequelize)=>{
  class User extends Model{} ;
  User.init({
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    passwordHash:{
      type: DataTypes.STRING(128),
      allowNull:false,
      field: "password_hash",
      set(value){
        this.setDataValue("passwordHash", bcryptjs.hashSync(value));
      }
    },
    gender: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: "m"
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email:{
      type:DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    biography: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    address:{
      type: DataTypes.STRING(255),
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER({length:3}),
      allowNull:true,
      validate: {
        max: 150,
        min: 13
      }
    }
  },
  {
    sequelize,
    createdAt: true,
    updatedAt: false,
  })
  return User;
}