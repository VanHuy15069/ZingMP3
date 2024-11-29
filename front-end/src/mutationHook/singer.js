import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as singerService from '../service/singerService';

export const useCreateSinger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await singerService.createSinger(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-singers'] });
    },
  });
};

export const useUpdateSinger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await singerService.updateSinger(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-singers'] });
      queryClient.invalidateQueries({ queryKey: ['singer'] });
    },
  });
};

export const useUpdateTrashSinger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ singerIds, accessToken, trash }) => {
      if (singerIds && accessToken) {
        return await singerService.updateTrashSinger(singerIds, accessToken, trash);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-singers'] });
    },
  });
};

export const useDeleteSinger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ singerIds, accessToken }) => {
      if (singerIds && accessToken) {
        return await singerService.deleteSinger(singerIds, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-singers'] });
    },
  });
};

export const useCreateAccountSinger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, username, password, confirmPassword, accessToken }) => {
      if (id && username && password && confirmPassword && accessToken && password === confirmPassword) {
        return await singerService.createAccountSinger(id, username, password, confirmPassword, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-singers'] });
    },
  });
};

export const useDeleteAccountSinger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, accessToken }) => {
      if (id && accessToken) {
        return await singerService.deleteAccountSinger(id, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-singers'] });
    },
  });
};
