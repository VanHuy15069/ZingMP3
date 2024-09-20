import { clearFile } from '../middleware/uploadFile';
import * as nationService from '../service/nationService';

export const createNation = async (req, res) => {
  const name = req.body.name;
  const image = req.file?.filename;
  try {
    if (!image || !name) {
      if (image) clearFile(image);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await nationService.createNationService(name, image);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateNation = async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  let image;
  if (req.file?.filename) {
    image = req.file.filename;
  }
  try {
    if (!id) {
      if (image) clearFile(image);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await nationService.updateNationService(name, image, id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const deleteManyNation = async (req, res) => {
  try {
    const nationIds = req.query.nationIds?.split(',');
    if (!nationIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await nationService.deleteManyNationService(nationIds);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAllNation = async (req, res) => {
  const { limit, offset, trash } = req.query;
  try {
    const response = await nationService.getAllNationService(limit, offset, trash);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateTrashNations = async (req, res) => {
  const nationIds = req.body.nationIds.split(',');
  const trash = req.body.trash;
  try {
    if (!nationIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await nationService.updateTrashNationService(nationIds, trash);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getDetailNation = async (req, res) => {
  const { limit, name, sort } = req.query;
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await nationService.getDetailNationService(id, limit, name, sort);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getSongsOfNation = async (req, res) => {
  try {
    const { nation, limit, name, sort } = req.query;
    const response = await nationService.getSongsOfNationService(nation, limit, name, sort);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};
