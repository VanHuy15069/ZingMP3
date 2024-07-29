import { clearFile } from '../middleware/uploadFile';
import * as topicService from '../service/topicService';

export const createTopic = async (req, res) => {
  const name = req.body.name;
  const image = req.file?.filename;
  try {
    if (!name || !image) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    if (image && !name) {
      clearFile(image);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await topicService.createTopicService(name, image);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateTopic = async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  let image;
  if (req.file?.filename) {
    image = req.file.filename;
  }
  try {
    if (!id) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await topicService.updateTopicService(name, image, id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAllTopic = async (req, res) => {
  const { limit, offset, trash } = req.query;
  try {
    const response = await topicService.getAllTopicService(limit, offset, trash);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const deleteManyTopics = async (req, res) => {
  const topicIds = req.body.topicIds.split(',');
  try {
    if (!topicIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await topicService.deleteManyTopicService(topicIds);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateTrashTopics = async (req, res) => {
  const topicIds = req.body.topicIds.split(',');
  const trash = req.body.trash;
  try {
    if (!topicIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await topicService.updateTrashTopicService(topicIds, trash);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getDetailTopic = async (req, res) => {
  const { limit, offset } = req.body;
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await topicService.getDetailTopicService(id, limit, offset);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};
