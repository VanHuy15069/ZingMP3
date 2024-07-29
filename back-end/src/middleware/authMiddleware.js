import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (req, res, next) => {
  const headersToken = req.headers.token;
  if (headersToken) {
    const token = headersToken.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
      if (err) {
        return res.status(400).json({
          status: 'ERROR',
          msg: 'The authentication',
        });
      }
      if (user.isAdmin) {
        next();
      } else {
        return res.status(400).json({
          status: 'ERROR',
          msg: 'The authentication',
        });
      }
    });
  } else {
    return res.status(400).json({
      status: 'ERROR',
      msg: 'The authentication',
    });
  }
};

export const authUserMiddleware = (req, res, next) => {
  const headersToken = req.headers.token;
  const userId = req.params.id;
  if (headersToken) {
    const token = headersToken.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
      if (err) {
        return res.status(400).json({
          status: 'ERROR',
          msg: 'The authentication',
        });
      }
      if (user?.isAdmin || user?.id == userId) {
        next();
      } else {
        return res.status(400).json({
          status: 'ERROR',
          msg: 'The authentication',
        });
      }
    });
  } else {
    return res.status(400).json({
      status: 'ERROR',
      msg: 'The authentication',
    });
  }
};

export const authSingerMiddleware = (req, res, next) => {
  const headersToken = req.headers.token;
  const singerId = req.params.id;
  if (headersToken) {
    const token = headersToken.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, singer) {
      if (err) {
        return res.status(400).json({
          status: 'ERROR',
          msg: 'The authentication',
        });
      }
      if (singer?.isAdmin || (singer?.isSinger && singer?.id == singerId)) {
        next();
      } else {
        return res.status(400).json({
          status: 'ERROR',
          msg: 'The authentication',
        });
      }
    });
  } else {
    return res.status(400).json({
      status: 'ERROR',
      msg: 'The authentication',
    });
  }
};

export const authManySingerMiddleware = (req, res, next) => {
  const headersToken = req.headers.token;
  if (headersToken) {
    const token = headersToken.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, singer) {
      if (err) {
        return res.status(400).json({
          status: 'ERROR',
          msg: 'The authentication',
        });
      }
      if (singer?.isAdmin || singer?.isSinger) {
        next();
      } else {
        return res.status(400).json({
          status: 'ERROR',
          msg: 'The authentication',
        });
      }
    });
  } else {
    return res.status(400).json({
      status: 'ERROR',
      msg: 'The authentication',
    });
  }
};
