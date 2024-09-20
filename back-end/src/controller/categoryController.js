import { clearFile } from '../middleware/uploadFile';
import * as categoryService from '../service/categoryService';

export const createCategory = async (req, res) => {
  const name = req.body.name;
  const image = req.file?.filename;
  try {
    if (!name || !image) {
      if (image) clearFile(image);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await categoryService.createCaregoryService(name, image);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateCategory = async (req, res) => {
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
    const response = await categoryService.updateCategoryService(name, image, id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAllCategory = async (req, res) => {
  const { limit, offset, trash } = req.query;
  try {
    const response = await categoryService.getAllCategoryService(limit, offset, trash);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const deleteManyCategories = async (req, res) => {
  const categoryIds = req.query.categoryIds.split(',');
  try {
    if (!categoryIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await categoryService.deleteManyCategoryService(categoryIds);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateTrashCategories = async (req, res) => {
  try {
    const categoryIds = req.body.categoryIds?.split(',');
    const trash = req.body.trash;
    if (!categoryIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await categoryService.updateTrashCategoryService(categoryIds, trash);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getDetailCategory = async (req, res) => {
  const { limit, name, sort } = req.body;
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await categoryService.getDetailCategoryService(id, limit, name, sort);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};
