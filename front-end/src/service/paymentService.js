import axios from 'axios';

export const createPayment = async (amount, bankCode) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/order/payment`, {
    amount: amount,
    bankCode: bankCode,
    language: 'vi',
  });
  return res.data;
};

export const getVNPayReturn = async (data) => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/order/vnpay_return`, {
    params: data,
  });
  return res.data;
};
