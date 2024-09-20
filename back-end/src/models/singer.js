'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Singer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Singer.belongsToMany(models.User, { foreignKey: 'singerId', through: models.Follow, as: 'followInfo' });
      Singer.belongsToMany(models.Song, { foreignKey: 'singerId', through: models.SingerSong, as: 'songInfo' });
      Singer.hasMany(models.Album, { foreignKey: 'singerId', as: 'singerInfo' });
    }
  }
  Singer.init(
    {
      username: DataTypes.STRING,
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      password: DataTypes.STRING,
      desc: DataTypes.TEXT('long'),
      status: DataTypes.BOOLEAN,
      trash: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Singer',
    },
  );
  return Singer;
};
