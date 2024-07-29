import { Op } from 'sequelize';
import db from '../models';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const createSongService = (nationId, topicId, categoryId, albumId, name, link, image, singerIds, vip) =>
  new Promise(async (resolve, reject) => {
    try {
      const [song, created] = await db.Song.findOrCreate({
        where: { name: name },
        defaults: {
          nationId: nationId,
          topicId: topicId,
          categoryId: categoryId,
          albumId: albumId,
          name: name,
          link: link,
          image: image,
          vip: vip,
        },
      });
      if (!created) {
        const clearImg = path.resolve(__dirname, '..', '', `public/${image}`);
        fs.unlinkSync(clearImg);
        const clearLink = path.resolve(__dirname, '..', '', `public/${link}`);
        fs.unlinkSync(clearLink);
        resolve({
          status: 'ERROR',
          msg: 'This song already exists',
        });
      }
      if (song) {
        for (const item of singerIds) {
          await db.SingerSong.findOrCreate({ where: { songId: song.id, singerId: item } });
        }
        resolve({
          status: 'SUCCESS',
          data: song,
        });
      }
      resolve({
        status: 'ERROR',
        msg: 'ERROR',
      });
    } catch (error) {
      reject(error);
    }
  });

export const getDetailSongService = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const song = await db.Song.findByPk(id, {
        include: [
          {
            model: db.Singer,
            as: 'song_singer',
            attributes: ['id', 'name'],
          },
          {
            model: db.User,
            as: 'favoriteInfo',
            attributes: ['fullName'],
          },
        ],
      });
      if (!song) {
        resolve({
          status: 'ERROR',
          msg: 'This song is not defined',
        });
      }
      if (song.trash) {
        resolve({
          status: 'ERROR',
          msg: 'This song is not defined',
        });
      }
      resolve({
        status: 'SUCCESS',
        data: song,
        favorite: song.favoriteInfo.length,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllSongService = (limit = 10, offset = 0, songName, name = 'id', sort = 'DESC', trash = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      if (songName) {
        const songs = await db.Song.findAll({
          where: {
            [Op.and]: [{ name: { [Op.substring]: songName } }, { trash: trash }],
          },
          limit: Number(limit),
          offset: Number(limit) * Number(offset),
          order: [[name, sort]],
          include: [
            {
              model: db.Singer,
              as: 'song_singer',
              attributes: ['id', 'name'],
            },
          ],
        });
        resolve({
          status: 'SUCCESS',
          count: songs.length,
          data: songs,
          currentPage: offset,
          totalPage: Math.ceil(songs.length / Number(limit)),
        });
      } else {
        const songs = await db.Song.findAll({
          where: { trash: trash },
          limit: Number(limit),
          offset: Number(limit) * Number(offset),
          order: [[name, sort]],
          include: [
            {
              model: db.Singer,
              as: 'song_singer',
              attributes: ['id', 'name'],
            },
          ],
        });
        resolve({
          status: 'SUCCESS',
          count: songs.length,
          data: songs,
          currentPage: offset,
          totalPage: Math.ceil(songs.length / Number(limit)),
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const updateSongService = (
  nationId,
  topicId,
  categoryId,
  albumId,
  name,
  link,
  image,
  singerIds,
  vip,
  id,
  token,
) =>
  new Promise(async (resolve, reject) => {
    try {
      let update = true;
      const song = await db.Song.findByPk(id);
      if (!song) {
        resolve({
          status: 'ERROR',
          msg: 'This song is not defined',
        });
      }
      if (albumId) {
        const album = await db.Album.findByPk(albumId);
        if (singerIds) {
          if (!singerIds.includes(album.singerId)) {
            update = false;
            resolve({
              status: 'ERROR',
              msg: 'Songs cannot be added to this album',
            });
          }
        } else {
          const singers = await db.SingerSong.findAll({
            where: {
              songId: id,
            },
          });
          const arrSingerIds = [];
          singers.forEach((item) => {
            arrSingerIds.push(item.singerId);
          });
          if (!arrSingerIds.includes(album.singerId)) {
            update = false;
            resolve({
              status: 'ERROR',
              msg: 'Songs cannot be added to this album',
            });
          }
        }
      }
      const singers = await db.SingerSong.findAll({ where: { songId: id } });
      const arrSingerIds = singers.map((item) => item.singerId);
      jwt.verify(token, process.env.ACCESS_TOKEN, function (err, singer) {
        if (err) {
          update = false;
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
        if (singer?.isAdmin || (singer?.isSinger && arrSingerIds.includes(singer.id))) {
          if (singerIds && !singerIds.includes(singer.id.toString())) {
            update = false;
            resolve({
              status: 'ERROR',
              msg: 'The authentication',
            });
          } else update = true;
        } else {
          update = false;
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
      });
      if (update) {
        if (image) {
          const clearImg = path.resolve(__dirname, '..', '', `public/${song.image}`);
          fs.unlinkSync(clearImg);
        }
        if (link) {
          const clearLink = path.resolve(__dirname, '..', '', `public/${song.link}`);
          fs.unlinkSync(clearLink);
        }
        await song.update({
          nationId: nationId,
          topicId: topicId,
          categoryId: categoryId,
          albumId: albumId == '' ? null : albumId,
          name: name,
          link: link,
          image: image,
          vip: vip,
        });
        await song.save();
        if (singerIds) {
          await db.SingerSong.destroy({ where: { songId: id } });
          for (const item of singerIds) {
            await db.SingerSong.findOrCreate({ where: { songId: id, singerId: item } });
          }
        }
        resolve({
          status: 'SUCCESS',
          msg: 'update successfully',
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const updateTrashSongService = (trash = 0, songIds) =>
  new Promise(async (resolve, reject) => {
    try {
      const songs = await db.Song.update(
        { trash: trash },
        {
          where: {
            id: { [Op.in]: songIds },
          },
        },
      );
      resolve({
        status: 'SUCCESS',
        count: songs,
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteManySongService = (songIds) =>
  new Promise(async (resolve, reject) => {
    try {
      const songs = await db.Song.findAll({
        where: {
          id: { [Op.in]: songIds },
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
      const songDelete = await db.Song.destroy({
        where: {
          id: { [Op.in]: songIds },
        },
      });
      await db.SingerSong.destroy({
        where: {
          songId: { [Op.in]: songIds },
        },
      });
      resolve({
        status: 'SUCCESS',
        count: songDelete,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateViewSongService = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const song = await db.Song.findByPk(id);
      if (!song) {
        resolve({
          status: 'ERROR',
          msg: 'This song is not defined',
        });
      }
      await song.update({ views: song.views + 1 });
      await song.save();
      resolve({
        status: 'SUCCESS',
        msg: '+1 view',
      });
    } catch (error) {
      reject(error);
    }
  });
