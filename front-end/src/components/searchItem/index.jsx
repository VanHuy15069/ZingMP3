import classNames from 'classnames/bind';
import styles from './searchItem.module.scss';
import pauseIcon from '../../Image/play.81e7696e.svg';
import playIcon from '../../Image/icon-playing.gif';
import HeartIcon from '../heartIcon/heartIcon';
import EllipsisIcon from '../EllipsisIcon';
import { useAudioStore, useUserStore } from '../../store';
import { handleAddSongs } from '../../golobalFn';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCheckFavorite } from '../../hook';
const cx = classNames.bind(styles);
function SearchItem({ song, listSongs }) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { audio, updateSongPlay, updateSongId, updateSongAlbum } = useAudioStore();
  const checkFavorite = useCheckFavorite(user.id, song.id);
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const handlePlay = () => {
    if (song.id === audio.songId && audio.isPlay) {
      updateSongPlay(false);
    } else {
      handleAddSongs(song, listSongs, user, updateSongId, updateSongAlbum);
      updateSongPlay(true);
    }
  };
  return (
    <div className={cx('wrapper', { active: song.id === audio.songId || isOpenPopover })}>
      <div className="relative mr-[16px] h-[84px] w-[84px] rounded-[4px] overflow-hidden">
        <img className="w-full h-full object-cover" src={`${import.meta.env.VITE_API_FILE_URL}/${song.image}`} alt="" />
        <div onClick={handlePlay} className={cx('overlay')}>
          {song.id === audio.songId && audio.isPlay ? (
            <img height={18} width={18} src={playIcon} />
          ) : (
            <img src={pauseIcon} />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between flex-1">
        <div className="flex flex-col justify-center text-second-text text-[12px]">
          <p className="leading-[18px] mb-[6px]">Bài hát</p>
          <p
            onClick={() => navigate(`/song/${song.id}`)}
            className="text-white capitalize text-[14px] leading-[20px] font-semibold cursor-pointer"
          >
            {song.name}
          </p>
          <div className="flex items-center">
            {song.singerInfo.map((item, index) => {
              let isNotLastElement = true;
              if (index === song.singerInfo.length - 1) isNotLastElement = false;
              return (
                <div key={item.id} className="flex  text-alpha">
                  <Link to={`/singer/${item.id}`}>
                    <p className="cursor-pointer text-second-text leading-[18px] capitalize mt-[2px] hover:text-purple-hover hover:underline">
                      {item.name}
                    </p>
                  </Link>
                  {isNotLastElement && <p className="tracking-normal ml-[1px]">,&ensp;</p>}
                </div>
              );
            })}
          </div>
        </div>
        <div className={cx('action')}>
          <HeartIcon songId={song.id} isFavorite={checkFavorite.data?.data} className={'text-[16px]'} />
          <div className="p-[6px] w-[38px] h-[38px] text-[14px] rounded-full hover:bg-border-primary cursor-pointer flex items-center justify-center">
            <EllipsisIcon
              song={song}
              isFavorite={checkFavorite.data?.data}
              checkOpenPopover={(value) => setIsOpenPopover(value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchItem;
