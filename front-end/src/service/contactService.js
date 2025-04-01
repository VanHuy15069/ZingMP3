import axios from 'axios';

export const createContact = async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/contact/create`, data);
  return res.data;
};

export const getAllContact = async (limit, offset, status, problem, startDate, endDate, accessToken) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/contact/get-all`, {
    params: {
      limit: limit,
      offset: offset,
      status: status,
      problem: problem,
      startDate: startDate,
      endDate: endDate,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const feedbackContact = async (id, feedback, accessToken) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/contact/feedback/${id}`,
    { feedback: feedback },
    {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const deleteContacts = async (contactIds, accessToken) => {
  const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/contact/delete`, {
    params: {
      contactIds: contactIds,
    },
    headers: {
      token: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
