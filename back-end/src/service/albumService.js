import db from '../models';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { clearFile } from '../middleware/uploadFile';
import { Op } from 'sequelize';
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
          resolve({
            status: 'SUCCESS',
            msg: 'Update successfully',
          });
        } else if (singer?.isSinger && singer?.id == album.singerId) {
          if (image) clearFile(album.image);
          await album.update({ name: name, image: image });
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
            model: db.Singer,
            as: 'singerInfo',
            attributes: ['id', 'name', 'image'],
          },
          {
            model: db.Song,
            as: 'songInfo',
          },
        ],
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
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllAlbumSingerService = (singerId, limit = 10, offset = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const albums = await db.Album.findAndCountAll({
        where: { singerId: singerId },
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

export const getAllAlbumsService = (limit = 10, offset = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const albums = await db.Album.findAndCountAll({
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
      const songs = await db.Song.findAll({ where: { albumId: { [Op.in]: albumIds } } });
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
