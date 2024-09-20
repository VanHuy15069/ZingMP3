import axios from 'axios';

export const getAllNation = async (limit, offset, trash) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/nation/get-all`, {
    params: {
      limit: limit,
      offset: offset,
      trash: trash,
    },
  });
  return res.data;
};

export const createNation = async (data, header) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/nation/create`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const updateNation = async (data, header) => {
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/nation/update/${data.get('id')}`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const updateTrashNation = async (nationIds, accessToken, trash) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_API_BASE_URL}/nation/update-trash`,
    { nationIds: nationIds, trash: trash },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const deleteNation = async (nationIds, accessToken) => {
  const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/nation/delete`, {
    params: {
      nationIds: nationIds,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const getNationById = async (id, limit, name, sort) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/nation/get-detail/${id}`, {
    params: {
      limit: limit,
      name: name,
      sort: sort,
    },
  });
  return res.data;
};
