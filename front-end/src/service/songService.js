import axios from 'axios';

export const getSongByNation = async (nation, limit, name, sort) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/nation/get-songs`, {
    params: {
      nation: nation,
      limit: limit,
      name: name,
      sort: sort,
    },
  });
  return res.data;
};

export const getAllSongService = async (limit, offset, songName, name, sort, trash) => {
  const objSong = {};
  if (songName) objSong.songName = songName;
  if (name) objSong.name = name;
  if (sort) objSong.sort = sort;
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/song/get-all`, {
    params: {
      limit: limit,
      offset: offset,
      trash: trash,
      ...objSong,
    },
  });
  return res.data;
};

export const getSongByTopic = async (topic, limit, name, sort) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/topic/get-by-topic-name`, {
    params: {
      topic: topic,
      limit: limit,
      name: name,
      sort: sort,
    },
  });
  return res.data;
};

export const getSongByAlbum = async (albumId, limit, name, sort) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/song/get-by-album/${albumId}`, {
    params: {
      limit: limit,
      name: name,
      sort: sort,
    },
  });
  return res.data;
};

export const checkFavorite = async (userId, songId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/song/check-favorite`, {
    params: {
      userId: userId,
      songId: songId,
    },
  });
  return res.data;
};

export const getDetailSong = async (id) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/song/get-detail/${id}`);
  return res.data;
};

export const getTopNewSong = async (limit) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/song/get-new-songs`, {
    params: {
      limit: limit,
    },
  });
  return res.data;
};

export const getTopSongBySinger = async (singerId, limit, offset, name, sort) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/singer/get-top-song/${singerId}`, {
    params: {
      limit: limit,
      offset: offset,
      name: name,
      sort: sort,
    },
  });
  return res.data;
};

export const getSingleSong = async (singerId, limit, offset) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/singer/get-single/${singerId}`, {
    params: {
      limit: limit,
      offset: offset,
    },
  });
  return res.data;
};

export const getSongHaveSingers = async (singerId, limit) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/singer/get-song-singers/${singerId}`, {
    params: {
      limit: limit,
    },
  });
  return res.data;
};

export const getSongFavorite = async (userId, accessToken) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/song/get-favorite-song/${userId}`, {
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const getSameSongs = async (songId, limit) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/song/get-same/${songId}`, {
    params: {
      limit: limit,
    },
  });
  return res.data;
};

export const createSong = async (data, header) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/song/create`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const updateSong = async (data, header) => {
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/song/update/${data.get('id')}`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const updateTrashSong = async (songIds, accessToken, trash) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_API_BASE_URL}/song/update-trash`,
    { songIds: songIds, trash: trash },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const deleteSong = async (songIds, accessToken) => {
  const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/song/delete`, {
    params: {
      songIds: songIds,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const countViews = async (id) => {
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/song/count/${id}`);
  return res.data;
};
