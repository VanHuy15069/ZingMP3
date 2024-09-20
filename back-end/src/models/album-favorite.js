'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AlbumFavorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AlbumFavorite.belongsTo(models.Album, { foreignKey: 'albumId', as: 'albumInfo' });
      AlbumFavorite.belongsTo(models.User, { foreignKey: 'userId', as: 'userInfo' });
    }
  }
  AlbumFavorite.init(
    {
      albumId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'AlbumFavorite',
    },
  );
  return AlbumFavorite;
};
