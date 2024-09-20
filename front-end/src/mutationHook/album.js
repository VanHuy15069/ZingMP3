import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as albumService from '../service/albumService';
export const useCreateAlbum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await albumService.createAlbum(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-albums'] });
    },
  });
};

export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await albumService.updateAlbum(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-albums'] });
    },
  });
};

export const useUpdateTrashAlbum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ albumIds, accessToken, trash }) => {
      if (albumIds && accessToken) {
        return await albumService.updateTrashAlbum(albumIds, accessToken, trash);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-albums'] });
    },
  });
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ albumIds, accessToken }) => {
      if (albumIds && accessToken) {
        return await albumService.deleteAlbum(albumIds, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-albums'] });
    },
  });
};
