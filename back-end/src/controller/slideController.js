import * as slideService from '../service/slideService';
import { clearFile } from '../middleware/uploadFile';

export const createSlider = async (req, res) => {
  try {
    const { link, status } = req.body;
    const image = req.file?.filename;
    if (!link || !image) {
      if (image) clearFile(image);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await slideService.createSlideService(link, image, status);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAllSlider = async (req, res) => {
  try {
    const { limit, offset, trash, status } = req.query;
    const response = await slideService.getAllSlideService(limit, offset, trash, status);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateSlider = async (req, res) => {
  try {
    const id = req.params.id;
    const { link, status } = req.body;
    const image = req.file?.filename;
    if (!id) {
      if (image) clearFile(image);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await slideService.updateSlideService(id, image, link, status);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateTrashSlider = async (req, res) => {
  try {
    const slideIds = req.body.slideIds?.split(',');
    const trash = req.body.trash;
    if (!slideIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await slideService.updateTrashSlideService(slideIds, trash);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const deleteManySlider = async (req, res) => {
  try {
    const slideIds = req.query.sliderIds?.split(',');
    if (!slideIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await slideService.deleteManySlideService(slideIds);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};
