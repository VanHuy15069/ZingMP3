import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const renderAccessToken = (payload) => {
  const accessToken = jwt.sign({ ...payload }, process.env.ACCESS_TOKEN, { expiresIn: '1d' });
  return accessToken;
};

export const renderRefreshToken = (payload) => {
  const accessToken = jwt.sign({ ...payload }, process.env.REFRESH_TOKEN, { expiresIn: '365d' });
  return accessToken;
};

export const refreshToken = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) {
          resolve({
            status: 'ERROR',
            msg: 'The authentication',
          });
        }
        const accessToken = renderAccessToken({
          id: user?.id,
          isAdmin: user?.isAdmin,
        });
        resolve({
          status: 'OK',
          msg: 'SUCCESS',
          access_token: accessToken,
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};
