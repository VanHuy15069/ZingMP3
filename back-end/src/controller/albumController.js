import { clearFile } from '../middleware/uploadFile';
import * as albumService from '../service/albumService';

export const createAlbum = async (req, res) => {
  try {
    const singerId = req.body.singerId || req.params.singerId;
    const name = req.body.name;
    const image = req.file?.filename;
    if (!image || !name || !singerId) {
      if (image) clearFile(image);
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
    const albumId = req.params.id;
    const headersToken = req.headers.token;
    let image;
    if (req.file?.filename) {
      image = req.file.filename;
    }
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
    const singerIds = req.query.singerIds?.split(',');
    const { limit, offset } = req.query;
    if (!singerIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await albumService.getAllAlbumSingerService(singerIds, limit, offset);
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
    const { limit, offset, albumName, trash, name, sort } = req.query;
    const response = await albumService.getAllAlbumsService(limit, offset, albumName, trash, name, sort);
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
    const albumIds = req.query.albumIds?.split(',');
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

export const getAlbumHot = async (req, res) => {
  try {
    const limit = req.query.limit;
    const response = await albumService.getAlbumHotService(limit);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const checkFavarite = async (req, res) => {
  try {
    const { userId, albumId } = req.query;
    if (!albumId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await albumService.checkFavoriteService(userId, albumId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAlbumBySinger = async (req, res) => {
  try {
    const singerIds = req.query.singerIds?.split(',');
    const { limit, offset } = req.query;
    if (!singerIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await albumService.getAlbumBySingerService(singerIds, limit, offset);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAlbumFavorite = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await albumService.getAlbumFavoriteService(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};
