import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: {
    id: '',
    name: '',
    username: '',
    image: '',
    vip: false,
    role: '',
    accessToken: '',
  },
  updateUser: (id, name, username, vip, image, accessToken) =>
    set((state) => ({
      user: {
        ...state.user,
        id: id,
        name: name,
        username: username,
        vip: vip,
        image: image,
        accessToken: accessToken,
      },
    })),
  updateRole: (role) =>
    set((state) => ({
      user: {
        ...state.user,
        role: role,
      },
    })),
}));

export const useAudioStore = create((set) => ({
  audio: {
    songId: '',
    albumId: '',
    isPlay: false,
  },
  updateSongId: (id) =>
    set((state) => ({
      audio: {
        ...state.audio,
        songId: id,
      },
    })),
  updateSongPlay: (isPlay) =>
    set((state) => ({
      audio: {
        ...state.audio,
        isPlay: isPlay,
      },
    })),
  updateSongAlbum: (albumId) =>
    set((state) => ({
      audio: {
        ...state.audio,
        albumId: albumId,
      },
    })),
}));
