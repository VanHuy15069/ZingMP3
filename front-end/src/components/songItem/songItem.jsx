import moment from 'moment/moment';
import classnames from 'classnames/bind';
import styles from './songItem.module.scss';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAudioStore, useUserStore } from '../../store';
import playIcon from '../../Image/icon-playing.gif';
import pauseIcon from '../../Image/play.81e7696e.svg';
import { Context } from '../../provider/provider';
import './popover.css';
import { useCheckFavorite } from '../../hook';
import 'react-toastify/dist/ReactToastify.css';
import EllipsisIcon from '../EllipsisIcon';
import { handleAddSongs } from '../../golobalFn';
import IconBasic from '../IconBasic/IconBasic';
const cx = classnames.bind(styles);

function SongItem({ song, listSongs, isItemSearch = false }) {
  const user = useUserStore((state) => state.user);
  const [isReload, setIsReload] = useContext(Context);
  const audio = useAudioStore((state) => state.audio);
  const { updateSongPlay, updateSongId, updateSongAlbum } = useAudioStore();
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [date, setDate] = useState('');
  const now = moment();
  const duration = moment.duration(now.diff(moment(song.createdAt)));
  const time = duration.asDays();
  const checkFavorite = useCheckFavorite(user.id, song.id);
  const handlePlay = () => {
    setIsReload(!isReload);
    if (audio.songId === song.id && audio.isPlay) {
      updateSongPlay(false);
    } else {
      updateSongPlay(true);
      handleAddSongs(song, listSongs, user, updateSongId, updateSongAlbum);
    }
  };
  useEffect(() => {
    if (time < 1) {
      setDate('Hôm nay');
    } else if (time < 7) {
      setDate(`${Math.floor(time)} ngày trước`);
    } else if (time < 30) {
      setDate(`${Math.floor(time / 7)} tuần trước`);
    } else if (time < 365) {
      setDate(`${Math.floor(time / 30)} tháng trước`);
    } else {
      setDate(`${Math.floor(time / 365)} năm trước`);
    }
  }, []);
  return (
    <div className={cx('wrapper', { active: song.id === audio.songId || isOpenPopover, isSearch: isItemSearch })}>
      <div className="flex items-center">
        <div
          onClick={handlePlay}
          className={`mr-[10px] relative rounded-[4px] overflow-hidden ${
            isItemSearch ? 'h-[52px] w-[52px]' : 'h-[60px] w-[60px]'
          } cursor-pointer`}
        >
          <img
            className="h-full w-full object-cover"
            src={`${import.meta.env.VITE_API_FILE_URL}/${song.image}`}
            alt=""
          />
          <div onClick={handlePlay} className={cx('overlay')}>
            {song.id === audio.songId && audio.isPlay ? (
              <img height={16} width={16} src={playIcon} alt="" />
            ) : (
              <img height={36} width={36} src={pauseIcon} alt="" />
            )}
          </div>
        </div>
        <div
          className={`flex flex-1 flex-col ${
            isItemSearch ? 'justify-center' : 'justify-between'
          } text-[12px] text-alpha`}
        >
          <div className="flex items-center">
            <Link
              to={`/song/${song.id}`}
              className="cursor-pointer text-ellipsis overflow-hidden line-clamp-1 text-[14px] text-white font-bold hover:text-purple-hover"
            >
              {song.name}
            </Link>
            {song.vip && (
              <span className="text-white ml-[8px]">
                <IconBasic premium={song.vip} />
              </span>
            )}
          </div>
          <div className="flex items-center">
            {song.singerInfo.map((item, index) => {
              let isNotLastElement = true;
              if (index === song.singerInfo.length - 1) isNotLastElement = false;
              return (
                <div key={item.id} className="flex  text-alpha">
                  <Link to={`/singer/${item.id}`}>
                    <p className="cursor-pointer text-alpha hover:text-purple-hover hover:underline">{item.name}</p>
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
          {!isItemSearch && <p>{date}</p>}
        </div>
      </div>
      <div className={cx('icon')}>
        <EllipsisIcon
          song={song}
          isFavorite={checkFavorite.data?.data}
          checkOpenPopover={(value) => setIsOpenPopover(value)}
        />
      </div>
    </div>
  );
}
export default SongItem;
