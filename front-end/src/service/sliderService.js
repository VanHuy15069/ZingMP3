import axios from 'axios';

export const getSlider = async (limit, offset, trash, status) => {
  const objStatus = {};
  if (status) objStatus.status = status;
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/slider/get-all`, {
    params: {
      limit: limit,
      offset: offset,
      trash: trash,
      ...objStatus,
    },
  });
  return response.data;
};

export const createSlider = async (data, header) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/slider/create`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const updateSlider = async (data, header) => {
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/slider/update/${data.get('id')}`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const updateTrashSlider = async (slideIds, accessToken, trash) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_API_BASE_URL}/slider/update-trash`,
    { slideIds: slideIds, trash: trash },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const deleteSlider = async (sliderIds, accessToken) => {
  const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/slider/delete`, {
    params: {
      sliderIds: sliderIds,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
