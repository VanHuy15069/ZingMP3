import { Link, NavLink, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './sidebar.module.scss';
import { faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIcons, faPlus } from '@fortawesome/free-solid-svg-icons';
import Button from '../button/button';
import { useAudioStore, useUserStore } from '../../store';
import ModalPlaylist from '../Modal/playlist';
import { useEffect, useState } from 'react';
import { Input } from 'antd';
import { useCreatePlaylist } from '../../mutationHook/playlist';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { PiMusicNotesPlus, PiPlaylistLight } from 'react-icons/pi';
import { RiFolderMusicLine, RiUserHeartLine } from 'react-icons/ri';
import { jwtDecode } from 'jwt-decode';
import { RxDashboard } from 'react-icons/rx';
import { useGetDetailUser } from '../../hook';
const cx = classNames.bind(style);
function Sidebar() {
  const accessToken = JSON.parse(localStorage.getItem('accessToken'));
  const navigate = useNavigate();
  const { user } = useUserStore();
  const detailUser = useGetDetailUser(user.id, user.accessToken);
  const audio = useAudioStore((state) => state.audio);
  const playlistMutation = useCreatePlaylist(user?.id);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const handleDecoded = () => {
    let decoded = {};
    if (accessToken) {
      decoded = jwtDecode(accessToken);
    }
    return decoded;
  };
  useEffect(() => {
    if (playlistMutation.isSuccess && playlistMutation.data) {
      toast(`Tạo playlist "${value}" thành công!`, {
        toastId: 1,
        draggable: true,
        hideProgressBar: true,
        transition: Bounce,
      });
      handleCancle();
    }
  }, [playlistMutation.isSuccess]);
  const handleOpenModal = () => {
    if (user.id && user.accessToken) {
      setIsOpen(true);
    } else {
      Swal.fire({
        title: 'Bạn cần đăng nhập để thưc hiện hành động này!',
        confirmButtonText: 'Đến trang đăng nhập',
        customClass: {
          popup: 'bg-alpha-primary',
          title: 'text-white',
          confirmButton: 'rounded-[100px] bg-purple-primary',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    }
  };
  const handleCancle = () => {
    setValue();
    setIsOpen(false);
  };
  const handleCreatePlaylist = () => {
    playlistMutation.mutate({ name: value, userId: user.id, accessToken: user.accessToken });
  };
  return (
    <>
      <div className="pr-[25px] pl-7 flex h-[70px] justify-center items-center">
        <Link to={'/'}>
          <div className="w-[240px] h-[70px] bg-logo-lg bg-contain bg-no-repeat tablet:max-laptop:hidden"></div>
          <div className="w-[70px] h-[70px] bg-logo bg-contain bg-no-repeat hidden tablet:max-laptop:block"></div>
        </Link>
      </div>
      <div>
        <NavLink to={'/'} end className={(nav) => cx({ active: nav.isActive })}>
          <div className={cx('menu-item')}>
            <span className={'mr-3 text-[2.05rem]'}>
              <FontAwesomeIcon icon={faCircleDot} />
            </span>
            <p className={'tablet:max-laptop:hidden'}>Khám Phá</p>
          </div>
        </NavLink>
        <NavLink to={'/my-music'} end className={(nav) => cx({ active: nav.isActive })}>
          <div className={cx('menu-item')}>
            <span className={'mr-3 text-[24px]'}>
              <RiFolderMusicLine />
            </span>
            <p className={'tablet:max-laptop:hidden'}>Thư Viện</p>
          </div>
        </NavLink>
        <NavLink to={'/new-songs'} end className={(nav) => cx({ active: nav.isActive })}>
          <div className={cx('menu-item')}>
            <span className={'mr-3 text-[24px]'}>
              <PiMusicNotesPlus />
            </span>
            <p className={'tablet:max-laptop:hidden'}>BXH Nhạc Mới</p>
          </div>
        </NavLink>
        <NavLink to={'/hub'} end className={(nav) => cx({ active: nav.isActive })}>
          <div className={cx('menu-item')}>
            <span className={'mr-3 text-[2.05rem]'}>
              <FontAwesomeIcon icon={faIcons} />
            </span>
            <p className={'tablet:max-laptop:hidden'}>Chủ Đề & Thể Loại </p>
          </div>
        </NavLink>
        {handleDecoded().isAdmin && (
          <NavLink to={'/dashboard'} end className={(nav) => cx({ active: nav.isActive })}>
            <div className={cx('menu-item')}>
              <span className={'mr-3 text-[2.05rem]'}>
                <RxDashboard />
              </span>
              <p className={'tablet:max-laptop:hidden'}>Quản trị hệ thống</p>
            </div>
          </NavLink>
        )}
        <div className="border-t-[1px] border-border-primary mx-[25px] mt-[15px]"></div>
        {user?.accessToken && !detailUser.data?.data.vip && (
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-[15px] px-[8px] my-[10px] mx-[20px] rounded-[8px] text-center tablet:max-laptop:hidden">
            <p className="mb-[10px] text-[12px] font-bold">Nâng cấp tài khoản để tận hưởng kho nhạc premium</p>
            <Button
              onClick={() => navigate('/upgrade-account')}
              bgColor={'bg-[#ffdb00]'}
              border="border-none"
              py={'py-[6px]'}
              className={'h-[32px] w-full text-[13px] text-[#000]'}
            >
              Nâng cấp tài khoản
            </Button>
          </div>
        )}
        {user.accessToken && (
          <div className="pt-[15px]">
            <Link to={'/my-music/singers'}>
              <div className={'py-[12px] px-[21px] flex items-center cursor-pointer text-[#dadada] hover:text-white'}>
                <span className={'mr-3 p-[2px] rounded-[4px] text-[16px] bg-blue-400 text-white'}>
                  <RiUserHeartLine />
                </span>
                <p className={'text-[14px] tablet:max-laptop:hidden'}>Nghệ sĩ yêu thích</p>
              </div>
            </Link>
            <Link to={'/my-music/playlists'}>
              <div className={'py-[12px] px-[21px] flex items-center cursor-pointer text-[#dadada] hover:text-white'}>
                <span className={'mr-3 p-[2px] rounded-[4px] text-[16px] bg-red-400 text-white'}>
                  <PiPlaylistLight />
                </span>
                <p className={'text-[14px] tablet:max-laptop:hidden'}>Playlist của tôi</p>
              </div>
            </Link>
          </div>
        )}

        {!user.accessToken && (
          <div className="bg-purple-primary py-[15px] px-[8px] my-[10px] mx-[20px] rounded-[8px] text-center tablet:max-laptop:hidden">
            <p className="mb-[10px] text-[12px] font-bold">Đăng nhập để khám phá playlist dành riêng cho bạn</p>
            <Button
              py={'py-[6px]'}
              px={'px-[35px]'}
              bgColor={'bg-purple-primary'}
              fontSize={'text-[12px]'}
              fontWeight={'font-semibold'}
              border={'border'}
              borderColor={'border-primary'}
              className={'hover:bg-border-primary'}
              onClick={() => navigate('/login')}
            >
              ĐĂNG NHẬP
            </Button>
          </div>
        )}
        <div
          onClick={handleOpenModal}
          className={`fixed ${
            audio.songId ? 'bottom-[90px]' : 'bottom-0'
          } cursor-pointer left-0 border-t border-border-primary flex h-[54px] w-[240px] px-[24px] items-center tablet:max-laptop:w-[70px]`}
        >
          <span className="mr-[12px]">
            <FontAwesomeIcon icon={faPlus} />
          </span>
          <p className="text-[14px] tablet:max-laptop:hidden">Tạo playlist mới</p>
        </div>
        <ModalPlaylist
          title={'Tạo playlist mới'}
          onOk={handleCreatePlaylist}
          disabled={!value}
          isOpen={isOpen}
          onCancel={handleCancle}
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Nhập tên playlist"
            variant={null}
            size="large"
            className="bg-border-primary text-white text-[14px] outline-none border-border-primary rounded-[999px] hover:bg-border-primary hover:border-border-primary focus:bg-border-primary focus:border-border-primary placeholder:text-second-text"
          />
        </ModalPlaylist>
      </div>
    </>
  );
}

export default Sidebar;
