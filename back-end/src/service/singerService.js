import path from 'path';
import db, { Sequelize, sequelize } from '../models';
import fs from 'fs';
import { Op, where } from 'sequelize';
import bcryptjs from 'bcryptjs';
import * as jwt from './jwtService';
import { clearFile } from '../middleware/uploadFile';
const hashPassword = (password) => bcryptjs.hashSync(password, bcryptjs.genSaltSync(10));

export const createSingerService = (name, image, desc, username, password) =>
  new Promise(async (resolve, reject) => {
    try {
      const [singer, created] = await db.Singer.findOrCreate({
        where: {
          ...(username && password && { username: username, name: name }),
          ...(name && !username && { name: name }),
        },
        defaults: {
          username: username || null,
          password: password ? hashPassword(password) : null,
          name: name,
          image: image,
          desc: desc || null,
        },
      });
      if (!created) {
        resolve({
          status: 'ERROR',
          msg: 'This singer already exists',
        });
      }
      resolve({
        status: 'SUCCESS',
        data: singer,
      });
    } catch (error) {
      reject(error);
    }
  });

export const loginSingerService = (singerLogin) =>
  new Promise(async (resolve, reject) => {
    try {
      const { username, password } = singerLogin;
      const checkSinger = await db.Singer.findOne({
        where: {
          username: username,
        },
      });
      if (!checkSinger) {
        resolve({
          status: 'ERROR',
          msg: 'Singer does not exist',
        });
      } else {
        const checkPassword = bcryptjs.compareSync(password, checkSinger.password);
        if (!checkPassword) {
          resolve({
            status: 'ERROR',
            msg: 'The account being entered is incorrect',
          });
        } else {
          if (!checkSinger.status) {
            resolve({
              status: 'ERROR',
              msg: 'This account has been locked',
            });
          }
          const accessToken = jwt.renderAccessToken({
            id: checkSinger.id,
            isAdmin: false,
            isSinger: true,
          });
          const refreshToken = jwt.renderRefreshToken({
            id: checkSinger.id,
            isAdmin: false,
            isSinger: true,
          });
          resolve({
            accessToken: accessToken,
            refreshToken: refreshToken,
            status: 'SUCCESS',
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });

export const updateSingerService = (name, image, desc, id, status) =>
  new Promise(async (resolve, reject) => {
    try {
      const singer = await db.Singer.findByPk(id);
      if (!singer) {
        resolve({
          status: 'Error',
          msg: 'This singer is not defined',
        });
      }
      if (singer.image && image) {
        const clearImg = path.resolve(__dirname, '..', '', `public/${singer.image}`);
        fs.unlinkSync(clearImg);
      }
      await singer.update({ name: name, image: image, desc: desc, status: status });
      await singer.save();
      resolve({
        status: 'SUCCESS',
        data: singer,
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteManySingerService = (singerIds) =>
  new Promise(async (resolve, reject) => {
    try {
      const singersDeleted = await db.Singer.findAll({
        where: {
          id: {
            [Op.in]: singerIds,
          },
        },
      });
      const singerSongs = await db.SingerSong.findAll({
        where: {
          singerId: { [Op.in]: singerIds },
        },
      });
      const songIds = singerSongs.map((item) => item.songId);
      const listSongIds = await db.SingerSong.findAll({
        where: {
          songId: { [Op.in]: songIds },
        },
      });
      const listSingerIds = singerSongs.map((item) => item.singerId);
      const listIds = listSongIds.map((item) => item.singerId);
      const noLitst = listIds.filter((item) => !listSingerIds.includes(item));
      const noListSingerSong = await db.SingerSong.findAll({
        where: {
          singerId: { [Op.in]: noLitst },
        },
      });
      const idSong = noListSingerSong.map((item) => item.songId);
      const arrSongIds = songIds.filter((item) => !idSong.includes(item));
      if (arrSongIds.length > 0) {
        const songs = await db.Song.findAll({
          where: {
            id: { [Op.in]: arrSongIds },
          },
        });
        await db.Song.destroy({
          where: {
            id: { [Op.in]: arrSongIds },
          },
        });
        await db.Favorite.destroy({
          where: {
            songId: { [Op.in]: arrSongIds },
          },
        });
        await db.PLaylist.destroy({
          where: {
            songId: { [Op.in]: arrSongIds },
          },
        });
        songs.forEach((item) => {
          if (item.image) {
            const clearImg = path.resolve(__dirname, '..', '', `public/${item.image}`);
            fs.unlinkSync(clearImg);
          }
          if (item.link) {
            const clearLink = path.resolve(__dirname, '..', '', `public/${item.link}`);
            fs.unlinkSync(clearLink);
          }
        });
      }
      const albums = await db.Album.findAll({
        where: {
          singerId: { [Op.in]: singerIds },
        },
      });
      const albumIds = albums.map((item) => item.id);
      if (albumIds.length > 0) {
        await db.Album.destroy({
          where: {
            singerId: { [Op.in]: singerIds },
          },
        });

        await db.AlbumFavorite.destroy({
          where: {
            albumId: {
              [Op.in]: albumIds,
            },
          },
        });
        albums.forEach((item) => {
          if (item.image) clearFile(item.image);
        });
      }
      await db.SingerSong.destroy({
        where: {
          singerId: { [Op.in]: singerIds },
        },
      });
      const count = singersDeleted.length;
      if (count > 0) {
        await db.Singer.destroy({
          where: {
            id: {
              [Op.in]: singerIds,
            },
          },
        });
        await db.Follow.destroy({
          where: {
            singerId: {
              [Op.in]: singerIds,
            },
          },
        });
        singersDeleted.forEach((item) => {
          if (item.image) {
            const clearImg = path.resolve(__dirname, '..', '', `public/${item.image}`);
            fs.unlinkSync(clearImg);
          }
        });
      }
      resolve({
        status: 'SUCCESS',
        count: count,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getDetailSingerService = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const singer = await db.Singer.findOne({
        where: { id: id },
        include: [
          {
            model: db.User,
            as: 'followInfo',
            attributes: ['id', 'fullName'],
          },
        ],
      });
      if (!singer) {
        resolve({
          status: 'Error',
          msg: 'This singer is not defined',
        });
      }
      resolve({
        ststus: 'SUCCESS',
        data: singer,
        follow: singer.followInfo.length,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllSingerService = (limit = 10, offset = 0, trash = 0, singerName) =>
  new Promise(async (resolve, reject) => {
    try {
      const obj = {};
      const objLimit = {};
      if (singerName) obj.name = { [Op.substring]: singerName };
      if (limit) objLimit.limit = Number(limit);
      if (offset) objLimit.offset = Number(limit) * Number(offset);
      const singers = await db.Singer.findAndCountAll({
        where: { trash: trash, ...obj },
        ...objLimit,
        attributes: ['id', 'name', 'image', 'desc', 'status', 'username'],
        order: [['createdAt', 'DESC']],
      });
      if (!singers) {
        resolve({
          status: 'Error',
          msg: 'This singer is not defined',
        });
      }
      const singerFollows = [];
      for (const item of singers.rows) {
        const singerFollow = await db.Singer.findByPk(item.id, {
          include: [
            {
              model: db.User,
              as: 'followInfo',
            },
          ],
        });
        singerFollows.push({ ...item.dataValues, follows: singerFollow.followInfo.length });
      }
      resolve({
        ststus: 'SUCCESS',
        count: singers.count,
        data: singerFollows,
        currentPage: offset,
        totalPage: Math.ceil(singers.count / Number(limit)),
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatePrivateSingerService = (singerIds, trash = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const singers = await db.Singer.update(
        { trash: trash },
        {
          where: {
            id: {
              [Op.in]: singerIds,
            },
          },
        },
      );
      resolve({
        staus: 'SUCCESS',
        count: singers,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatePasswordService = (password, newPassword, id) =>
  new Promise(async (resolve, reject) => {
    try {
      const singer = await db.Singer.findByPk(id);
      if (!singer) {
        resolve({
          status: 'Error',
          msg: 'This user is not defined',
        });
      }
      const checkPassword = bcryptjs.compareSync(password, singer.password);
      if (!checkPassword) {
        resolve({
          status: 'ERROR',
          msg: 'Incorrect password',
        });
      }
      await singer.update({ password: hashPassword(newPassword) });
      await singer.save();
      resolve({
        status: 'SUCCESS',
        data: singer,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getSingleSongService = (singerId, limit = 5, offset = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const songs = await db.SingerSong.findAll({
        attributes: ['id', 'singerId', 'songId', [Sequelize.fn('COUNT', Sequelize.col('songId')), 'count']],
        group: ['songId'],
        having: {
          count: 1,
          singerId: singerId,
        },
        include: [
          {
            model: db.Song,
            as: 'songInfo',
          },
        ],
      });
      const listSongs = songs.map((item) => item.songInfo.id);
      const songOfSinger = await db.Song.findAll({
        where: { id: { [Op.in]: listSongs }, trash: false },
        limit: Number(limit),
        offset: Number(limit) * Number(offset),
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: db.Singer,
            as: 'singerInfo',
            attributes: ['id', 'name', 'image'],
          },
        ],
      });
      resolve({
        status: 'SUCCESS',
        data: songOfSinger,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getTopSongSingerService = (singerId, limit = 6, offset = 0, name = 'views', sort = 'DESC') =>
  new Promise(async (resolve, reject) => {
    try {
      const songs = await db.SingerSong.findAll({ where: { singerId: singerId } });
      const listSongs = songs.map((item) => item.songId);
      const topSongs = await db.Song.findAll({
        where: { id: { [Op.in]: listSongs }, trash: false },
        limit: Number(limit),
        offset: Number(limit) * Number(offset),
        order: [[name, sort]],
        include: [
          {
            model: db.Singer,
            as: 'singerInfo',
            attributes: ['id', 'name'],
          },
          {
            model: db.Album,
            as: 'albumInfo',
            attributes: ['id', 'name'],
          },
        ],
      });
      resolve({
        status: 'SUCCESS',
        data: topSongs,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getSongHaveSingerService = (singerId, limit) =>
  new Promise(async (resolve, reject) => {
    try {
      const obj = {};
      if (limit) obj.limit = Number(limit);
      const songs = await db.SingerSong.findAll({
        attributes: ['id', 'singerId', 'songId', [Sequelize.fn('COUNT', Sequelize.col('songId')), 'count']],
        group: ['songId'],
        having: {
          count: { [Op.gt]: 1 },
        },
        include: [
          {
            model: db.Song,
            as: 'songInfo',
          },
        ],
      });
      const listSongIds = songs.map((item) => item.songId);
      const manySingers = await db.SingerSong.findAll({
        where: {
          songId: { [Op.in]: listSongIds },
        },
      });
      const listSinger = manySingers.filter((item) => item.singerId == singerId);
      const listSongs = listSinger.map((item) => item.songId);
      const songHaveSinger = await db.Song.findAll({
        where: { id: { [Op.in]: listSongs }, trash: false },
        ...obj,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: db.Singer,
            as: 'singerInfo',
            attributes: ['id', 'name', 'image'],
          },
        ],
      });
      const listSingers = [];
      for (const singers of songHaveSinger) {
        listSingers.push(...singers.singerInfo);
      }
      const listIds = [...new Set(listSingers.map((item) => item.id))].filter((item) => item != singerId);
      const singers = await db.Singer.findAll({
        where: {
          id: listIds,
        },
        limit: 5,
        attributes: ['id', 'name', 'image'],
      });
      resolve({
        status: 'SUCCESS',
        data: songHaveSinger,
        singer: singers,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getHotSongBySingerRandomService = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const follow = await db.Follow.findAll({
        where: { userId: userId },
      });
      const singerIds = follow.map((item) => item.singerId);
      const singerRandom = Math.floor(Math.random() * singerIds.length);
      const singer = await db.Singer.findByPk(singerIds[singerRandom], {
        attributes: ['id', 'name', 'image'],
      });
      const songSinger = await db.SingerSong.findAll({
        where: {
          singerId: singerIds[singerRandom],
        },
      });
      const songIds = songSinger.map((item) => item.songId);
      const songs = await db.Song.findAll({
        where: {
          id: { [Op.in]: songIds },
        },
        limit: 5,
        order: [['views', 'DESC']],
        include: [
          {
            model: db.Singer,
            as: 'singerInfo',
            attributes: ['id', 'name'],
          },
        ],
      });
      resolve({
        status: 'SUCCESS',
        data: singer,
        song: songs,
      });
    } catch (error) {
      reject(error);
    }
  });
