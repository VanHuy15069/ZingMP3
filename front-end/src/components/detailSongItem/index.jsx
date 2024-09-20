import classNames from 'classnames/bind';
import styles from './detailSong.module.scss';
import playIcon from '../../Image/icon-playing.gif';
import pauseIcon from '../../Image/play.81e7696e.svg';
import HeartIcon from '../heartIcon/heartIcon';
import { useAudioStore, useUserStore } from '../../store';
import { Link } from 'react-router-dom';
import { IoMdPlay } from 'react-icons/io';
import DownLoadIcon from '../downloadIcon';
import { MdPause } from 'react-icons/md';
import defaultImage from '../../Image/playlist_default.png';
const cx = classNames.bind(styles);

function DetailSongItem({
  song,
  isActive = false,
  isPlaylist = false,
  isFavorite = false,
  isAlbum = false,
  favorite = false,
  onPlay,
  listSingers = false,
}) {
  const user = useUserStore((state) => state.user);
  const date = new Date(song?.createdAt);
  const audio = useAudioStore((state) => state.audio);
  let image = defaultImage;
  if (isPlaylist && song?.songInfo[0]?.image) image = `${import.meta.env.VITE_API_FILE_URL}/${song.songInfo[0].image}`;
  return (
    <div className="sticky top-[110px] w-[300px] float-left block">
      {song && (
        <div className={cx('image', { active: isActive })}>
          {isPlaylist ? (
            <img className={cx('img')} src={image} alt="" />
          ) : (
            <img className={cx('img')} src={`${import.meta.env.VITE_API_FILE_URL}/${song.image}`} alt="" />
          )}
          <div className={cx('overlay')}>
            <div onClick={onPlay} className="flex items-center justify-center h-[45px] w-[45px] rounded-full border">
              {isActive && audio.isPlay ? <img height={20} width={20} src={playIcon} /> : <img src={pauseIcon} />}
            </div>
          </div>
        </div>
      )}
      <div className="mt-[12px] flex flex-col items-center select-none">
        <div className="w-full text-center">
          <h3 className="text-[20px] font-bold leading-[1.5]">{song?.name}</h3>
          <div className="flex items-center text-[12px] text-second-text justify-center">
            {!isPlaylist &&
              !listSingers &&
              song?.singerInfo?.map((item, index) => {
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
            {isPlaylist && <p>{user.name}</p>}
            {listSingers &&
              listSingers?.map((item, index) => {
                let isNotLastElement = true;
                if (index === listSingers.length - 1) isNotLastElement = false;
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
            <p>&ensp;•&ensp;</p>
            <p>{date.getFullYear()}</p>
          </div>
          {(favorite || favorite === 0) && <p className="text-[12px] text-second-text">{favorite} người yêu thích</p>}
        </div>
        <div onClick={onPlay} className="mt-[16px]">
          {isActive && audio.isPlay ? (
            <button className="flex items-center mb-[16px] rounded-[999px] bg-purple-primary border-purple-primary uppercase text-[14px] py-[9px] px-[24px]">
              <span className="text-[16px] mr-[5px]">
                <MdPause />
              </span>
              <p>Tạm dừng</p>
            </button>
          ) : (
            <button className="flex items-center mb-[16px] rounded-[999px] bg-purple-primary border-purple-primary uppercase text-[14px] py-[9px] px-[24px]">
              <span className="text-[16px] mr-[5px]">
                <IoMdPlay />
              </span>
              <p>Phát tất cả</p>
            </button>
          )}
          {!isPlaylist && (
            <div className="flex items-center justify-center gap-[10px]">
              <HeartIcon isFavorite={isFavorite} songId={song.id} overlay />
              {!isAlbum && <DownLoadIcon overlay />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default DetailSongItem;
