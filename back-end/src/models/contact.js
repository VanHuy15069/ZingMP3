'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contact.init(
    {
      fullName: DataTypes.STRING,
      phone: DataTypes.STRING,
      problem: DataTypes.STRING,
      email: DataTypes.STRING,
      content: DataTypes.TEXT('long'),
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Contact',
    },
  );
  return Contact;
};
