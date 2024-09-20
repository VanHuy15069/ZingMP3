import * as songService from '../service/songService';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { clearFile } from '../middleware/uploadFile';
dotenv.config();

export const createSong = async (req, res) => {
  try {
    const { nationId, topicId, categoryId, albumId, name, vip } = req.body;
    const link = req.files?.link;
    const image = req.files?.image;
    const singerIds = req.body.singerIds?.split(',');
    const headersToken = req.headers.token;
    if (!nationId || !topicId || !categoryId || !link || !image || !name || !singerIds || !headersToken) {
      if (image && !link) clearFile(image);
      if (link && !image) clearFile(link);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const token = headersToken?.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, async function (err, singer) {
      if (err) {
        return res.status(400).json({
          status: 'ERROR',
          msg: 'The authentication',
        });
      }
      if (singer?.isAdmin || (singer?.isSinger && singerIds.includes(singer.id.toString()))) {
        const response = await songService.createSongService(
          nationId,
          topicId,
          categoryId,
          albumId,
          name,
          link[0].filename,
          image[0].filename,
          singerIds,
          vip,
        );
        return res.status(200).json(response);
      } else {
        return res.status(400).json({
          status: 'ERROR',
          msg: 'The authentication',
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getDetailSong = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await songService.getDetailSongService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAllSong = async (req, res) => {
  const { limit, offset, songName, name, sort, trash } = req.query;
  try {
    const response = await songService.getAllSongService(limit, offset, songName, name, sort, trash);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateSong = async (req, res) => {
  try {
    const id = req.params.id;
    const { nationId, topicId, categoryId, albumId, name, vip } = req.body;
    let image, link, singerIds;
    if (req.files?.image) image = req.files.image[0].filename;
    if (req.files?.link) link = req.files.link[0].filename;
    if (req.body.singerIds) singerIds = req.body.singerIds.split(',');
    const headersToken = req.headers.token;
    if (!id || !headersToken) {
      if (image) clearFile(image);
      if (link) clearFile(link);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const token = headersToken?.split(' ')[1];
    const response = await songService.updateSongService(
      nationId,
      topicId,
      categoryId,
      albumId,
      name,
      link,
      image,
      singerIds,
      vip,
      id,
      token,
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateTrashSong = async (req, res) => {
  try {
    const trash = req.body.trash;
    const songIds = req.body.songIds.split(',');
    if (!songIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await songService.updateTrashSongService(trash, songIds);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const deleteManySong = async (req, res) => {
  try {
    const songIds = req.query.songIds.split(',');
    const headersToken = req.headers.token;
    if (!songIds || !headersToken) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const token = headersToken?.split(' ')[1];
    const response = await songService.deleteManySongService(songIds, token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateViewSong = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await songService.updateViewSongService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getSongByAlbumId = async (req, res) => {
  try {
    const albumId = req.params.id;
    const { limit, name, sort } = req.query;
    if (!albumId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const resolve = await songService.getSongByAlbumIdService(albumId, limit, name, sort);
    return res.status(200).json(resolve);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const checkFavarite = async (req, res) => {
  try {
    const { userId, songId } = req.query;
    if (!songId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await songService.checkFavariteService(userId, songId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getTopNewSongs = async (req, res) => {
  try {
    const limit = req.query.limit;
    const response = await songService.getTopNewSongService(limit);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getSongFavorite = async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await songService.getSongFavoriteService(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getSameSongs = async (req, res) => {
  try {
    const songId = req.params.id;
    const limit = req.query.limit;
    if (!songId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await songService.getSameSongService(songId, limit);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};
