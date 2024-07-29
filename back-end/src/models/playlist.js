'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PLaylist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PLaylist.belongsTo(models.User, { foreignKey: 'userId', as: 'userInfo' });
      PLaylist.belongsToMany(models.Song, { foreignKey: 'playlistId', through: models.SongPlaylist, as: 'songInfo' });
    }
  }
  PLaylist.init(
    {
      name: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'PLaylist',
    },
  );
  return PLaylist;
};
