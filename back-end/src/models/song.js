'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Song.belongsToMany(models.User, { foreignKey: 'songId', through: models.Favorite, as: 'favoriteInfo' });
      Song.belongsToMany(models.Singer, { foreignKey: 'songId', through: models.SingerSong, as: 'singerInfo' });
      Song.belongsToMany(models.PLaylist, { foreignKey: 'songId', through: models.SongPlaylist, as: 'playlistInfo' });
      Song.belongsTo(models.Nation, { foreignKey: 'nationId', as: 'nationInfo' });
      Song.belongsTo(models.Topic, { foreignKey: 'topicId', as: 'topicInfo' });
      Song.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'categoryInfo' });
      Song.belongsTo(models.Album, { foreignKey: 'albumId', as: 'albumInfo' });
    }
  }
  Song.init(
    {
      nationId: DataTypes.INTEGER,
      topicId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      albumId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      link: DataTypes.STRING,
      image: DataTypes.STRING,
      views: DataTypes.INTEGER,
      vip: DataTypes.BOOLEAN,
      trash: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Song',
    },
  );
  return Song;
};
