import path from 'path';
import db, { Sequelize } from '../models';
import fs from 'fs';
import { Op } from 'sequelize';

export const createCaregoryService = (name, image) =>
  new Promise(async (resolve, reject) => {
    try {
      const [category, created] = await db.Category.findOrCreate({
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
          msg: 'This category already exists',
        });
      }
      resolve({
        status: 'SUCCESS',
        data: category,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateCategoryService = (name, image, id) =>
  new Promise(async (resolve, reject) => {
    try {
      const category = await db.Category.findByPk(id);
      if (!category) {
        resolve({
          status: 'Error',
          msg: 'This category is not defined',
        });
      }
      if (category.image && image) {
        const clearImg = path.resolve(__dirname, '..', '', `public/${category.image}`);
        fs.unlinkSync(clearImg);
      }
      category.update({ name: name, image: image });
      category.save();
      resolve({
        status: 'SUCCESS',
        data: category,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllCategoryService = (limit, offset, trash = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const obj = {};
      if (limit) obj.limit = Number(limit);
      if (offset) obj.offset = Number(limit) * Number(offset);
      const categories = await db.Category.findAndCountAll({
        where: { trash: trash },
        ...obj,
        include: [
          {
            model: db.Song,
            as: 'songInfo',
            include: [
              {
                model: db.Singer,
                as: 'singerInfo',
              },
            ],
          },
        ],
        distinct: true,
        order: [
          [
            {
              model: db.Song,
              as: 'songInfo',
            },
            'createdAt',
            'DESC',
          ],
          ['createdAt', 'DESC'],
        ],
      });
      resolve({
        status: 'SUCCESS',
        data: categories,
        currentPage: offset,
        totalPage: Math.ceil(categories.count / Number(limit)),
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteManyCategoryService = (categoryIds) =>
  new Promise(async (resolve, reject) => {
    try {
      const categories = await db.Category.findAll({
        where: {
          id: {
            [Op.in]: categoryIds,
          },
        },
      });
      const songs = await db.Song.findAll({
        where: {
          categoryId: { [Op.in]: categoryIds },
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
        await db.Song.destroy({ where: { categoryId: { [Op.in]: categoryIds } } });
      }
      categories.forEach((item) => {
        if (item.image) {
          const clearImg = path.resolve(__dirname, '..', '', `public/${item.image}`);
          fs.unlinkSync(clearImg);
        }
      });
      const categoriesDetete = await db.Category.destroy({
        where: {
          id: {
            [Op.in]: categoryIds,
          },
        },
      });
      resolve({
        status: 'SUCCESS',
        count: categoriesDetete,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateTrashCategoryService = (categoryIds, trash = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const categories = await db.Category.update(
        { trash: trash },
        {
          where: {
            id: {
              [Op.in]: categoryIds,
            },
          },
        },
      );
      resolve({
        status: 'SUCCESS',
        count: categories,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getDetailCategoryService = (id, limit = 10, name = 'createdAt', sort = 'DESC') =>
  new Promise(async (resolve, reject) => {
    try {
      const category = await db.Category.findByPk(id, {
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
        where: { categoryId: id },
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
      for (const singer of category.songInfo) {
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
        data: category,
        album: album,
        singers: singers,
      });
    } catch (error) {
      reject(error);
    }
  });
