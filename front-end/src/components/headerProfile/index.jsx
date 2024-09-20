import classNames from 'classnames/bind';
import styles from './headerProfile.module.scss';
import pauseIcon from '../../Image/play.81e7696e.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPause, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../Image/avatar.png';
import { useGetSongById } from '../../hook';
import { useAudioStore, useUserStore } from '../../store';
import { useFollowSinger } from '../../mutationHook/user';
const cx = classNames.bind(styles);

function HeaderProfile({ name, image, singerId = false, follows, isFollow, vip = false, onClick }) {
  const user = useUserStore((state) => state.user);
  const audio = useAudioStore((state) => state.audio);
  const song = useGetSongById(audio.songId);
  const checkSinger = song.data?.data.singerInfo.find((item) => item.id === Number(singerId));
  const followMutation = useFollowSinger(user.id, singerId);
  let avatarImg = avatar;
  if (image) avatarImg = `${import.meta.env.VITE_API_FILE_URL}/${image}`;
  const handleFollow = () => {
    followMutation.mutate({ userId: user.id, singerId: singerId, accessToken: user.accessToken });
  };
  return (
    <div className="absolute top-0 right-0 left-[240px] select-none">
      <div className={cx('background')}>
        <img className="block h-full w-full object-cover" src={avatarImg} alt="" />
        <div className="flex absolute items-center h-[140px] top-[135px] left-[59px]">
          <div className="h-[140px] w-[140px] rounded-full overflow-hidden mr-[32px]">
            <img className="h-full w-full object-cover" src={avatarImg} alt="" />
          </div>
          <div className="h-full flex-1 flex justify-center flex-col">
            <div className="flex items-center">
              <p className={`leading-normal text-[60px] font-bold ${vip && 'text-yellow-500'}`}>{name}</p>
              {singerId && (
                <div
                  onClick={onClick}
                  className="ml-[20px] h-[52px] w-[52px] rounded-full bg-purple-hover flex items-center justify-center hover:bg-purple-primary cursor-pointer"
                >
                  {checkSinger && audio.isPlay ? (
                    <span className="text-[24px]">
                      <FontAwesomeIcon icon={faPause} />
                    </span>
                  ) : (
                    <img height={52} width={52} src={pauseIcon} alt="" />
                  )}
                </div>
              )}
            </div>
            {singerId && (
              <div className="flex items-center text-[14px] mt-[16px]">
                <p className="mr-[16px]">{follows} người quan tâm</p>
                {isFollow ? (
                  <button
                    onClick={handleFollow}
                    className="flex items-center justify-center h-[28px] text-white px-[24px] py-[4px] bg-transparent rounded-[100px] cursor-pointer border border-border-primary text-[12px] hover:text-second-text"
                  >
                    <span className="mr-[5px]">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <p className="uppercase">Đã quan tâm</p>
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    className="flex items-center justify-center h-[28px] text-white px-[24px] py-[4px] bg-transparent rounded-[100px] cursor-pointer border border-border-primary text-[12px] hover:text-second-text"
                  >
                    <span className="mr-[5px]">
                      <FontAwesomeIcon icon={faUserPlus} />
                    </span>
                    <p className="uppercase">Quan tâm</p>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderProfile;
