import * as singerService from '../service/singerService';

export const createSinger = async (req, res) => {
  const { name, desc, username, password, confirmPassword } = req.body;
  let image;
  if (req.file?.filename) {
    image = req.file.filename;
  }
  try {
    if (!name) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    if (username && !password) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    if (!username && password) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    if (username && password && password != confirmPassword) {
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
  const { name, desc } = req.body;
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
    const response = await singerService.updateSingerService(name, image, desc, id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const deleteManySinger = async (req, res) => {
  const singerIds = req.body.singerIds.split(',');
  try {
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
  const { limit, offset, trash } = req.body;
  try {
    const response = await singerService.getAllSingerService(limit, offset, trash);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updatePrivateSinger = async (req, res) => {
  const singerIds = req.body.singerIds.split(',');
  const { trash, status } = req.body;
  try {
    if (!singerIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await singerService.updatePrivateSingerService(singerIds, trash, status);
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
    if (!singerId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await singerService.getSingleSongService(singerId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};
