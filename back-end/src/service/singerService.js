import path from 'path';
import db, { Sequelize, sequelize } from '../models';
import fs from 'fs';
import { Op } from 'sequelize';
import bcryptjs from 'bcryptjs';
import * as jwt from './jwtService';

const hashPassword = (password) => bcryptjs.hashSync(password, bcryptjs.genSaltSync(10));

export const createSingerService = (name, image, desc, username, password) =>
  new Promise(async (resolve, reject) => {
    try {
      const [singer, created] = await db.Singer.findOrCreate({
        where: {
          [Op.or]: [{ username: username || '' }, { name: name }],
        },
        defaults: {
          username: username,
          password: password || null,
          name: name,
          image: image,
          desc: desc,
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
            isSinger: true,
          });
          const refreshToken = jwt.renderRefreshToken({
            id: checkSinger.id,
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

export const updateSingerService = (name, image, desc, id) =>
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
      await singer.update({ name: name, image: image, desc: desc });
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
      if (singerSongs) {
        const arrSongIds = [];
        for (const item of singerSongs) {
          if (!arrSongIds.includes(item.songId)) {
            arrSongIds.push(item.songId);
          }
        }
        const songs = await db.Song.findAll({
          where: {
            id: { [Op.in]: arrSongIds },
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
        await db.Song.destroy({
          where: {
            id: { [Op.in]: arrSongIds },
          },
        });
        await db.SingerSong.destroy({
          where: {
            singerId: { [Op.in]: singerIds },
          },
        });
      }
      const count = singersDeleted.length;
      if (count > 0) {
        await db.Singer.destroy({
          where: {
            id: {
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

export const getAllSingerService = (limit = 10, offset = 0, trash = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const singers = await db.Singer.findAndCountAll({
        where: { trash: trash },
        limit: Number(limit),
        offset: Number(limit) * Number(offset),
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
        data: singerFollows,
        currentPage: offset,
        totalPage: Math.ceil(singers.count / Number(limit)),
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatePrivateSingerService = (singerIds, trash = 0, status = 1) =>
  new Promise(async (resolve, reject) => {
    try {
      const singers = await db.Singer.update(
        { trash: trash, status: status },
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

export const getSingleSongService = (singerId) =>
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
          {
            model: db.Singer,
            as: 'singerInfo',
          },
        ],
      });
      resolve({
        status: 'SUCCESS',
        data: songs,
      });
    } catch (error) {
      reject(error);
    }
  });
