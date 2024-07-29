import db from '../models';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
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
              status: 'ERROR',
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
          },
        ],
      });
      if (!playlist) {
        resolve({
          status: 'ERROR',
          msg: 'This playlist is not defined',
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

export const getAllPlaylistService = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const playlists = await db.PLaylist.findAll({ where: { userId: userId } });
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
