import { useNavigate } from 'react-router-dom';
import * as playlistService from '../service/playlistService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

export const useCreatePlaylist = (userId) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ name, userId, accessToken }) => {
      if (!name || !userId || !accessToken) {
        Swal.fire({
          title: 'Bạn cần đăng nhập để thưc hiện hành động này!',
          confirmButtonText: 'Đến trang đăng nhập',
          customClass: {
            popup: 'bg-alpha-primary',
            title: 'text-white',
            confirmButton: 'rounded-[100px] bg-purple-primary',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      } else return await playlistService.createPlaylist(name, userId, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-playlist', userId] });
    },
  });
};

export const useAddSongPlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ playlistId, songId, accessToken }) => {
      if (playlistId && songId && accessToken) {
        return await playlistService.addSongPlaylist(playlistId, songId, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-playlist'] });
    },
  });
};

export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ playlistId, name, accessToken }) => {
      if (playlistId && name && accessToken) {
        return await playlistService.updatePlaylist(playlistId, name, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-playlist'] });
    },
  });
};

export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ playlistId, accessToken }) => {
      if (playlistId && accessToken) {
        return await playlistService.deletePlaylist(playlistId, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-playlist'] });
    },
  });
};

export const useRemoveSongPlaylist = (plalistId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ playlistId, songId, accessToken }) => {
      if (playlistId && accessToken && songId) {
        return await playlistService.remmoveSongPlaylist(playlistId, songId, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-playlist-by-id', plalistId] });
    },
  });
};
