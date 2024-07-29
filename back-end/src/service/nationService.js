import path from 'path';
import db from '../models';
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

export const getAllNationService = (limit = 10, offset = 0, trash = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const nations = await db.Nation.findAndCountAll({
        where: { trash: trash },
        limit: Number(limit),
        offset: Number(limit) * Number(offset),
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

export const getDetailNationService = (id, limit = 10, offset = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const nation = await db.Nation.findByPk(id, {
        limit: limit,
        offset: Number(limit) * Number(offset),
        include: [
          {
            model: db.Song,
            as: 'songInfo',
          },
        ],
      });
      resolve({
        status: 'SUCCESS',
        data: nation,
      });
    } catch (error) {
      reject(error);
    }
  });
