import axios from 'axios';

export const createPlaylist = async (name, userId, accessToken) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/playlist/create/${userId}`,
    { name: name },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const getPlaylist = async (userId, limit, name, accessToken) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/playlist/get-all/${userId}`, {
    params: {
      limit: limit,
      name: name,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const addSongPlaylist = async (playlistId, songId, accessToken) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/playlist/add-song`,
    {
      playlistId: playlistId,
      songId: songId,
    },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const updatePlaylist = async (playlistId, name, accessToken) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_API_BASE_URL}/playlist/update/${playlistId}`,
    {
      name: name,
    },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const deletePlaylist = async (playlistId, accessToken) => {
  const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/playlist/delete/${playlistId}`, {
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const getPlaylistById = async (playlistId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/playlist/get-detail/${playlistId}`);
  return res.data;
};

export const remmoveSongPlaylist = async (playlistId, songId, accessToken) => {
  const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/playlist/remove-song`, {
    params: {
      playlistId: playlistId,
      songId: songId,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
