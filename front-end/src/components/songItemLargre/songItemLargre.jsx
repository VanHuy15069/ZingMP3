import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './songItemLarge.module.scss';
import { useCheckFavorite, useCheckFavoriteAlbum, useGetSongByAlbum } from '../../hook';
import { useAudioStore, useUserStore } from '../../store';
import { PlusCircleOutlined } from '@ant-design/icons';
import playIcon from '../../Image/icon-playing.gif';
import pauseIcon from '../../Image/play.81e7696e.svg';
import { Context } from '../../provider/provider';
import { Tooltip } from 'antd';
import '../songItem/popover.css';
import { Bounce, toast } from 'react-toastify';
import HeartIcon from '../heartIcon/heartIcon';
const cx = classNames.bind(styles);

function SongItemLarge({ song, onClick, time = false }) {
  const navigate = useNavigate();
  const date = new Date(song?.createdAt);
  const user = useUserStore((state) => state.user);
  const audio = useAudioStore((state) => state.audio);
  const [isReload, setIsReload] = useContext(Context);
  const { updateSongPlay, updateSongAlbum } = useAudioStore();
  const [singers, setSingers] = useState([]);
  const checkFavorite = useCheckFavorite(user?.id, song?.id);
  const checkFavoriteAlbum = useCheckFavoriteAlbum(user?.id, song?.id);
  const [albumId, setAlbumId] = useState(0);
  const list = JSON.parse(localStorage.getItem('listMusic'));
  const playlistId = JSON.parse(localStorage.getItem('playlistId'));
  const songAlbum = useGetSongByAlbum(song?.id);

  useEffect(() => {
    if (Array.isArray(song?.singerInfo)) {
      setSingers(song.singerInfo);
      setAlbumId(0);
    } else {
      setSingers([song?.singerInfo]);
      setAlbumId(song?.id);
    }
  }, [audio.songId]);
  const handleNavigate = () => {
    if (albumId === 0) navigate(`/song/${song.id}`);
    else navigate(`/album/${song.id}`);
  };
  const handlePlaySong = (e) => {
    if (albumId !== 0) {
      if (audio.albumId === albumId && audio.isPlay) {
        updateSongPlay(false);
      } else {
        onClick();
        updateSongAlbum(albumId);
        updateSongPlay(true);
      }
    } else {
      if (audio.songId === song.id && audio.isPlay) {
        updateSongPlay(false);
      } else {
        onClick();
        updateSongPlay(true);
      }
    }
    setIsReload(!isReload);
    e.stopPropagation();
  };
  const handleAddToList = (e) => {
    e.stopPropagation();
    if (albumId === 0) {
      const checkSong = list.find((item) => item.id === song.id);
      if (!checkSong) {
        list.push(song);
        localStorage.setItem('listMusic', JSON.stringify(list));
        setIsReload(!isReload);
        toast('Đã thêm bài hát vào danh sách phát!', {
          toastId: 1,
          draggable: true,
          transition: Bounce,
        });
      } else {
        toast('Bài hát đã tồn tại trong danh sách phát!', {
          toastId: 1,
          draggable: true,
          transition: Bounce,
        });
      }
    } else {
      let count = 0;
      const songs = songAlbum.data?.data;
      songs.forEach((song) => {
        const checkSong = list.find((item) => item.id === song.id);
        if (!checkSong) {
          count++;
          list.push(song);
        }
      });
      if (count > 0) {
        localStorage.setItem('listMusic', JSON.stringify(list));
        setIsReload(!isReload);
        toast(`Đã thêm ${count} bài hát vào danh sách phát!`, {
          toastId: 1,
          draggable: true,
          transition: Bounce,
        });
      } else {
        toast('Bài hát đã tồn tại trong danh sách phát!', {
          toastId: 1,
          draggable: true,
          transition: Bounce,
        });
      }
    }
  };
  return (
    <>
      <div
        onClick={handleNavigate}
        className={cx('image', {
          active: song?.id === audio.songId || (audio.albumId && albumId === audio.albumId && !playlistId),
        })}
      >
        <img className={cx('img')} src={`${import.meta.env.VITE_API_FILE_URL}/${song?.image}`} alt="" />
        <div className={cx('overlay')}>
          <HeartIcon
            songId={song?.id}
            className={'text-[20px]'}
            isAlbum={albumId !== 0}
            isFavorite={(checkFavorite.data?.data && albumId === 0) || (checkFavoriteAlbum.data?.data && albumId !== 0)}
          />
          <div
            onClick={handlePlaySong}
            className="flex items-center justify-center h-[45px] w-[45px] rounded-full border"
          >
            {(audio.songId === song?.id && audio.isPlay) ||
            (albumId !== 0 && albumId === audio.albumId && audio.isPlay && !playlistId) ? (
              <img height={20} width={20} src={playIcon} />
            ) : (
              <img src={pauseIcon} />
            )}
          </div>
          <Tooltip zIndex={10} title={<p className="text-[12px]">Thêm vào danh sách phát</p>}>
            <div
              onClick={handleAddToList}
              className="text-[20px] h-[30px] w-[30px] flex items-center justify-center rounded-full hover:bg-overlay-hover"
            >
              <span className="flex items-center justify-center">
                <PlusCircleOutlined />
              </span>
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="mt-[12px] ">
        <p
          onClick={handleNavigate}
          className="text-[14px] font-bold mb-[4px] text-ellipsis overflow-hidden line-clamp-1 cursor-pointer hover:text-purple-hover"
        >
          {song?.name}
        </p>
        {time ? (
          <div className="text-second-text leading-[1.33] text-[14px]">{date.getFullYear()}</div>
        ) : (
          <div className="flex flex-wrap font-normal leading-[1.33]  text-[14px] w-fit text-ellipsis overflow-hidden line-clamp-2">
            {singers?.map((item, index) => {
              let isNotLastElement = true;
              if (index === singers.length - 1) isNotLastElement = false;
              return (
                <div key={index} className="flex text-alpha">
                  <Link to={`/singer/${item?.id}`}>
                    <p className="text-alpha hover:text-purple-hover hover:underline">{item?.name}</p>
                  </Link>
                  {isNotLastElement && (
                    <p className="tracking-normal ml-[1px]" style={{ wordSpacing: '0.1px' }}>
                      ,&ensp;
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
export default SongItemLarge;
