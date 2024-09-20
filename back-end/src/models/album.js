'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Album.hasMany(models.Song, { foreignKey: 'albumId', as: 'songInfo' });
      Album.belongsTo(models.Singer, { foreignKey: 'singerId', as: 'singerInfo' });
      Album.hasMany(models.AlbumFavorite, { foreignKey: 'albumId', as: 'albumFavorite' });
    }
  }
  Album.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      singerId: DataTypes.INTEGER,
      trash: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Album',
    },
  );
  return Album;
};
