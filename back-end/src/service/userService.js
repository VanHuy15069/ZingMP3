import { Op } from 'sequelize';
import db from '../models';
import bcryptjs from 'bcryptjs';
import * as jwt from './jwtService';
import path from 'path';
import fs from 'fs';

const hashPassword = (password) => bcryptjs.hashSync(password, bcryptjs.genSaltSync(10));

export const addUserService = ({ fullName, username, passWord, email, image }) =>
  new Promise(async (resolve, reject) => {
    try {
      const [user, created] = await db.User.findOrCreate({
        where: {
          [Op.or]: [{ username: username }, { email: email }],
        },
        defaults: {
          fullName: fullName,
          username: username,
          passWord: hashPassword(passWord),
          email: email,
          image: image,
        },
      });
      if (!created) {
        resolve({
          status: 'ERROR',
          msg: 'Account already exists',
        });
      } else {
        resolve({
          data: user,
          msg: 'Successful account registration',
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const loginUserService = (userLogin) =>
  new Promise(async (resolve, reject) => {
    try {
      const { username, password } = userLogin;
      const checkUser = await db.User.findOne({
        where: {
          username: username,
        },
      });
      if (!checkUser) {
        resolve({
          status: 'ERROR',
          msg: 'User does not exist',
        });
      } else {
        const checkPassword = bcryptjs.compareSync(password, checkUser.passWord);
        if (!checkPassword) {
          resolve({
            status: 'ERROR',
            msg: 'The account being entered is incorrect',
          });
        } else {
          if (!checkUser.status) {
            resolve({
              status: 'ERROR',
              msg: 'This account has been locked',
            });
          }
          const accessToken = jwt.renderAccessToken({
            id: checkUser.id,
            isAdmin: checkUser.isAdmin,
            isSinger: false,
          });
          const refreshToken = jwt.renderRefreshToken({
            id: checkUser.id,
            isAdmin: checkUser.isAdmin,
            isSinger: false,
          });
          resolve({
            accessToken: accessToken,
            refreshToken: refreshToken,
            status: 'SUCCESS',
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });

export const getDetailUserService = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findByPk(userId);
      if (!user) {
        resolve({
          status: 'Error',
          msg: 'This user is not defined',
        });
      }
      resolve({
        status: 'SUCCESS',
        data: user,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllUserService = (limit = 10, offset = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const users = await db.User.findAndCountAll({
        where: { trash: false },
        limit: Number(limit),
        offset: Number(offset * limit),
      });
      resolve({
        status: 'SUCCESS',
        data: users,
        currentPage: offset,
        totalPage: Math.ceil(users.count / Number(limit)),
      });
    } catch (error) {
      reject(error);
    }
  });

export const getAllUserIntoTrashService = (limit = 10, offset = 0) =>
  new Promise(async (resolve, reject) => {
    try {
      const users = await db.User.findAndCountAll({
        where: { trash: true },
        limit: Number(limit),
        offset: Number(offset) * Number(limit),
      });
      resolve({
        status: 'SUCCESS',
        data: users,
        currentPage: offset,
        totalPage: Math.ceil(users.count / Number(limit)),
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateUserService = (dataUser, image, userId) =>
  new Promise(async (resolve, reject) => {
    const { fullName, email } = dataUser;
    try {
      const user = await db.User.findByPk(userId);
      if (!user) {
        resolve({
          status: 'Error',
          msg: 'This user is not defined',
        });
      }
      if (user.image && image) {
        const clearImg = path.resolve(__dirname, '..', '', `public/${user.image}`);
        fs.unlinkSync(clearImg);
      }
      await user.update({ fullName: fullName, email: email, image: image });
      await user.save();
      resolve({
        status: 'SUCCESS',
        data: user,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatePrivateUserService = (status, vip, id) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findByPk(id);
      if (!user) {
        resolve({
          status: 'Error',
          msg: 'This user is not defined',
        });
      }
      await user.update({ status: status, vip: vip });
      await user.save();
      resolve({
        status: 'SUCCESS',
        data: user,
      });
    } catch (error) {
      reject(error);
    }
  });

export const moveManyToTrashService = (userIds) =>
  new Promise(async (resolve, reject) => {
    try {
      const usersTrash = await db.User.findAll({
        where: {
          id: {
            [Op.in]: userIds,
          },
        },
      });
      await db.User.update(
        { trash: true },
        {
          where: {
            id: {
              [Op.in]: userIds,
            },
          },
        },
      );
      resolve({
        status: 'SUCCESS',
        count: usersTrash.length,
      });
    } catch (error) {
      reject(error);
    }
  });

export const restoreUserService = (userIds) =>
  new Promise(async (resolve, reject) => {
    try {
      const usersTrash = await db.User.findAll({
        where: {
          id: {
            [Op.in]: userIds,
          },
        },
      });
      await db.User.update(
        { trash: false },
        {
          where: {
            id: {
              [Op.in]: userIds,
            },
          },
        },
      );
      resolve({
        status: 'SUCCESS',
        count: usersTrash.length,
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteManyUserService = (userIds) =>
  new Promise(async (resolve, reject) => {
    try {
      const usersDeleted = await db.User.findAll({
        where: {
          id: {
            [Op.in]: userIds,
          },
        },
      });
      const count = usersDeleted.length;
      if (count > 0) {
        await db.User.destroy({
          where: {
            id: {
              [Op.in]: userIds,
            },
          },
        });
        usersDeleted.forEach((item) => {
          if (item.image) {
            const clearImg = path.resolve(__dirname, '..', '', `public/${item.image}`);
            fs.unlinkSync(clearImg);
          }
        });
        await db.Follow.destroy({
          where: {
            userId: { [Op.in]: userIds },
          },
        });
        await db.AlbumFavorite.destroy({
          where: {
            userId: { [Op.in]: userIds },
          },
        });
      }
      resolve({
        status: 'SUCCESS',
        count: count,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatePasswordService = (password, newPassword, id) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findByPk(id);
      if (!user) {
        resolve({
          status: 'Error',
          msg: 'This user is not defined',
        });
      }
      const checkPassword = bcryptjs.compareSync(password, user.passWord);
      if (!checkPassword) {
        resolve({
          status: 'ERROR',
          msg: 'Mật khẩu không chính xác',
        });
      } else {
        await user.update({ passWord: hashPassword(newPassword) });
        await user.save();
        resolve({
          status: 'SUCCESS',
          data: user,
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const userFollowService = (userId, singerId) =>
  new Promise(async (resolve, reject) => {
    try {
      const [follow, created] = await db.Follow.findOrCreate({
        where: { userId: userId, singerId: singerId },
      });
      if (!created) {
        await follow.destroy();
        resolve({
          status: 'SUCCESS',
          msg: 'UNFOLLOW',
        });
      }
      resolve({
        status: 'SUCCESS',
        data: follow,
      });
    } catch (error) {
      reject(error);
    }
  });

export const userFavoriteService = (userId, songId) =>
  new Promise(async (resolve, reject) => {
    try {
      const [favorite, created] = await db.Favorite.findOrCreate({
        where: { userId: userId, songId: songId },
      });
      if (!created) {
        await favorite.destroy();
        resolve({
          status: 'SUCCESS',
          msg: 'UNFAVORITE',
        });
      }
      resolve({
        status: 'SUCCESS',
        data: favorite,
      });
    } catch (error) {
      reject(error);
    }
  });

export const userFavoriteAlbumService = (userId, albumId) =>
  new Promise(async (resolve, reject) => {
    try {
      const [favorite, created] = await db.AlbumFavorite.findOrCreate({
        where: { userId: userId, albumId: albumId },
      });
      if (!created) {
        await favorite.destroy();
        resolve({
          status: 'SUCCESS',
          msg: 'UNFAVORITE',
        });
      }
      resolve({
        status: 'SUCCESS',
        data: favorite,
      });
    } catch (error) {
      reject(error);
    }
  });

export const checkUserFollowService = (userId, singerId) =>
  new Promise(async (resolve, reject) => {
    try {
      if (userId) {
        const checkFollow = await db.Follow.findOne({
          where: { userId: userId, singerId: singerId },
        });
        if (checkFollow) {
          resolve({
            status: 'SUCCESS',
            data: true,
          });
        }
        resolve({
          status: 'SUCCESS',
          data: false,
        });
      } else {
        resolve({
          status: 'SUCCESS',
          data: false,
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const getAllSingerFollowService = (userId, limit) =>
  new Promise(async (resolve, reject) => {
    try {
      const objLimit = {};
      if (limit) objLimit.limit = Number(limit);
      const singers = await db.Follow.findAll({
        where: { userId: userId },
        ...objLimit,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: db.Singer,
            as: 'singerInfo',
            attributes: ['id', 'name', 'image'],
          },
        ],
      });
      resolve({
        status: 'SUCCESS',
        data: singers,
      });
    } catch (error) {
      reject(error);
    }
  });
