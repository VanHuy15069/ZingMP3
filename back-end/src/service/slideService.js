import db from '../models';
import { clearFile } from '../middleware/uploadFile';
import { Op } from 'sequelize';

export const createSlideService = (link, image, status) =>
  new Promise(async (resolve, reject) => {
    try {
      const slider = await db.Slider.create({ link: link, image: image, status: status });
      resolve({
        status: 'SUCCESS',
        data: slider,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllSlideService = (limit = 10, offset = 0, trash = false, status) =>
  new Promise(async (resolve, reject) => {
    try {
      const query = {};
      if (status) query.status = status;
      const obj = {};
      if (limit) obj.limit = Number(limit);
      if (offset) obj.offset = Number(limit) * Number(offset);
      const sliders = await db.Slider.findAndCountAll({
        where: { trash: trash, ...query },
        ...obj,
        order: [['createdAt', 'DESC']],
      });
      resolve({
        status: 'SUCCESS',
        count: sliders.count,
        data: sliders.rows,
        currentPage: offset,
        totalPage: Math.ceil(sliders.count / Number(limit)),
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateSlideService = (id, image, link, status) =>
  new Promise(async (resolve, reject) => {
    try {
      const slider = await db.Slider.findByPk(id);
      if (image) clearFile(slider.image);
      if (!slider) {
        resolve({
          status: 'ERROR',
          msg: 'This slider is not defined',
        });
      }
      await slider.update({ link: link, image: image, status: status });
      await slider.save();
      resolve({
        staus: 'SUCCESS',
        data: slider,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateTrashSlideService = (slideIds, trash = false) =>
  new Promise(async (resolve, reject) => {
    try {
      const sliders = await db.Slider.update({ trash: trash }, { where: { id: { [Op.in]: slideIds } } });
      resolve({
        status: 'SUCCESS',
        count: sliders,
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteManySlideService = (slideIds) =>
  new Promise(async (resolve, reject) => {
    try {
      const sliders = await db.Slider.findAll({
        where: {
          id: { [Op.in]: slideIds },
        },
      });
      if (!sliders) {
        resolve({
          status: 'ERROR',
          msg: 'Sliders are not defined',
        });
      }
      sliders.forEach((item) => {
        if (item.image) clearFile(item.image);
      });
      const sliderDelete = await db.Slider.destroy({ where: { id: { [Op.in]: slideIds } } });
      resolve({
        status: 'SUCCESS',
        count: sliderDelete,
      });
    } catch (error) {
      reject(error);
    }
  });
