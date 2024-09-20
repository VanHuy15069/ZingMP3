import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as userService from '../service/userService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const useFavoriteSong = (userId, songId) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, songId, accessToken }) => {
      if (!userId || !songId || !accessToken) {
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
      } else {
        return await userService.favoriteSong(userId, songId, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['check-favorite', userId, songId] });
      queryClient.invalidateQueries({ queryKey: ['song', songId] });
    },
    onError: () => {
      alert('ĐÃ CÓ LỖI XẢY RA!');
    },
  });
};

export const useFollowSinger = (userId, singerId) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, singerId, accessToken }) => {
      if (!userId || !singerId || !accessToken) {
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
      } else return await userService.followSinger(userId, singerId, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['check-follow', userId, singerId] });
      queryClient.invalidateQueries({ queryKey: ['singer', singerId] });
    },
    onError: (e) => {
      alert('ĐÃ CÓ LỖI XẢY RA!');
    },
  });
};

export const useFavoriteAlbum = (userId, albumId) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, albumId, accessToken }) => {
      if (!userId || !albumId || !accessToken) {
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
      } else return await userService.favoriteAlbum(userId, albumId, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['check-favorite-album', userId, albumId] });
      //queryClient.invalidateQueries({ queryKey: ['get-favorite-album', userId] });
    },
    onError: (e) => {
      alert('ĐÃ CÓ LỖI XẢY RA!');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await userService.updateUser(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (e) => {
      alert('ĐÃ CÓ LỖI XẢY RA!');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await userService.changePassword(data, headers);
      }
    },
    onError: (e) => {
      alert('ĐÃ CÓ LỖI XẢY RA!');
    },
  });
};
