import path from 'path';
import db, { Sequelize } from '../models';
import fs from 'fs';
import { Op, where } from 'sequelize';

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

export const getAllTopicService = (limit, offset, trash = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const obj = {};
      if (limit) obj.limit = Number(limit);
      if (offset) obj.offset = Number(limit) * Number(offset);
      const topics = await db.Topic.findAndCountAll({
        where: { trash: trash },
        ...obj,
        include: [
          {
            model: db.Song,
            as: 'songInfo',
          },
        ],
        distinct: true,
        order: [
          ['createdAt', 'DESC'],
          [
            {
              model: db.Song,
              as: 'songInfo',
            },
            'views',
            'DESC',
          ],
        ],
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

export const getDetailTopicService = (id, limit = 10, name = 'createdAt', sort = 'DESC') =>
  new Promise(async (resolve, reject) => {
    try {
      const topic = await db.Topic.findByPk(id, {
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
        where: { topicId: id },
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
      for (const singer of topic.songInfo) {
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
        data: topic,
        album: album,
        singers: singers,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getSongByTopicNameService = (topicName, limit = 10, name = 'createdAt', sort = 'DESC') =>
  new Promise(async (resolve, reject) => {
    try {
      const topic = await db.Topic.findOne({ where: { name: topicName } });
      if (!topic) {
        resolve({
          status: 'Error',
          msg: 'This topic is not defined',
        });
      }
      const songs = await db.Song.findAll({
        where: { topicId: topic.id },
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
    } catch (error) {
      reject(error);
    }
  });
