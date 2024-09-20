import moment from 'moment/moment';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './newSongItem.module.scss';
import playIcon from '../../Image/icon-playing.gif';
import pauseIcon from '../../Image/play.81e7696e.svg';
import { useAudioStore, useUserStore } from '../../store';
import { handleAddSongs } from '../../golobalFn';
import { useContext } from 'react';
import { Context } from '../../provider/provider';
const cx = classNames.bind(styles);

function NewSongItem({ song, index, listSongs }) {
  const [isReload, setIsReload] = useContext(Context);
  const user = useUserStore((state) => state.user);
  const audio = useAudioStore((state) => state.audio);
  const { updateSongPlay, updateSongId, updateSongAlbum } = useAudioStore();
  const navigate = useNavigate();
  const date = moment(song.createdAt);
  const fomatedDate = date.format('DD.MM.YYYY');
  const handlePLaySong = (e) => {
    handleAddSongs(song, listSongs, user, updateSongId, updateSongAlbum);
    updateSongPlay(true);
    setIsReload(!isReload);
    e.stopPropagation();
  };
  const handlePauseSong = (e) => {
    updateSongPlay(false);
    e.stopPropagation();
  };
  return (
    <div
      onClick={() => navigate('/new-songs')}
      className={cx('wrapper', { active: song.id === audio.songId && audio.isPlay })}
    >
      <div className={cx('wrapper-image')}>
        <img className={cx('img')} src={`${import.meta.env.VITE_API_FILE_URL}/${song.image}`} alt="" />
        <div
          onClick={(e) => {
            navigate(`/song/${song.id}`);
            e.stopPropagation();
          }}
          className={cx('overlay')}
        >
          {song.id === audio.songId && audio.isPlay && (
            <div
              onClick={handlePauseSong}
              className="h-[45px] w-[45px] flex justify-center items-center rounded-full border"
            >
              <img height={20} width={20} src={playIcon} alt="" />
            </div>
          )}

          <div onClick={handlePLaySong} className={cx('pauseIcon')}>
            <img height={40} width={40} src={pauseIcon} alt="" />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between flex-1">
        <div>
          <div>{song.name}</div>
          <div className="mt-[3px] text-[12px] flex">
            {song.singerInfo.map((singer, index) => {
              let isNotLastElement = true;
              if (index === song.singerInfo.length - 1) isNotLastElement = false;
              return (
                <div key={singer.id} className="flex  text-alpha">
                  <Link to={`/singer/${singer.id}`}>
                    <p className="cursor-pointer text-alpha hover:text-purple-hover hover:underline">{singer.name}</p>
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
        <div className="flex justify-between items-end">
          <div
            style={{ WebkitTextStroke: '1px #fff', fontFamily: "'Roboto', sans-serif" }}
            className="font-black opacity-40 text-transparent text-[40px] leading-none"
          >
            #{index}
          </div>
          <div className="text-alpha leading-[1.8] text-[14px]">{fomatedDate}</div>
        </div>
      </div>
    </div>
  );
}

export default NewSongItem;
