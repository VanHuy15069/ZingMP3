import axios from 'axios';

export const getHotAlbums = async (limit) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/album/get-album-hot`, {
    params: {
      limit: limit,
    },
  });
  return res.data;
};

export const checkAlbumFavorite = async (userId, albumId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/album/check-favorite`, {
    params: {
      userId: userId,
      albumId: albumId,
    },
  });
  return res.data;
};

export const getAlbumBySinger = async (singerIds, limit, offset) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/album/get-by-singer`, {
    params: {
      singerIds: singerIds,
      limit: limit,
      offset: offset,
    },
  });
  return res.data;
};

export const getAlbumFavorite = async (userId, accessToken) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/album/get-favorite-album/${userId}`, {
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const getAlbumById = async (albumId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/album/get-detail/${albumId}`);
  return res.data;
};

export const getAllAlbums = async (limit, offset, albumName, trash, name, sort) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/album/get-all`, {
    params: {
      limit: limit,
      offset: offset,
      albumName: albumName,
      trash: trash,
      name: name,
      sort: sort,
    },
  });
  return res.data;
};

export const createAlbum = async (data, header) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/album/create/${data.get('singerId')}`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const updateAlbum = async (data, header) => {
  const id = data.get('id');
  data.delete('id');
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/album/update/${id}`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const updateTrashAlbum = async (albumIds, accessToken, trash) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_API_BASE_URL}/album/update-trash`,
    { albumIds: albumIds, trash: trash },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const deleteAlbum = async (albumIds, accessToken) => {
  const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/album/delete`, {
    params: {
      albumIds: albumIds,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
