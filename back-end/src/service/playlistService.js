import db from '../models';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
dotenv.config();

export const createPlaylistService = (name, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const [playlist, created] = await db.PLaylist.findOrCreate({
        where: { name: name, userId: userId },
      });
      if (!created) {
        resolve({
          status: 'ERROR',
          msg: 'This playlist already exists',
        });
      }
      resolve({
        status: 'SUCCESS',
        data: playlist,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatePlaylistService = (name, id, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const playlist = await db.PLaylist.findByPk(id);
      if (!playlist) {
        resolve({
          status: 'ERROR',
          msg: 'This playlist is not defined',
        });
      }
      jwt.verify(token, process.env.ACCESS_TOKEN, async function (err, user) {
        if (err) {
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
        if (user?.id == playlist.userId) {
          await playlist.update({ name: name });
          await playlist.save();
          resolve({
            status: 'SUCCESS',
            data: playlist,
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

export const deletePlaylistService = (id, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const playlist = await db.PLaylist.findByPk(id);
      if (!playlist) {
        resolve({
          status: 'ERROR',
          msg: 'This playlist is not defined',
        });
      }
      jwt.verify(token, process.env.ACCESS_TOKEN, async function (err, user) {
        if (err) {
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
        if (user?.id == playlist.userId) {
          await playlist.destroy();
          await db.SongPlaylist.destroy({ where: { playlistId: id } });
          resolve({
            status: 'SUCCESS',
            data: playlist,
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

export const addSongToPlaylistService = (playlistId, songId, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const playlist = await db.PLaylist.findByPk(playlistId);
      if (!playlist) {
        resolve({
          status: 'ERROR',
          msg: 'This playlist is not defined',
        });
      }
      jwt.verify(token, process.env.ACCESS_TOKEN, async function (err, user) {
        if (err) {
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
        if (user?.id == playlist.userId) {
          const [playlistSong, created] = await db.SongPlaylist.findOrCreate({
            where: { playlistId: playlistId, songId: songId },
          });
          if (!created) {
            resolve({
              status: 'DEFINED',
              msg: 'The song already exists in the playlist',
            });
          }
          resolve({
            status: 'SUCCESS',
            data: playlistSong,
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

export const getDetaiPlaylistService = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const playlist = await db.PLaylist.findByPk(id, {
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
      if (!playlist) {
        resolve({
          status: 'ERROR',
          msg: 'This playlist is not defined',
        });
      }
      const listSingers = [];
      for (const singers of playlist.songInfo) {
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
      resolve({
        status: 'SUCCESS',
        data: playlist,
        singers: singers,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllPlaylistService = (userId, limit, name) =>
  new Promise(async (resolve, reject) => {
    try {
      const objLimit = {};
      if (limit) objLimit.limit = Number(limit);
      const namePlaylist = {};
      if (name) namePlaylist.name = { [Op.substring]: name };
      const playlists = await db.PLaylist.findAll({
        where: { userId: userId, ...namePlaylist },
        ...objLimit,
        order: [['createdAt', 'DESC']],
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
        ],
      });
      resolve({
        status: 'SUCCESS',
        data: playlists,
      });
    } catch (error) {
      reject(error);
    }
  });

export const removeSongPlaylistService = (playlistId, songId, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const playlist = await db.PLaylist.findByPk(playlistId);
      if (!playlist) {
        resolve({
          status: 'ERROR',
          msg: 'This playlist is not defined',
        });
      }
      jwt.verify(token, process.env.ACCESS_TOKEN, async function (err, user) {
        if (err) {
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
        if (user?.id == playlist.userId) {
          const songDelete = await db.SongPlaylist.destroy({ where: { playlistId: playlistId, songId: songId } });
          resolve({
            satatus: 'SUCCESS',
            data: songDelete,
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
