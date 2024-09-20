import { useParams } from 'react-router-dom';
import HeaderProfile from '../../components/headerProfile';
import {
  useCheckFavorite,
  useCheckFollow,
  useGetAlbumsBySinger,
  useGetDeatailSinger,
  useGetSingleSong,
  useGetSongHaveSingers,
  useGetTopSongBySinger,
} from '../../hook';
import { useAudioStore, useUserStore } from '../../store';
import classNames from 'classnames/bind';
import styles from './singerPage.module.scss';
import HeartIcon from '../../components/heartIcon/heartIcon';
import playIcon from '../../Image/icon-playing.gif';
import pauseIcon from '../../Image/play.81e7696e.svg';
import { Tooltip } from 'antd';
import { PlusCircleOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment/moment';
import SongItemSmall from '../../components/songItemSmall';
import { handleAddSongs } from '../../golobalFn';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../provider/provider';
import ListSongs from '../../components/listSongs/listSongs';
import * as songService from '../../service/songService';
import SongItemLarge from '../../components/songItemLargre/songItemLargre';
import SingerItem from '../../components/singerItem';
import avatar from '../../Image/avatar.png';
const cx = classNames.bind(styles);
function SingerPage() {
  const [isReload, setIsReload] = useContext(Context);
  const user = useUserStore((state) => state.user);
  const { audio, updateSongPlay, updateSongAlbum, updateSongId } = useAudioStore();
  const params = useParams();
  const singer = useGetDeatailSinger(params.id);
  const checkFollow = useCheckFollow(user?.id, params.id);
  const newSong = useGetTopSongBySinger(params.id, 1, 0, 'createdAt', 'DESC');
  const topSongs = useGetTopSongBySinger(params.id, 20, 0, 'views', 'DESC');
  const date = moment(newSong.data?.data[0]?.createdAt);
  const fomatedDate = date.format('DD/MM/YYYY');
  const [listSongs, setListSongs] = useState([]);
  const isFavorite = useCheckFavorite(user?.id, newSong.data?.data[0]?.id);
  const singleSongs = useGetSingleSong(params.id, 5, 0);
  const albums = useGetAlbumsBySinger(params.id.toString(), 5, 0);
  const songs = useGetSongHaveSingers(params.id, 5);
  const singers = useGetSongHaveSingers(params.id, null);

  useEffect(() => {
    if (topSongs.isSuccess && newSong.isSuccess) {
      const checkSong = topSongs.data?.data.find((item) => item.id === newSong.data?.data[0].id);
      if (checkSong) setListSongs([...topSongs.data?.data]);
      else setListSongs(topSongs.data?.data.concat(newSong.data?.data));
    }
  }, [topSongs.isSuccess, newSong.isSuccess, audio.songId]);
  const handlePlaySongProfile = () => {
    if (audio.isPlay) updateSongPlay(false);
    else {
      const listSongs = JSON.parse(localStorage.getItem('listMusic'));
      const checkSong = listSongs[0].singerInfo.find((item) => item.id === Number(params.id));
      if (checkSong) updateSongPlay(true);
      else handleSong();
    }
  };
  const handleSong = () => {
    if (newSong.data?.data[0].id === audio.songId && audio.isPlay) {
      updateSongPlay(false);
    } else {
      const list = [...topSongs.data?.data];
      const songIndex = list.findIndex((item) => item.id === newSong.data?.data[0].id);
      if (songIndex !== -1) {
        list.splice(songIndex, 1);
        list.splice(0, 0, newSong.data?.data[0]);
      } else {
        list.splice(0, 0, newSong.data?.data[0]);
      }
      handleAddSongs(newSong.data?.data[0], list, user, updateSongId, updateSongAlbum);
      updateSongPlay(true);
    }
    setIsReload(!isReload);
  };
  const getSongByAlbumId = async (albumId) => {
    const songs = await songService.getSongByAlbum(albumId);
    return songs.data;
  };
  const handleAlbums = async (albumId) => {
    const songs = await getSongByAlbumId(albumId);
    if (songs) handleAddSongs(songs[0], songs, user, updateSongId, updateSongAlbum);
    setIsReload(!isReload);
  };
  return (
    <>
      <div className="h-[230px] mb-[30px]">
        <HeaderProfile
          singerId={params.id}
          name={singer.data?.data.name}
          image={singer.data?.data.image}
          isFollow={checkFollow.data?.data}
          follows={singer.data?.follow}
          onClick={handlePlaySongProfile}
        />
      </div>
      <div className="flex">
        {newSong.data?.data[0]?.singerInfo?.length === 1 && (
          <div className="w-1/3">
            <div className="text-[20px] font-bold mb-[20px]">Mới Phát Hành</div>
            <div className={cx('content', { active: newSong.data?.data[0].id === audio.songId })}>
              <div className="relative rounded-[6px] h-[151px] w-[151px] overflow-hidden">
                <img
                  className={cx('img')}
                  src={`${import.meta.env.VITE_API_FILE_URL}/${newSong.data?.data[0].image}`}
                  alt=""
                />
                <div className={cx('overlay')}>
                  <HeartIcon isFavorite={isFavorite.data?.data} songId={newSong.data?.data[0].id} />
                  <div
                    onClick={handleSong}
                    className="flex items-center justify-center border rounded-full h-[45px] w-[45px]"
                  >
                    {audio.isPlay && audio.songId === newSong.data?.data[0].id ? (
                      <img height={20} width={20} src={playIcon} alt="" />
                    ) : (
                      <img src={pauseIcon} alt="" />
                    )}
                  </div>
                  <Tooltip zIndex={10} title={<p className="text-[12px]">Thêm vào danh sách phát</p>}>
                    <div className="text-[20px] h-[30px] w-[30px] flex items-center justify-center rounded-full hover:bg-overlay-hover">
                      <span className="flex items-center justify-center">
                        <PlusCircleOutlined />
                      </span>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className="flex-1 mt-[6px] ml-[16px] font-normal text-[12px] leading-[1.8] text-second-text">
                <p>Single</p>
                <h3 className="text-ellipsis overflow-hidden line-clamp-2 font-bold text-[14px] mt-[12px] mb-[2px] text-white">
                  {newSong.data?.data[0].name}
                </h3>
                <h3 className="font-normal capitalize text-[12px] leading-[18px] text-second-text mb-[12px]">
                  {newSong.data?.data[0].singerInfo[0].name}
                </h3>
                <p>{fomatedDate}</p>
              </div>
            </div>
          </div>
        )}
        <div className={`flex-1 ${newSong.data?.data[0]?.singerInfo?.length === 1 && 'ml-[28px]'}`}>
          <div className="flex justify-between items-center mb-[20px]">
            <h3 className="text-[20px] font-bold">Bài hát nổi bật</h3>
            <div className="uppercase flex items-center text-[12px] text-alpha cursor-pointer font-medium hover:text-purple-hover">
              <p>Tất cả</p>
              <span className="text-[16px] ml-[6px]">
                <RightOutlined />
              </span>
            </div>
          </div>
          <div className="flex items-center -mx-[14px] flex-wrap">
            {topSongs.data?.data.slice(0, 6).map((song) => {
              return (
                <div key={song.id} className="w-1/2 px-[14px]">
                  <SongItemSmall hideAlbum song={song} listSongs={listSongs} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-[48px]">
        <ListSongs navigate title={'Single & EP'} songs={singleSongs.data?.data} time />
      </div>
      {albums.data?.data.length > 0 && (
        <div className="mt-[48px]">
          <div className="flex items-center justify-between mb-[20px] text-[20px]">
            <h3 className="capitalize text-[20px] font-bold">Album</h3>
          </div>
          <div className="flex items-center flex-wrap -mx-[14px]">
            {albums.data?.data?.map((item, index) => {
              return (
                <div key={index} className="w-[20%] px-[14px] cursor-pointer block">
                  <SongItemLarge time song={item} onClick={() => handleAlbums(item.id)} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      {songs.data?.data.length > 0 && (
        <div className="mt-[48px]">
          <ListSongs navigate={false} title={'Xuất Hiện Trong'} songs={songs.data?.data} />
        </div>
      )}
      {singers.data?.singer.length > 0 && (
        <div className="mt-[48px]">
          <div className="flex items-center justify-between mb-[20px] text-[20px]">
            <h3 className="capitalize text-[20px] font-bold">Bạn Có Thể Thích</h3>
          </div>
          <div className="flex items-center flex-wrap -mx-[14px]">
            {singers.data?.singer.map((item) => {
              return (
                <div key={item.id} className="px-[14px] w-1/5">
                  <SingerItem singerId={item.id} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="mt-[48px]">
        <h3 className="text-[20px] mb-[20px] font-bold">Về {singer.data?.data.name}</h3>
        <div className="flex">
          <div className="w-2/5 h-[304.238px] overflow-hidden rounded-[8px] mr-[30px]">
            <img
              className="w-full h-full object-cover"
              src={singer.data?.data.image ? `${import.meta.env.VITE_API_FILE_URL}/${singer.data?.data.image}` : avatar}
            />
          </div>
          <div className="w-2/5">
            <p className="text-justify text-second-text text-[14px] overflow-hidden line-clamp-9 mb-[48px]">
              {singer.data?.data.desc ? singer.data?.data.desc : 'Đang cập nhật.'}
            </p>
            <div>
              <div className="text-[20px] leading-[24px] font-bold mb-[4px]">{singer.data?.follow}</div>
              <div className="text-second-text">Người quan tâm</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SingerPage;
