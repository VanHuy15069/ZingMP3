import db, { Sequelize } from '../models';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { clearFile } from '../middleware/uploadFile';
import { Op, where } from 'sequelize';
dotenv.config();

export const createAlbumService = (name, image, singerId) =>
  new Promise(async (resolve, reject) => {
    try {
      const [album, created] = await db.Album.findOrCreate({
        where: { name: name },
        defaults: {
          name: name,
          image: image,
          singerId: singerId,
        },
      });
      if (!created) {
        const clearImg = path.resolve(__dirname, '..', '', `public/${image}`);
        fs.unlinkSync(clearImg);
        resolve({
          status: 'ERROR',
          msg: 'This album already exists',
        });
      }
      resolve({
        status: 'SUCCESS',
        data: album,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateAlbumService = (name, image, singerId, albumId, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const album = await db.Album.findByPk(albumId);
      if (!album) {
        resolve({
          status: 'ERROR',
          msg: 'This album is not defined',
        });
      }
      jwt.verify(token, process.env.ACCESS_TOKEN, async function (err, singer) {
        if (err) {
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
        if (singer?.isAdmin) {
          if (image) clearFile(album.image);
          await album.update({ name: name, image: image, singerId: singerId });
          await album.save();
          resolve({
            status: 'SUCCESS',
            msg: 'Update successfully',
            data: { albumId, name, singerId },
          });
        } else if (singer?.isSinger && singer?.id == album.singerId) {
          if (image) clearFile(album.image);
          await album.update({ name: name, image: image });
          await album.save();
          resolve({
            status: 'SUCCESS',
            msg: 'Update successfully',
          });
        } else {
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });

export const getDetailAlbumService = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const album = await db.Album.findByPk(id, {
        include: [
          {
            model: db.Song,
            as: 'songInfo',
            include: [
              {
                model: db.Singer,
                as: 'singerInfo',
                attributes: ['id', 'name', 'image'],
              },
            ],
          },
        ],
      });
      const albumFavorite = await db.AlbumFavorite.findAndCountAll({
        where: { albumId: id },
      });
      const listSingers = [];
      for (const singers of album.songInfo) {
        listSingers.push(...singers.singerInfo);
      }
      const listSingerIds = new Set(listSingers.map((item) => item.id));
      const singers = await db.Singer.findAll({
        where: {
          id: { [Op.in]: [...listSingerIds] },
        },
        limit: 5,
        attributes: ['id', 'name', 'image'],
      });
      if (!album) {
        resolve({
          status: 'ERROR',
          msg: 'This album is not defined',
        });
      }
      resolve({
        status: 'SUCCESS',
        data: album,
        favorite: albumFavorite.count,
        singers: singers,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllAlbumSingerService = (singerIds, limit = 10, offset = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const albums = await db.Album.findAndCountAll({
        where: { singerId: { [Op.in]: singerIds } },
        limit: limit,
        offset: Number(limit) * Number(offset),
      });
      resolve({
        status: 'SUCCESS',
        data: albums,
        currentPage: offset,
        totalPage: Math.ceil(albums.count / Number(limit)),
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllAlbumsService = (limit, offset, albumName, trash = false, name = 'createdAt', sort = 'DESC') =>
  new Promise(async (resolve, reject) => {
    try {
      const objName = {};
      const obj = {};
      if (albumName) objName.name = { [Op.substring]: albumName };
      if (limit) obj.limit = Number(limit);
      if (offset) obj.offset = Number(limit) * Number(offset);
      const albums = await db.Album.findAndCountAll({
        where: { trash: trash, ...objName },
        ...obj,
        order: [[name, sort]],
        include: [
          {
            model: db.Singer,
            as: 'singerInfo',
            attributes: ['id', 'name'],
          },
          {
            model: db.Song,
            as: 'songInfo',
          },
        ],
      });
      resolve({
        status: 'SUCCESS',
        data: albums,
        currentPage: offset,
        totalPage: Math.ceil(albums.count / Number(limit)),
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateTrashAlbumService = (albumIds, trash = 0, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const albums = await db.Album.findAll({ where: { id: { [Op.in]: albumIds } } });
      if (!albums) {
        resolve({
          status: 'ERROR',
          msg: 'This albums is not defined',
        });
      }
      jwt.verify(token, process.env.ACCESS_TOKEN, async function (err, singer) {
        if (err) {
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
        if (singer?.isAdmin) {
          const albumsDelete = await db.Album.update({ trash: trash }, { where: { id: { [Op.in]: albumIds } } });
          resolve({
            status: 'SUCCESS',
            count: albumsDelete,
          });
        } else if (singer?.isSinger && albumIds.length === 1 && singer?.id == albums[0].singerId) {
          const albumsDelete = await db.Album.update({ trash: trash }, { where: { id: { [Op.in]: albumIds } } });
          resolve({
            status: 'SUCCESS',
            count: albumsDelete,
          });
        } else {
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteManyAlbumServive = (albumIds, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const albums = await db.Album.findAll({ where: { id: { [Op.in]: albumIds } } });
      if (!albums) {
        resolve({
          status: 'ERROR',
          msg: 'This albums is not defined',
        });
      }
      jwt.verify(token, process.env.ACCESS_TOKEN, async function (err, singer) {
        if (err) {
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
        if (singer?.isAdmin) {
          albums.forEach((item) => {
            if (item.image) clearFile(item.image);
          });
          await db.Song.update({ albumId: null }, { where: { albumId: { [Op.in]: albumIds } } });
          const albumsDelete = await db.Album.destroy({ where: { id: { [Op.in]: albumIds } } });
          await db.AlbumFavorite.destroy({
            where: {
              albumId: { [Op.in]: albumIds },
            },
          });
          resolve({
            status: 'SUCCESS',
            count: albumsDelete,
          });
        } else if (singer?.isSinger && albumIds.length === 1 && singer?.id == albums[0].singerId) {
          albums.forEach((item) => {
            if (item.image) clearFile(item.image);
          });
          await db.Song.update({ albumId: null }, { where: { albumId: { [Op.in]: albumIds } } });
          const albumsDelete = await db.Album.destroy({ where: { id: { [Op.in]: albumIds } } });
          await db.AlbumFavorite.destroy({
            where: {
              albumId: { [Op.in]: albumIds },
            },
          });
          resolve({
            status: 'SUCCESS',
            count: albumsDelete,
          });
        } else {
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAlbumHotService = (limit = 5) =>
  new Promise(async (resolve, reject) => {
    try {
      const albums = await db.Song.findAll({
        attributes: ['id', 'albumId', [Sequelize.fn('SUM', Sequelize.col('views')), 'sum']],
        group: ['albumId'],
        order: [['sum', 'DESC']],
        limit: Number(limit),
        include: [
          {
            model: db.Album,
            as: 'albumInfo',
            include: [
              {
                model: db.Singer,
                as: 'singerInfo',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
      });
      const hotAlbums = albums.filter((album) => album.albumId !== null);
      const listIds = hotAlbums.map((item) => item.albumId);
      const album = await db.Album.findAll({
        where: {
          id: { [Op.in]: listIds },
        },
        include: [
          {
            model: db.Song,
            as: 'songInfo',
            include: [
              {
                model: db.Singer,
                as: 'singerInfo',
                attributes: ['id', 'name'],
              },
            ],
          },
          {
            model: db.Singer,
            as: 'singerInfo',
            attributes: ['id', 'name'],
          },
        ],
      });
      resolve({
        status: 'SUCCESS',
        data: album,
      });
    } catch (error) {
      reject(error);
    }
  });

export const checkFavoriteService = (userId, albumId) =>
  new Promise(async (resolve, reject) => {
    try {
      if (userId) {
        const isFavorite = await db.AlbumFavorite.findOne({
          where: { userId: userId, albumId: albumId },
        });
        if (isFavorite) {
          resolve({
            status: 'SUCCESS',
            data: true,
          });
        } else {
          resolve({
            status: 'SUCCESS',
            data: false,
          });
        }
      } else {
        resolve({
          status: 'SUCCESS',
          data: false,
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const getAlbumBySingerService = (singerIds, limit = 10, offset = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const obj = {};
      if (limit) obj.limit = Number(limit);
      if (offset) obj.offset = Number(limit) * Number(offset);
      const album = await db.Album.findAll({
        where: { singerId: { [Op.in]: singerIds } },
        ...obj,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: db.Singer,
            as: 'singerInfo',
          },
        ],
      });
      resolve({
        status: 'SUCCESS',
        data: album,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAlbumFavoriteService = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const albums = await db.Album.findAll({
        include: [
          {
            model: db.AlbumFavorite,
            as: 'albumFavorite',
            where: { userId: userId },
          },
          {
            model: db.Song,
            as: 'songInfo',
          },
          {
            model: db.Singer,
            as: 'singerInfo',
            attributes: ['id', 'name'],
          },
        ],
      });
      resolve({
        status: 'SUCCESS',
        data: albums,
      });
    } catch (error) {
      reject(error);
    }
  });
