import * as playlistService from '../service/playlistService';

export const createPlaylist = async (req, res) => {
  try {
    const userId = req.params.id;
    const name = req.body.name;
    if (!userId || !name) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await playlistService.createPlaylistService(name, userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const headersToken = req.headers.token;
    if (!id || !name || !headersToken) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const token = headersToken?.split(' ')[1];
    const response = await playlistService.updatePlaylistService(name, id, token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const id = req.params.id;
    const headersToken = req.headers.token;
    if (!id || !headersToken) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const token = headersToken?.split(' ')[1];
    const response = await playlistService.deletePlaylistService(id, token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const headersToken = req.headers.token;
    const { playlistId, songId } = req.body;
    if (!headersToken || !playlistId || !songId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const token = headersToken?.split(' ')[1];
    const response = await playlistService.addSongToPlaylistService(playlistId, songId, token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getDetaiPlaylist = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await playlistService.getDetaiPlaylistService(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAllPlaylist = async (req, res) => {
  try {
    const userId = req.params.id;
    const { limit, name } = req.query;
    if (!userId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await playlistService.getAllPlaylistService(userId, limit, name);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const removeSongToPlaylist = async (req, res) => {
  try {
    const headersToken = req.headers.token;
    const { playlistId, songId } = req.query;
    if (!headersToken || !playlistId || !songId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const token = headersToken?.split(' ')[1];
    const response = await playlistService.removeSongPlaylistService(playlistId, songId, token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};
