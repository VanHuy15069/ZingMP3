import path from 'path';
import db, { Sequelize } from '../models';
import fs from 'fs';
import { Op } from 'sequelize';

export const createNationService = (name, image) =>
  new Promise(async (resolve, reject) => {
    try {
      const [nation, created] = await db.Nation.findOrCreate({
        where: { name: name },
        defaults: {
          name: name,
          image: image,
        },
      });
      if (!created) {
        const clearImg = path.resolve(__dirname, '..', '', `public/${image}`);
        fs.unlinkSync(clearImg);
        resolve({
          status: 'ERROR',
          mas: 'This nation already exists',
        });
      }
      resolve({
        status: 'SUCCESS',
        data: nation,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateNationService = (name, image, id) =>
  new Promise(async (resolve, reject) => {
    try {
      const nation = await db.Nation.findByPk(id);
      if (!nation) {
        resolve({
          status: 'Error',
          msg: 'This nation is not defined',
        });
      }
      if (nation.image && image) {
        const clearImg = path.resolve(__dirname, '..', '', `public/${nation.image}`);
        fs.unlinkSync(clearImg);
      }
      nation.update({ name: name, image: image });
      nation.save();
      resolve({
        status: 'SUCCESS',
        data: nation,
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteManyNationService = (nationIds) =>
  new Promise(async (resolve, reject) => {
    try {
      const nations = await db.Nation.findAll({
        where: {
          id: {
            [Op.in]: nationIds,
          },
        },
      });
      const songs = await db.Song.findAll({
        where: {
          nationId: { [Op.in]: nationIds },
        },
      });
      if (songs.length > 0) {
        const arrSongIds = [];
        for (const item of songs) {
          if (!arrSongIds.includes(item.id)) {
            arrSongIds.push(item.id);
          }
        }
        await db.SingerSong.destroy({
          where: {
            songId: { [Op.in]: arrSongIds },
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
        await db.Song.destroy({ where: { nationId: { [Op.in]: nationIds } } });
      }
      nations.forEach((item) => {
        if (item.image) {
          const clearImg = path.resolve(__dirname, '..', '', `public/${item.image}`);
          fs.unlinkSync(clearImg);
        }
      });
      const nationsDeleted = await db.Nation.destroy({
        where: {
          id: {
            [Op.in]: nationIds,
          },
        },
      });
      resolve({
        status: 'SUCCESS',
        count: nationsDeleted,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllNationService = (limit, offset, trash = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const obj = {};
      if (limit) obj.limit = Number(limit);
      if (offset) obj.offset = Number(limit) * Number(offset);
      const nations = await db.Nation.findAndCountAll({
        where: { trash: trash },
        ...obj,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: db.Song,
            as: 'songInfo',
          },
        ],
        distinct: true,
      });
      resolve({
        status: 'SUCCESS',
        data: nations,
        currentPage: offset,
        totalPage: Math.ceil(nations.count / Number(limit)),
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateTrashNationService = (nationIds, trash = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const nations = await db.Nation.update(
        { trash: trash },
        {
          where: {
            id: {
              [Op.in]: nationIds,
            },
          },
        },
      );
      resolve({
        status: 'SUCCESS',
        count: nations,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getDetailNationService = (id, limit = 10, name = 'createdAt', sort = 'DESC') =>
  new Promise(async (resolve, reject) => {
    try {
      const nation = await db.Nation.findByPk(id, {
        include: [
          {
            model: db.Song,
            as: 'songInfo',
            limit: Number(limit),
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
              },
            ],
          },
        ],
      });
      const songs = await db.Song.findAll({
        where: { nationId: id },
        attributes: ['id', 'albumId', [Sequelize.fn('SUM', Sequelize.col('views')), 'sum']],
        group: ['albumId'],
        order: [['sum', 'DESC']],
        limit: 5,
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
      const hotAlbums = songs.filter((album) => album.albumId !== null);
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
      const listSingers = [];
      for (const singer of nation.songInfo) {
        listSingers.push(...singer.singerInfo);
      }
      const singerIds = [...new Set(listSingers.map((item) => item.id))];
      const singers = await db.Singer.findAll({
        where: {
          id: { [Op.in]: singerIds },
        },
        limit: 5,
        attributes: ['id', 'name'],
      });
      resolve({
        status: 'SUCCESS',
        data: nation,
        album: album,
        singers: singers,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getSongsOfNationService = (nation, limit = 10, name = 'createdAt', sort = 'DESC') =>
  new Promise(async (resolve, reject) => {
    try {
      if (nation) {
        const nationSong = await db.Nation.findOne({
          where: { name: nation },
        });
        if (!nationSong) {
          resolve({
            status: 'ERROR',
            msg: 'This nation is not defined',
          });
        }
        const songs = await db.Song.findAll({
          where: { nationId: nationSong?.id },
          limit: Number(limit),
          order: [[name, sort]],
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
          data: songs,
        });
      } else {
        const songs = await db.Song.findAll({
          limit: +limit,
          order: [[name, sort]],
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
          data: songs,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
