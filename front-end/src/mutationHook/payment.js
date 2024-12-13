import { useMutation } from '@tanstack/react-query';
import * as paymentService from '../service/paymentService';

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: async ({ amount, bankCode }) => {
      return paymentService.createPayment(amount, bankCode);
    },
  });
};
