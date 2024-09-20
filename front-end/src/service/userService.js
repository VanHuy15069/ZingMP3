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
