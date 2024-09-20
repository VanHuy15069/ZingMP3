import { data } from 'autoprefixer';
import axios from 'axios';

export const loginSinger = async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/singer/login`, data);
  return res.data;
};

export const getDetailSinger = async (id) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/singer/detail/${id}`);
  return res.data;
};

export const getAllSingers = async (limit, offset, trash, singerName) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/singer/get-all`, {
    params: {
      limit: limit,
      offset: offset,
      trash: trash,
      singerName: singerName,
    },
  });
  return res.data;
};

export const createSinger = async (data, header) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/singer/create`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const updateSinger = async (data, header) => {
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/singer/update/${data.get('id')}`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const updateTrashSinger = async (singerIds, accessToken, trash) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_API_BASE_URL}/singer/update-trash`,
    { singerIds: singerIds, trash: trash },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const deleteSinger = async (singerIds, accessToken) => {
  const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/singer/delete`, {
    params: {
      singerIds: singerIds,
    },
    headers: {
      token: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const getSingerFollow = async (id, accessToken) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/singer/get-random-singer/${id}`, {
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
