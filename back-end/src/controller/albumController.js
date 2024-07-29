import { clearFile } from '../middleware/uploadFile';
import * as albumService from '../service/albumService';

export const createAlbum = async (req, res) => {
  const singerId = req.params.id;
  const name = req.body.name;
  const image = req.file?.filename;
  try {
    if (!image || !name || !singerId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    if (image && (!name || !singerId)) {
      clearFile(image);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await albumService.createAlbumService(name, image, singerId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateAlbum = async (req, res) => {
  try {
    const headersToken = req.headers.token;
    let image;
    if (req.files?.image) image = req.files.image;
    const albumId = req.params.id;
    const { name, singerId } = req.body;
    if (!albumId || !headersToken) {
      if (image) clearFile(image);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const token = headersToken?.split(' ')[1];
    const response = await albumService.updateAlbumService(name, image, singerId, albumId, token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getDetailAlbum = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await albumService.getDetailAlbumService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAllAlbumSinger = async (req, res) => {
  try {
    const singerId = req.params.id;
    const { limit, offset } = req.query;
    if (!singerId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await albumService.getAllAlbumSingerService(singerId, limit, offset);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAllAlbum = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const response = await albumService.getAllAlbumsService(limit, offset);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateTrashAlbums = async (req, res) => {
  try {
    const trash = req.body.trash;
    const albumIds = req.body.albumIds?.split(',');
    const headersToken = req.headers.token;
    if (!albumIds || !headersToken) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const token = headersToken?.split(' ')[1];
    const response = await albumService.updateTrashAlbumService(albumIds, trash, token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const deleteManyAlbums = async (req, res) => {
  try {
    const albumIds = req.body.albumIds?.split(',');
    const headersToken = req.headers.token;
    if (!albumIds || !headersToken) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const token = headersToken?.split(' ')[1];
    const response = await albumService.deleteManyAlbumServive(albumIds, token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};
