import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as nationService from '../service/nationService';
export const useCreateNation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await nationService.createNation(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-nation'] });
    },
  });
};

export const useUpdateNation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await nationService.updateNation(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-nation'] });
    },
  });
};

export const useUpdateTrashNation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ nationIds, accessToken, trash }) => {
      if (nationIds && accessToken) {
        return await nationService.updateTrashNation(nationIds, accessToken, trash);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-nation'] });
    },
  });
};

export const useDeleteNation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ nationIds, accessToken }) => {
      if (nationIds && accessToken) {
        return await nationService.deleteNation(nationIds, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-nation'] });
    },
  });
};
