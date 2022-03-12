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
    dob: {
      type: DataTypes.DATEONLY,
      allowNull:true,
      validate: {
       isDate: true,
      }
    }
  },
  {
    sequelize,
    createdAt: true,
    updatedAt: false,
    hooks:{
      beforeCreate: (user, option)=>{
        let now = new Date();
        now.setFullYear(now.getFullYear() - 8);
        let dob = new Date(user.dob);
        console.log(dob);
        console.log(now);
        if(dob > now){
          throw new Error("Date of birth is not valid");
        }
      }
    }
  })
  return User;
}