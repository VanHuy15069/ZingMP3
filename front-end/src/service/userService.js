import axios from 'axios';

export const axiosJWT = axios.create();

export const register = async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/register`, data);
  return res.data;
};

export const login = async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/login`, data);
  return res.data;
};

export const loginGoogle = async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/google-login`, data);
  return res.data;
};

export const getDetailUser = async (id, accessToken) => {
  const res = await axiosJWT.get(`${import.meta.env.VITE_API_BASE_URL}/user/get-detail/${id}`, {
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const checkFollow = async (userId, singerId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/check-follow`, {
    params: {
      userId: userId,
      singerId: singerId,
    },
  });
  return res.data;
};

export const refeshToken = async (refeshToken) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/refresh-token`, '', {
      headers: {
        token: `Bearer ${refeshToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const favoriteSong = async (userId, songId, accessToken) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/user/favorite/${userId}`,
    { songId: songId },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const followSinger = async (userId, singerId, accessToken) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/user/follow/${userId}`,
    { singerId: singerId },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const favoriteAlbum = async (userId, albumId, accessToken) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/user/favorite-album/${userId}`,
    { albumId: albumId },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const getAllSingerFollow = async (userId, limit, accessToken) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/get-singer-follow/${userId}`, {
    params: {
      userId: userId,
      limit: limit,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const updateUser = async (data, header) => {
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/user/update/${data.get('id')}`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const changePassword = async (data, header) => {
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/user/update-password/${data.get('id')}`, data, {
    headers: {
      token: header.get('token'),
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const getAllUser = async (limit, offset, accessToken) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/getAll`, {
    params: {
      limit: limit,
      offset: offset,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const updatePrivateUser = async (status, vip, id, accessToken) => {
  const obj = {};
  if (vip) obj.vip = vip;
  const res = await axios.patch(
    `${import.meta.env.VITE_API_BASE_URL}/user/update-private/${id}`,
    {
      status: status,
      ...obj,
    },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const moveUserToTrash = async (userIds, accessToken) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_API_BASE_URL}/user/move-to-trash`,
    { userIds: userIds },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const restoreUser = async (userIds, accessToken) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_API_BASE_URL}/user/restore-users`,
    { userIds: userIds },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const getUserIntoTrash = async (limit, offset, accessToken) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/getAll-into-trash`, {
    params: {
      limit: limit,
      offset: offset,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const deleteUser = async (userIds, accessToken) => {
  const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/user/delete-users`, {
    params: {
      userIds: userIds,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const upgradeAccount = async (id, accessToken) => {
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/user/upgrade-account/${id}`, '', {
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const sendTokenResetPassword = async (username, email) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/send-token`, {
    username: username,
    email: email,
  });
  return res.data;
};

export const checkTokenResetPassword = async (token) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/check-token/${token}`);
  return res.data;
};

export const resetPassword = async (token, password, confirmPassword) => {
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/user/reset-password/${token}`, {
    password: password,
    confirmPassword: confirmPassword,
  });
  return res.data;
};
