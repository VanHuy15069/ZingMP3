import { Op, where } from 'sequelize';
import db, { Sequelize } from '../models';
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
            as: 'singerInfo',
            attributes: ['id', 'name'],
          },
        ],
      });
      const favorite = await db.Favorite.count({
        where: { songId: id },
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
        favorite: favorite,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllSongService = (limit, offset, songName, name = 'createdAt', sort = 'DESC', trash = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const obj = {};
      if (limit) obj.limit = Number(limit);
      if (offset) obj.offset = Number(limit) * Number(offset);
      if (songName) {
        const songs = await db.Song.findAndCountAll({
          where: {
            [Op.and]: [{ name: { [Op.substring]: songName } }, { trash: trash }],
          },
          ...obj,
          order: [[name, sort]],
          distinct: true,
          include: [
            {
              model: db.Singer,
              as: 'singerInfo',
              attributes: ['id', 'name'],
            },
            {
              model: db.Album,
              as: 'albumInfo',
            },
          ],
        });
        resolve({
          status: 'SUCCESS',
          count: songs.count,
          data: songs.rows,
          currentPage: offset,
          totalPage: Math.ceil(songs.count / Number(limit)),
        });
      } else {
        const songs = await db.Song.findAndCountAll({
          where: { trash: trash },
          ...obj,
          order: [[name, sort]],
          distinct: true,
          include: [
            {
              model: db.Singer,
              as: 'singerInfo',
              attributes: ['id', 'name'],
            },
            {
              model: db.Album,
              as: 'albumInfo',
            },
            { model: db.Nation, as: 'nationInfo' },
            { model: db.Category, as: 'categoryInfo' },
            { model: db.Topic, as: 'topicInfo' },
          ],
        });
        resolve({
          status: 'SUCCESS',
          count: songs.count,
          data: songs.rows,
          currentPage: offset,
          totalPage: Math.ceil(songs.count / Number(limit)),
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
      if (typeof albumId === 'string' && albumId.toLowerCase() !== 'null') {
        const album = await db.Album.findByPk(albumId);
        if (singerIds) {
          if (!singerIds.includes(album.singerId.toString())) {
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
          if (singerIds && singer.isSinger && !singerIds.includes(singer.id.toString())) {
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
          albumId: albumId === 'null' ? null : albumId,
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

export const deleteManySongService = (songIds, token) =>
  new Promise(async (resolve, reject) => {
    try {
      let update = true;
      const songs = await db.Song.findAll({
        where: {
          id: { [Op.in]: songIds },
        },
        include: [
          {
            model: db.Singer,
            as: 'singerInfo',
          },
        ],
      });
      const listSingers = [];
      for (const singers of songs) {
        listSingers.push(...singers.singerInfo);
      }
      const listSingerIds = [...new Set(listSingers.map((item) => item.id))];
      jwt.verify(token, process.env.ACCESS_TOKEN, function (err, singer) {
        if (err) {
          update = false;
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
        if (singer?.isAdmin || (singer?.isSinger && listSingerIds.includes(singer.id))) {
          update = true;
        } else {
          update = false;
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
      });
      if (update) {
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
        await db.Favorite.destroy({
          where: {
            songId: { [Op.in]: songIds },
          },
        });
        await db.SongPlaylist.destroy({
          where: {
            songId: { [Op.in]: songIds },
          },
        });
        resolve({
          status: 'SUCCESS',
          count: songDelete,
        });
      } else {
        resolve({
          status: 'ERROR',
          msg: 'Delete failure!',
        });
      }
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
      await song.increment({ views: 1 });
      await song.save();
      resolve({
        status: 'SUCCESS',
        msg: '+1 view',
      });
    } catch (error) {
      reject(error);
    }
  });

export const getSongByAlbumIdService = (albumId, limit = 10, name = 'createdAt', sort = 'DESC') =>
  new Promise(async (resolve, reject) => {
    try {
      const songs = await db.Song.findAll({
        where: {
          albumId: albumId,
        },
        limit: Number(limit),
        order: [[name, sort]],
        include: [
          {
            model: db.Album,
            as: 'albumInfo',
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
        data: songs,
      });
    } catch (error) {
      reject(error);
    }
  });

export const checkFavariteService = (userId, songId) =>
  new Promise(async (resolve, reject) => {
    try {
      if (userId) {
        const checkFavorite = await db.Favorite.findOne({
          where: { userId: userId, songId: songId },
        });
        if (checkFavorite) {
          resolve({
            status: 'SUCCESS',
            data: true,
          });
        }
        resolve({
          status: 'SUCCESS',
          data: false,
        });
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

export const getTopNewSongService = (limit = 10) =>
  new Promise(async (resolve, reject) => {
    try {
      const thirtyDayAgo = new Date();
      thirtyDayAgo.setDate(thirtyDayAgo.getDate() - 30);
      const topSongs = await db.Song.findAll({
        where: { createdAt: { [Op.gte]: thirtyDayAgo } },
        order: [
          ['views', 'DESC'],
          ['createdAt', 'DESC'],
        ],
        limit: Number(limit),
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

export const getSongFavoriteService = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const songFavorites = await db.Favorite.findAll({
        where: { userId: userId },
      });
      const songIds = songFavorites.map((item) => item.songId);
      const songs = await db.Song.findAll({
        where: {
          id: { [Op.in]: songIds },
        },
        attributes: ['id', 'name', 'image', 'link', 'views', 'vip'],
        order: [[Sequelize.literal(`CONVERT(Song.name USING utf8mb4) COLLATE utf8mb4_unicode_ci`), 'ASC']],
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
        data: songs,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getSameSongService = (songId, limit = 10) =>
  new Promise(async (resolve, reject) => {
    try {
      const song = await db.Song.findByPk(songId);
      if (!song) {
        resolve({
          status: 'ERROR',
          msg: 'This song is not defined',
        });
      }
      const listSongs = await db.Song.findAll({
        where: {
          nationId: song.nationId,
          topicId: song.topicId,
          categoryId: song.categoryId,
        },
        limit: Number(limit),
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: db.Singer,
            as: 'singerInfo',
            attributes: ['id', 'name'],
          },
          {
            model: db.Album,
            as: 'albumInfo',
          },
        ],
      });
      const listSingers = [];
      for (const singers of listSongs) {
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
      const index = listSongs.findIndex((item) => item.id == songId);
      const element = listSongs.splice(index, 1);
      listSongs.unshift(...element);
      resolve({
        status: 'SUCCESS',
        index: index,
        data: listSongs,
        singers: singers,
      });
    } catch (error) {
      reject(error);
    }
  });
