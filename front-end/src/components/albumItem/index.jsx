import { PlusCircleOutlined } from '@ant-design/icons';
import playIcon from '../../Image/icon-playing.gif';
import pauseIcon from '../../Image/play.81e7696e.svg';
import classNames from 'classnames/bind';
import styles from './albumItem.module.scss';
import HeartIcon from '../heartIcon/heartIcon';
import { useCheckFavoriteAlbum } from '../../hook';
import { useAudioStore, useUserStore } from '../../store';
import { Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { handleAddSongs } from '../../golobalFn';
import { Bounce, toast } from 'react-toastify';
import { useContext } from 'react';
import { Context } from '../../provider/provider';
const cx = classNames.bind(styles);
function AlbumItem({ album }) {
  const navigate = useNavigate();
  const [isReload, setIsReload] = useContext(Context);
  const user = useUserStore((state) => state.user);
  const { audio, updateSongPlay, updateSongId, updateSongAlbum } = useAudioStore();
  const checkFavoriteAlbum = useCheckFavoriteAlbum(user?.id, album.id);
  const list = JSON.parse(localStorage.getItem('listMusic'));
  const playlistId = JSON.parse(localStorage.getItem('playlistId'));
  const handlePlaySong = (e) => {
    if (album.id === audio.albumId && audio.isPlay) {
      updateSongPlay(false);
    } else {
      updateSongPlay(true);
      handleAddSongs(album.songInfo[0], album.songInfo, user, updateSongId, updateSongAlbum);
    }
    e.stopPropagation();
  };

  const handleAddToList = (e) => {
    e.stopPropagation();
    let count = 0;
    const songs = album.songInfo;
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
  };
  const handleNavigate = () => {
    navigate(`/album/${album.id}`);
  };
  return (
    <>
      <div className={cx('image', { active: album.id === audio.albumId && !playlistId })}>
        <img className={cx('img')} src={`${import.meta.env.VITE_API_FILE_URL}/${album.image}`} alt="" />
        <div onClick={handleNavigate} className={cx('overlay')}>
          <HeartIcon
            songId={album.id}
            className={'text-[20px]'}
            isAlbum={true}
            isFavorite={checkFavoriteAlbum.data?.data}
          />
          <div
            onClick={handlePlaySong}
            className="flex items-center justify-center h-[45px] w-[45px] rounded-full border"
          >
            {album.id === audio.albumId && audio.isPlay && !playlistId ? (
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
          {album.name}
        </p>
        <div className="flex flex-wrap font-normal leading-[1.33]  text-[14px] w-fit text-ellipsis overflow-hidden line-clamp-2">
          <div className="flex text-alpha">
            <Link to={`/singer/${album.singerInfo.id}`}>
              <p className="text-alpha hover:text-purple-hover hover:underline">{album.singerInfo.name}</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default AlbumItem;
