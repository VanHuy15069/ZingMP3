import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as songService from '../service/songService';
export const useCreateSong = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await songService.createSong(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-songs'] });
    },
  });
};

export const useUpdateSong = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await songService.updateSong(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-songs'] });
    },
  });
};

export const useUpdateTrashSong = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ songIds, accessToken, trash }) => {
      if (songIds && accessToken) {
        return await songService.updateTrashSong(songIds, accessToken, trash);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-songs'] });
    },
  });
};

export const useDeleteSong = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ songIds, accessToken }) => {
      if (songIds && accessToken) {
        return await songService.deleteSong(songIds, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-songs'] });
    },
  });
};

export const useCountViews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }) => {
      if (id) {
        return await songService.countViews(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['song'] });
    },
  });
};
