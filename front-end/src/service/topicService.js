import axios from 'axios';

export const getAllTopic = async (limit, offset, trash) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/topic/get-all`, {
    params: {
      limit: limit,
      offset: offset,
      trash: trash,
    },
  });
  return res.data;
};

export const createTopic = async (data, header) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/topic/create`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const updateTopic = async (data, header) => {
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/topic/update/${data.get('id')}`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const updateTrashTopic = async (topicIds, accessToken, trash) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_API_BASE_URL}/topic/update-trash`,
    { topicIds: topicIds, trash: trash },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const deleteTopic = async (topicIds, accessToken) => {
  const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/topic/delete`, {
    params: {
      topicIds: topicIds,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const getTopicById = async (id, limit, name, sort) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/topic/get-detail/${id}`, {
    params: {
      limit: limit,
      name: name,
      sort: sort,
    },
  });
  return res.data;
};
