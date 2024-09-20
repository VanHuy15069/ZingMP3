import classNames from 'classnames/bind';
import styles from './songItem.module.scss';
import { RxShuffle } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useCheckFollow, useGetDeatailSinger, useGetTopSongBySinger } from '../../hook';
import avatar from '../../Image/avatar.png';
import { useAudioStore, useUserStore } from '../../store';
import { handleAddSongs } from '../../golobalFn';
const cx = classNames.bind(styles);

function SingerItem({ singerId }) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { updateSongId, updateSongAlbum, updateSongPlay } = useAudioStore();
  const singer = useGetDeatailSinger(singerId);
  const checkFollow = useCheckFollow(user?.id, singerId);
  const songs = useGetTopSongBySinger(singerId, 20, 0, 'createdAt', 'DESC');
  let avatarImg = avatar;
  if (singer.data?.data.image) avatarImg = `${import.meta.env.VITE_API_FILE_URL}/${singer.data?.data.image}`;
  const handlePlaySong = (e) => {
    const list = songs.data?.data.sort(() => Math.random() - 0.5);
    handleAddSongs(list[0], list, user, updateSongId, updateSongAlbum);
    updateSongPlay(true);
    e.stopPropagation();
  };
  return (
    <div className="w-full">
      <div className={cx('avata')} onClick={() => navigate(`/singer/${singerId}`)}>
        <img src={avatarImg} alt="" />
        <div className={cx('overlay')}>
          <span
            onClick={handlePlaySong}
            className="h-[45px] w-[45px] border rounded-full flex justify-center items-center text-[24px] hover:opacity-80"
          >
            <RxShuffle />
          </span>
        </div>
      </div>
      <div className="min-h-[52px] text-center select-none">
        <div className="mt-[15px] mb-[4px]">
          <Link to={`/singer/${singerId}`}>
            <p className="text-[14px] leading-[1.36] font-medium hover:underline hover:text-purple-hover">
              {singer.data?.data.name}
            </p>
          </Link>
        </div>
        <p className="text-[12px] leading-[1.33] text-second-text">{singer.data?.follow} người quan tâm</p>
      </div>
      <div className="flex justify-center">
        {checkFollow.data?.data ? (
          <button
            onClick={handlePlaySong}
            className="flex items-center outline-none border border-border-primary bg-transparent text-[12px] py-[6px] px-[19px] rounded-[999px] hover:border-purple-primary hover:text-purple-primary"
          >
            <span className="mr-[5px]">
              <RxShuffle />
            </span>
            <p className="uppercase">Góc nhạc</p>
          </button>
        ) : (
          <button className="flex items-center outline-none border border-purple-primary bg-purple-primary text-[12px] py-[6px] px-[19px] rounded-[999px] hover:bg-[#8b45ca]">
            <span className="mr-[5px]">
              <FontAwesomeIcon icon={faUserPlus} />
            </span>
            <p className="uppercase">Quan tâm</p>
          </button>
        )}
      </div>
    </div>
  );
}

export default SingerItem;
