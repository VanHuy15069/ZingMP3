import classNames from 'classnames/bind';
import styles from './songItemSmall.module.scss';
import pauseIcon from '../../Image/play.81e7696e.svg';
import playIcon from '../../Image/icon-playing.gif';
import HeartIcon from '../heartIcon/heartIcon';
import EllipsisIcon from '../EllipsisIcon';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useCheckFavorite } from '../../hook';
import { useAudioStore, useUserStore } from '../../store';
import { handleAddSongs, handleAddSongsPlaylist } from '../../golobalFn';
import { Context } from '../../provider/provider';
import { MdOutlineHorizontalRule } from 'react-icons/md';
import IconBasic from '../IconBasic/IconBasic';
import moment from 'moment/moment';
const cx = classNames.bind(styles);

function SongItemSmall({
  hideAlbum = false,
  song,
  listSongs,
  isPlayList = false,
  index = false,
  showTime = false,
  playlistId = false,
  hideHeard = false,
}) {
  const navigate = useNavigate();
  const [isReload, setIsReload] = useContext(Context);
  const user = useUserStore((state) => state.user);
  const { audio, updateSongId, updateSongPlay, updateSongAlbum } = useAudioStore();
  const [isShowPopover, setIsShowPopover] = useState(false);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const checkFavorite = useCheckFavorite(user?.id, song.id);
  const [date, setDate] = useState('');
  const now = moment();
  const duration = moment.duration(now.diff(moment(song.createdAt)));
  const time = duration.asDays();
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
  const handleLoad = (e) => {
    const audio = e.target;
    const audioDuration = audio.duration;
    if (!isNaN(audioDuration)) {
      setMinute(Math.floor(audioDuration / 60));
      setSecond(Math.round(audioDuration % 60));
    }
  };
  const handleSong = () => {
    if (song.id === audio.songId && audio.isPlay) {
      updateSongPlay(false);
    } else {
      if (playlistId) {
        localStorage.setItem('playlistId', JSON.stringify(playlistId));
        handleAddSongsPlaylist(song, listSongs, user, updateSongId, updateSongAlbum);
      } else handleAddSongs(song, listSongs, user, updateSongId, updateSongAlbum);
      updateSongPlay(true);
    }
    setIsReload(!isReload);
  };
  return (
    <div
      className={cx('wrapper', {
        active: song.id === audio.songId || isShowPopover,
        isPlaylist: isPlayList,
        currentSong: audio.songId === song.id,
      })}
    >
      {song.link && <audio onLoadedMetadata={handleLoad} src={`${import.meta.env.VITE_API_FILE_URL}/${song.link}`} />}
      {index && (
        <div className="flex items-center">
          <span className={cx('number', { one: index === 1, two: index === 2, three: index === 3 })}>{index}</span>
          <span className="mr-[15px]">
            <MdOutlineHorizontalRule />
          </span>
        </div>
      )}
      <div className={`flex items-center ${(!hideAlbum || showTime) && 'w-1/2'}`}>
        <div className="relative h-[40px] w-[40px] min-w-[40px] overflow-hidden rounded-[4px] mr-[10px]">
          <img
            className="h-full w-full object-cover block"
            src={`${import.meta.env.VITE_API_FILE_URL}/${song.image}`}
            alt=""
          />
          <div className={cx('overlay')} onClick={handleSong}>
            {audio.isPlay && song.id === audio.songId ? (
              <img height={16} width={16} src={playIcon} alt="" />
            ) : (
              <img height={36} width={36} src={pauseIcon} alt="" />
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex items-center mr-[10px]">
            <p
              onClick={() => navigate(`/song/${song.id}`)}
              className="flex-1 font-medium text-[14px] text-ellipsis overflow-hidden line-clamp-1 hover:text-purple-hover"
            >
              {song.name}
            </p>
            {song.vip && (
              <span className="ml-[8px]">
                <IconBasic premium />
              </span>
            )}
          </div>
          <div className="flex text-[12px]">
            {song.singerInfo?.map((item, index) => {
              let isNotLastElement = true;
              if (index === song.singerInfo.length - 1) isNotLastElement = false;
              return (
                <div key={item.id} className="flex text-alpha">
                  <Link to={`/singer/${item.id}`}>
                    <p className="text-second-text hover:text-purple-hover hover:underline">{item.name}</p>
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
        </div>
      </div>
      {!hideAlbum && (
        <div
          onClick={() => navigate(`/album/${song.albumInfo.id}`)}
          className="flex-1 text-alpha text-[12px] font-normal hover:underline hover:text-purple-hover"
        >
          {song.albumInfo?.name}
        </div>
      )}
      {showTime && <div className="flex-1 text-alpha text-[12px] font-normal">{date}</div>}
      <div className="flex items-center justify-end flex-1">
        <div className={cx('action')}>
          {!hideHeard && <HeartIcon isFavorite={checkFavorite.data?.data} className={'text-[16px]'} songId={song.id} />}
          <div className="w-[46px]">
            <div className="p-[6px] w-[32px] h-[32px] text-[14px] rounded-full hover:bg-border-primary cursor-pointer flex items-center justify-center">
              <EllipsisIcon
                song={song}
                isFavorite={checkFavorite.data?.data}
                checkOpenPopover={(value) => setIsShowPopover(value)}
                playlistId={playlistId}
              />
            </div>
          </div>
        </div>
        <div className={cx('duration')}>
          {checkFavorite.data?.data && (
            <HeartIcon isFavorite={checkFavorite.data?.data} className={'text-[16px]'} songId={song.id} />
          )}
          <p className="w-[46px]">
            {minute >= 10 ? minute : '0' + minute}:{second >= 10 ? second : '0' + second}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SongItemSmall;
