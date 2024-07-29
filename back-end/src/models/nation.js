'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Nation.hasMany(models.Song, { foreignKey: 'nationId', as: 'songInfo' });
    }
  }
  Nation.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      trash: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Nation',
    },
  );
  return Nation;
};
