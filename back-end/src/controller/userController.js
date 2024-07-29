import * as userService from '../service/userService';

export const addUser = async (req, res) => {
  const { fullName, username, passWord, confirmPassword, email } = req.body;
  try {
    if (!fullName || !username || !passWord || !confirmPassword || !email) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    if (passWord !== confirmPassword) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'password incorrect',
      });
    }
    const response = await userService.addUserService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const loginUser = async (req, res) => {
  const { username, passWord } = req.body;
  try {
    if (!username || !passWord) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await userService.loginUserService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getDetailUser = async (req, res) => {
  const userId = req.params.id;
  try {
    if (!userId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await userService.getDetailUserService(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAllUser = async (req, res) => {
  const { limit, offset } = req.body;
  try {
    const response = await userService.getAllUserService(limit, offset);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const getAllUserIntoTrash = async (req, res) => {
  const { limit, offset } = req.body;
  try {
    const response = await userService.getAllUserIntoTrashService(limit, offset);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  let image;
  if (req.file?.filename) {
    image = req.file.filename;
  }
  try {
    if (!userId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await userService.updateUserService(data, image, userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updatePrivateUser = async (req, res) => {
  const id = req.params.id;
  const { status, vip } = req.body;
  try {
    if (!vip || !status) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await userService.updatePrivateUserService(status, vip, id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const moveManyUsersToTrash = async (req, res) => {
  const userIds = req.body.userIds.split(',');
  try {
    if (!userIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await userService.moveManyToTrashService(userIds);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const restoreManyUsers = async (req, res) => {
  const userIds = req.body.userIds.split(',');
  try {
    if (!userIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await userService.restoreUserService(userIds);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const deleteManyUser = async (req, res) => {
  const userIds = req.body.userIds.split(',');
  try {
    if (!userIds) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await userService.deleteManyUserService(userIds);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const updatePassword = async (req, res) => {
  const id = req.params.id;
  const { password, newPassword } = req.body;
  try {
    if (!password || !newPassword) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await userService.updatePasswordService(password, newPassword, id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const userFollow = async (req, res) => {
  const userId = req.params.id;
  const singerId = req.body.singerId;
  try {
    if (!userId || !singerId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await userService.userFollowService(userId, singerId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const userFavorite = async (req, res) => {
  const userId = req.params.id;
  const songId = req.body.songId;
  try {
    if (!userId || !songId) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await userService.userFavoriteService(userId, songId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};
