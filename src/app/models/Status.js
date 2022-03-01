const {Sequelize, DataTypes, Model} = require('sequelize');

module.exports = (sequelize)=>{
  class Status extends Model{};
  Status.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  },{
    sequelize,
    timestamps: false
  })
  return Status;
}