'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Follow.belongsTo(models.User, { foreignKey: 'userId', as: 'userFollow' });
      Follow.belongsTo(models.Singer, { foreignKey: 'singerId', as: 'singerInfo' });
    }
  }
  Follow.init(
    {
      userId: DataTypes.INTEGER,
      singerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Follow',
    },
  );
  return Follow;
};
