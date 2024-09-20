import { data } from 'autoprefixer';
import axios from 'axios';

export const getAllCategory = async (limit, offset, trash) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/category/get-all`, {
    params: {
      limit: limit,
      offset: offset,
      trash: trash,
    },
  });
  return res.data;
};

export const createCategory = async (data, header) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/category/create`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const updateCategory = async (data, header) => {
  const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/category/update/${data.get('id')}`, data, {
    headers: {
      token: header.get('token'),
    },
  });
  return res.data;
};

export const deleteCategory = async (categoryIds, accessToken) => {
  const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/category/delete`, {
    params: {
      categoryIds: categoryIds,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const updateTrashCategory = async (categoryIds, accessToken, trash) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_API_BASE_URL}/category/update-trash`,
    { categoryIds: categoryIds, trash: trash },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const getCategoryById = async (id, limit, name, sort) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/category/get-detail/${id}`, {
    params: {
      limit: limit,
      name: name,
      sort: sort,
    },
  });
  return res.data;
};
