import path from 'path';
import db from '../models';
import fs from 'fs';
import { Op } from 'sequelize';

export const createTopicService = (name, image) =>
  new Promise(async (resolve, reject) => {
    try {
      const [topic, created] = await db.Topic.findOrCreate({
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
          msg: 'This topic already exists',
        });
      }
      resolve({
        status: 'SUCCESS',
        data: topic,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateTopicService = (name, image, id) =>
  new Promise(async (resolve, reject) => {
    try {
      const topic = await db.Topic.findByPk(id);
      if (!topic) {
        resolve({
          status: 'Error',
          msg: 'This topic is not defined',
        });
      }
      if (topic.image && image) {
        const clearImg = path.resolve(__dirname, '..', '', `public/${topic.image}`);
        fs.unlinkSync(clearImg);
      }
      topic.update({ name: name, image: image });
      topic.save();
      resolve({
        status: 'SUCCESS',
        data: topic,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllTopicService = (limit = 10, offset = 0, trash = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const topics = await db.Topic.findAndCountAll({
        where: { trash: trash },
        limit: Number(limit),
        offset: Number(offset) * Number(limit),
      });
      resolve({
        status: 'SUCCESS',
        data: topics,
        currentPage: offset,
        totalPage: Math.ceil(topics.count / Number(limit)),
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteManyTopicService = (topicIds) =>
  new Promise(async (resolve, reject) => {
    try {
      const topics = await db.Topic.findAll({
        where: {
          id: {
            [Op.in]: topicIds,
          },
        },
      });
      const songs = await db.Song.findAll({
        where: {
          topicId: { [Op.in]: topicIds },
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
        await db.Song.destroy({ where: { topicId: { [Op.in]: topicIds } } });
      }
      topics.forEach((item) => {
        if (item.image) {
          const clearImg = path.resolve(__dirname, '..', '', `public/${item.image}`);
          fs.unlinkSync(clearImg);
        }
      });
      const topicsDetete = await db.Topic.destroy({
        where: {
          id: {
            [Op.in]: topicIds,
          },
        },
      });
      resolve({
        status: 'SUCCESS',
        count: topicsDetete,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateTrashTopicService = (topicIds, trash = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const topics = await db.Topic.update(
        { trash: trash },
        {
          where: {
            id: {
              [Op.in]: topicIds,
            },
          },
        },
      );
      resolve({
        status: 'SUCCESS',
        count: topics,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getDetailTopicService = (id, limit = 10, offset = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const topic = await db.Topic.findByPk(id, {
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
        data: topic,
      });
    } catch (error) {
      reject(error);
    }
  });
