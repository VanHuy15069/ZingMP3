import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as contactService from '../service/contactService';

export const useCreateContact = () => {
  return useMutation({
    mutationFn: async (data) => {
      return await contactService.createContact(data);
    },
    onError: (e) => {
      console.log(e);
    },
  });
};

export const useFeedbackContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, feedback, accessToken }) => {
      return await contactService.feedbackContact(id, feedback, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-contact'] });
    },
    onError: (e) => {
      console.log(e);
    },
  });
};

export const useDeleteContacts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ contactIds, accessToken }) => {
      return await contactService.deleteContacts(contactIds, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-contact'] });
    },
    onError: (e) => {
      console.log(e);
    },
  });
};
