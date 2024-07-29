'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Singer, { foreignKey: 'userId', through: models.Follow, as: 'followInfo' });
      User.belongsToMany(models.Song, { foreignKey: 'userId', through: models.Favorite, as: 'favoriteInfo' });
      User.hasMany(models.PLaylist, { foreignKey: 'userId', as: 'playlistInfo' });
    }
  }
  User.init(
    {
      fullName: DataTypes.STRING,
      username: DataTypes.STRING,
      passWord: DataTypes.STRING,
      email: DataTypes.STRING,
      image: DataTypes.STRING,
      vip: DataTypes.BOOLEAN,
      isAdmin: DataTypes.BOOLEAN,
      status: DataTypes.BOOLEAN,
      trash: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
