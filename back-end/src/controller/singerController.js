import { clearFile } from '../middleware/uploadFile';
import * as singerService from '../service/singerService';

export const createSinger = async (req, res) => {
  const { name, desc, username, password, confirmPassword } = req.body;
  let image;
  if (req.file?.filename) {
    image = req.file.filename;
  }
  try {
    if (!name) {
      if (image) clearFile(image);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    if (username && !password) {
      if (image) clearFile(image);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    if (!username && password) {
      if (image) clearFile(image);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    if (username && password && password != confirmPassword) {
      if (image) clearFile(image);
      return res.status(400).json({
        status: 'ERROR',
        msg: 'password incorrect',
      });
    }
    const response = await singerService.createSingerService(name, image, desc, username, password);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const loginSinger = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await singerService.loginSingerService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateSinger = async (req, res) => {
  const id = req.params.id;
  const { name, desc, status } = req.body;
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
    const response = await singerService.updateSingerService(name, image, desc, id, status);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateAccountSinger = async (req, res) => {
  try {
    const singerId = req.params.id;
    const { username, password, confirmPassword } = req.body;
    if (!singerId || !username || !password || !confirmPassword) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'ERROR',
        msg: '  Password incorrect',
      });
    }
    const response = await singerService.updateAccountSingerService(singerId, username, password);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const deleteAccountSinger = async (req, res) => {
  try {
    const singerId = req.params.id;
    if (!singerId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await singerService.deleteAccountSingerService(singerId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const deleteManySinger = async (req, res) => {
  try {
    const singerIds = req.query.singerIds?.split(',');
    if (!singerIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await singerService.deleteManySingerService(singerIds);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getDetailUser = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await singerService.getDetailSingerService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAllSinger = async (req, res) => {
  const { limit, offset, trash, singerName, name, sort } = req.query;
  try {
    const response = await singerService.getAllSingerService(limit, offset, trash, singerName, name, sort);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updatePrivateSinger = async (req, res) => {
  const singerIds = req.body.singerIds?.split(',');
  const trash = req.body.trash;
  try {
    if (!singerIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await singerService.updatePrivateSingerService(singerIds, trash);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getSingleSong = async (req, res) => {
  try {
    const singerId = req.params.id;
    const { limit, offset } = req.query;
    if (!singerId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await singerService.getSingleSongService(singerId, limit, offset);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getTopSongSinger = async (req, res) => {
  try {
    const singerId = req.params.id;
    const { limit, offset, name, sort } = req.query;
    if (!singerId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await singerService.getTopSongSingerService(singerId, limit, offset, name, sort);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getSongHaveSinger = async (req, res) => {
  try {
    const singerId = req.params.id;
    const limit = req.query.limit;
    if (!singerId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await singerService.getSongHaveSingerService(singerId, limit);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getHotSongBySingerRandom = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await singerService.getHotSongBySingerRandomService(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAllSongBySinger = async (req, res) => {
  try {
    const singerId = req.params.id;
    const { limit, offset, name, trash, key, value, nameSort, sort } = req.query;
    if (!singerId || !trash) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await singerService.getAllSongBySingerService(
      singerId,
      limit,
      offset,
      name,
      trash,
      key,
      value,
      nameSort,
      sort,
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};
