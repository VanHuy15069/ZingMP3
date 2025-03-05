import { Op } from 'sequelize';
import db from '../models';
import bcryptjs from 'bcryptjs';
import * as jwt from './jwtService';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIEND_ID);
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
          msg: 'Tên đăng nhập hoặc mật khẩu không đúng!',
        });
      } else {
        const checkPassword = bcryptjs.compareSync(password, checkUser.passWord);
        if (!checkPassword) {
          resolve({
            status: 'ERROR',
            msg: 'Tên đăng nhập hoặc mật khẩu không đúng!',
          });
        } else {
          if (!checkUser.status) {
            resolve({
              status: 'ERROR',
              msg: 'Tài khoản này đang tạm khóa!',
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

export const loginGoogleService = (tokenId) =>
  new Promise(async (resolve, reject) => {
    try {
      const auth = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIEND_ID,
      });
      const payload = auth.getPayload();
      const [checkUser] = await db.User.findOrCreate({
        where: { username: payload.sub },
        defaults: {
          fullName: payload.name,
          email: payload.email,
        },
      });
      const accessToken = jwt.renderAccessToken({
        id: checkUser.id,
        isAdmin: false,
        isSinger: false,
      });
      const refreshToken = jwt.renderRefreshToken({
        id: checkUser.id,
        isAdmin: false,
        isSinger: false,
      });
      resolve({
        accessToken: accessToken,
        refreshToken: refreshToken,
        status: 'SUCCESS',
      });
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
        where: { trash: false, isAdmin: false },
        limit: Number(limit),
        offset: Number(offset * limit),
        order: [['createdAt', 'DESC']],
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
      const objVip = {};
      if (vip) objVip.vip = vip;
      const user = await db.User.findByPk(id);
      if (!user) {
        resolve({
          status: 'Error',
          msg: 'This user is not defined',
        });
      }
      await user.update({ status: status, ...objVip });
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

export const upgradeAccountService = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findByPk(id);
      if (!user) {
        resolve({
          status: 'Error',
          msg: 'This user is not defined',
        });
      }
      await user.update({ vip: 1 });
      await user.save();
      resolve({
        status: 'SUCCESS',
        data: user,
      });
    } catch (error) {
      reject(error);
    }
  });

export const sendTokenService = (username, email) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: {
          username: username,
          email: email,
        },
      });
      if (!user) {
        resolve({
          status: 'ERROR',
          msg: 'This user is not defined',
        });
      }
      const token = jwt.renderResetPasswordToken({ username: user.username, email: user.email });
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const emailDetail = {
        from: `"Music Studio" <${process.env.EMAIL}>`,
        to: `${user.email}`,
        subject: 'Yêu cầu cấp lại mật khẩu',
        text: `Nhấp vào đường dẫn sau để thực hiện việc cấp lại mật khẩu, thời gian tồn tại của của đường dẫn là 15 phút tính từ thời điểm email này được gửi đến: ${process.env.FE_URL}/reset-password/${token}`,
      };
      transporter.sendMail(emailDetail, async (error, info) => {
        if (error) {
          resolve({
            status: 'ERROR',
            msg: 'Can not send email',
            error: error,
          });
        }
        resolve({
          status: 'SUCCESS',
          data: info,
        });
      });
    } catch (error) {
      reject(error);
    }
  });

export const checkTokenService = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const decode = jsonwebtoken.verify(token, process.env.RESET_PASSWORD_TOEKN);
      if (decode) {
        resolve({
          status: 'SUCCESS',
          data: decode,
        });
      }
    } catch (error) {
      reject(error);
    }
  });

export const resetPasswordService = (token, password) =>
  new Promise(async (resolve, reject) => {
    try {
      const decode = jsonwebtoken.verify(token, process.env.RESET_PASSWORD_TOEKN);
      if (decode) {
        const user = await db.User.findOne({
          where: {
            username: decode.username,
            email: decode.email,
          },
        });
        if (!user) {
          resolve({
            status: 'ERROR',
            msg: 'This user is not defined',
          });
        }
        user.update({ passWord: hashPassword(password) });
        user.save();
        resolve({
          status: 'SUCCESS',
          msg: 'update successfully!',
        });
      }
    } catch (error) {
      reject(error);
    }
  });
