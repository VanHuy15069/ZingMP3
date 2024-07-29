'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SingerSong extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SingerSong.belongsTo(models.Song, { foreignKey: 'songId', as: 'songInfo' });
      SingerSong.belongsTo(models.Singer, { foreignKey: 'singerId', as: 'singerInfo' });
    }
  }
  SingerSong.init(
    {
      songId: DataTypes.INTEGER,
      singerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'SingerSong',
    },
  );
  return SingerSong;
};
