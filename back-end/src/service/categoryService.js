import path from 'path';
import db from '../models';
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

export const getAllCategoryService = (limit = 10, offset = 0, trash = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const categories = await db.Category.findAndCountAll({
        where: { trash: trash },
        limit: Number(limit),
        offset: Number(offset) * Number(limit),
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
      if (songs) {
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

export const getDetailCategoryService = (id, limit = 10, offset = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const category = await db.Category.findByPk(id, {
        limit: limit,
        offset: Number(offset) * Number(limit),
        include: [
          {
            model: db.Song,
            as: 'songInfo',
          },
        ],
      });
      resolve({
        status: 'SUCCESS',
        data: category,
      });
    } catch (error) {
      reject(error);
    }
  });
