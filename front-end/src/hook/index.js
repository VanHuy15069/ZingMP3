import { useQuery } from '@tanstack/react-query';
import * as userService from '../service/userService';
import * as singerService from '../service/singerService';
import * as sliderService from '../service/sliderService';
import * as songService from '../service/songService';
import * as albumService from '../service/albumService';
import * as playlistService from '../service/playlistService';
import * as topicService from '../service/topicService';
import * as categoryService from '../service/categoryService';
import * as nationService from '../service/nationService';

export const useGetDetailUser = (id, accessToken) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getDetailUser(id, accessToken),
    enabled: !!id && !!accessToken,
  });
};

export const useGetDeatailSinger = (id) => {
  return useQuery({
    queryKey: ['singer', id],
    queryFn: () => singerService.getDetailSinger(id),
    enabled: !!id,
  });
};

export const useGetSlider = (limit, offset, trash, status) => {
  return useQuery({
    queryKey: ['slider', limit, offset, trash, status],
    queryFn: () => sliderService.getSlider(limit, offset, trash, status),
  });
};

export const useGetSongsByNation = (nation, limit) => {
  return useQuery({
    queryKey: ['nation-name', nation, limit],
    queryFn: () => songService.getSongByNation(nation, limit, null, null),
    enabled: !!limit,
  });
};

export const useGetAllSongs = (limit, offset, songName, name, sort, trash) => {
  return useQuery({
    queryKey: ['get-all-songs', limit, offset, songName, name, sort, trash],
    queryFn: () => songService.getAllSongService(limit, offset, songName, name, sort, trash),
  });
};

export const useGetSongByTopic = (topic, limit, name, sort) => {
  return useQuery({
    queryKey: ['topic-name', topic, limit, name, sort],
    queryFn: () => songService.getSongByTopic(topic, limit, name, sort),
    enabled: !!topic,
  });
};

export const useGetAlbumsHot = (limit) => {
  return useQuery({
    queryKey: ['albums-hot', limit],
    queryFn: () => albumService.getHotAlbums(limit),
    enabled: !!limit,
  });
};

export const useGetSongByAlbum = (albumId, limit, name, sort) => {
  return useQuery({
    queryKey: ['get-by-albumId', albumId, limit, name, sort],
    queryFn: () => songService.getSongByAlbum(albumId, limit, name, sort),
    enabled: !!albumId,
  });
};

export const useCheckFavorite = (userId, songId) => {
  return useQuery({
    queryKey: ['check-favorite', userId, songId],
    queryFn: () => songService.checkFavorite(userId, songId),
    enabled: !!songId,
  });
};

export const useGetSongById = (songId) => {
  return useQuery({
    queryKey: ['song', songId],
    queryFn: () => songService.getDetailSong(songId),
    enabled: !!songId,
  });
};

export const useCheckFavoriteAlbum = (userId, albumId) => {
  return useQuery({
    queryKey: ['check-favorite-album', userId, albumId],
    queryFn: () => albumService.checkAlbumFavorite(userId, albumId),
    enabled: !!albumId,
  });
};

export const useGetTopNewSongs = (limit) => {
  return useQuery({
    queryKey: ['top-new-songs', limit],
    queryFn: () => songService.getTopNewSong(limit),
    enabled: !!limit,
  });
};

export const useCheckFollow = (userId, singerId) => {
  return useQuery({
    queryKey: ['check-follow', userId, singerId],
    queryFn: () => userService.checkFollow(userId, singerId),
    enabled: !!singerId,
  });
};

export const useGetTopSongBySinger = (singerId, limit, offset, name, sort) => {
  return useQuery({
    queryKey: ['top-song-by-singer', singerId, limit, offset, name, sort],
    queryFn: () => songService.getTopSongBySinger(singerId, limit, offset, name, sort),
    enabled: !!singerId,
  });
};

export const useGetSingleSong = (singerId, limit, offset) => {
  return useQuery({
    queryKey: ['get-single-song', singerId, limit, offset],
    queryFn: () => songService.getSingleSong(singerId, limit, offset),
    enabled: !!singerId,
  });
};

export const useGetAlbumsBySinger = (singerIds, limit, offset) => {
  return useQuery({
    queryKey: ['get-album-by-singer', singerIds, limit, offset],
    queryFn: () => albumService.getAlbumBySinger(singerIds, limit, offset),
    enabled: !!singerIds,
  });
};

export const useGetSongHaveSingers = (singerId, limit) => {
  return useQuery({
    queryKey: ['get-song-have-singers', singerId, limit],
    queryFn: () => songService.getSongHaveSingers(singerId, limit),
    enabled: !!singerId,
  });
};

export const useGetPlaylist = (userId, limit, name, accessToken) => {
  return useQuery({
    queryKey: ['get-playlist', userId, limit, name],
    queryFn: () => playlistService.getPlaylist(userId, limit, name, accessToken),
    enabled: !!userId && !!accessToken,
  });
};

export const useGetAllSingerFollow = (userId, limit, accessToken) => {
  return useQuery({
    queryKey: ['get-all-singer-follow', userId, limit],
    queryFn: () => userService.getAllSingerFollow(userId, limit, accessToken),
    enabled: !!userId && !!accessToken,
  });
};

export const useGetSongFavorite = (userId, accessToken) => {
  return useQuery({
    queryKey: ['get-favorite-song', userId],
    queryFn: () => songService.getSongFavorite(userId, accessToken),
    enabled: !!userId && !!accessToken,
  });
};

export const useGetAlbumFavorite = (userId, accessToken) => {
  return useQuery({
    queryKey: ['get-favorite-album', userId],
    queryFn: () => albumService.getAlbumFavorite(userId, accessToken),
    enabled: !!userId && !!accessToken,
  });
};

export const useGetSameSong = (songId, limit) => {
  return useQuery({
    queryKey: ['get-same-song', songId, limit],
    queryFn: () => songService.getSameSongs(songId, limit),
    enabled: !!songId,
  });
};

export const useGetAlbumById = (albumId) => {
  return useQuery({
    queryKey: ['get-detail', albumId],
    queryFn: () => albumService.getAlbumById(albumId),
    enabled: !!albumId,
  });
};

export const useGetPlaylistById = (plalistId) => {
  return useQuery({
    queryKey: ['get-playlist-by-id', plalistId],
    queryFn: () => playlistService.getPlaylistById(plalistId),
    enabled: !!plalistId,
  });
};

export const useGetAllSingers = (limit, offset, trash, singerName) => {
  return useQuery({
    queryKey: ['get-all-singers', limit, offset, trash, singerName],
    queryFn: () => singerService.getAllSingers(limit, offset, trash, singerName),
  });
};

export const useGetAllAlbums = (limit, offset, albumName, trash, name, sort) => {
  return useQuery({
    queryKey: ['get-all-albums', limit, offset, albumName, trash],
    queryFn: () => albumService.getAllAlbums(limit, offset, albumName, trash, name, sort),
  });
};

export const useGetAllTopic = (limit, offset, trash) => {
  return useQuery({
    queryKey: ['get-all-topic', limit, offset, trash],
    queryFn: () => topicService.getAllTopic(limit, offset, trash),
  });
};

export const useGetAllCategory = (limit, offset, trash) => {
  return useQuery({
    queryKey: ['get-all-category', limit, offset, trash],
    queryFn: () => categoryService.getAllCategory(limit, offset, trash),
  });
};

export const useGetAllNation = (limit, offset, trash) => {
  return useQuery({
    queryKey: ['get-all-nation', limit, offset, trash],
    queryFn: () => nationService.getAllNation(limit, offset, trash),
  });
};

export const useGetNationById = (id, limit, name, sort) => {
  return useQuery({
    queryKey: ['nationId', id, limit, name, sort],
    queryFn: () => nationService.getNationById(id, limit, name, sort),
    enabled: !!id,
  });
};

export const useGetTopicById = (id, limit, name, sort) => {
  return useQuery({
    queryKey: ['topicId', id, limit, name, sort],
    queryFn: () => topicService.getTopicById(id, limit, name, sort),
    enabled: !!id,
  });
};

export const useGetCategoryById = (id, limit, name, sort) => {
  return useQuery({
    queryKey: ['categoryId', id, limit, name, sort],
    queryFn: () => categoryService.getCategoryById(id, limit, name, sort),
    enabled: !!id,
  });
};

export const useGetSingerFollow = (id, accessToken) => {
  return useQuery({
    queryKey: ['get-singer-follow-random', id],
    queryFn: () => singerService.getSingerFollow(id, accessToken),
    enabled: !!accessToken,
  });
};
