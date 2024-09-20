import { Input, Popover } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import BoxPopover from '../boxPopover/boxPopover';
import MenuItem from '../menuItem/menuItem';
import { faCirclePlus, faEllipsis, faFileCirclePlus, faHeart, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { Context } from '../../provider/provider';
import { Bounce, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFavoriteSong } from '../../mutationHook/user';
import { useUserStore } from '../../store';
import ModalPlaylist from '../Modal/playlist';
import { useGetPlaylist } from '../../hook';
import { useDebounce } from '@uidotdev/usehooks';
import { PiPlaylist } from 'react-icons/pi';
import Swal from 'sweetalert2';
import { useAddSongPlaylist, useDeletePlaylist, useRemoveSongPlaylist } from '../../mutationHook/playlist';

function EllipsisIcon({ song, isFavorite, checkOpenPopover, playlistId = false }) {
  const user = useUserStore((state) => state.user);
  const boxRef = useRef();
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [isReload, setIsReload] = useContext(Context);
  const favoriteMutation = useFavoriteSong(user.id, song.id);
  const list = JSON.parse(localStorage.getItem('listMusic'));
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState();
  const debunce = useDebounce(value, 500);
  const playlist = useGetPlaylist(user.id, 5, debunce, user.accessToken);
  const addSongPlaylistMutation = useAddSongPlaylist();
  const playlistMutation = useRemoveSongPlaylist(playlistId);
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setIsOpenPopover(false);
        checkOpenPopover(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition >= 10) {
        setIsOpenPopover(false);
        checkOpenPopover(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    if (favoriteMutation.isSuccess && favoriteMutation.data) {
      if (!isFavorite) {
        toast('Đã thêm bài hát vào thư viện!', {
          toastId: 1,
          draggable: true,
          hideProgressBar: true,
          transition: Bounce,
        });
      } else {
        toast('Đã xóa bài hát khỏi thư viện!', {
          toastId: 1,
          draggable: true,
          hideProgressBar: true,
          transition: Bounce,
        });
      }
    }
  }, [favoriteMutation.isSuccess]);
  useEffect(() => {
    if (addSongPlaylistMutation.isSuccess && addSongPlaylistMutation.data) {
      if (addSongPlaylistMutation.data?.status === 'DEFINED') {
        toast(`Bài hát "${song.name}" đã tồn tại trong playlist "${playlistName}"`, {
          toastId: 1,
          draggable: true,
          hideProgressBar: true,
          transition: Bounce,
        });
      } else if (addSongPlaylistMutation.data?.status === 'SUCCESS') {
        toast(`Đã thêm bài hát "${song.name}" vào playlist "${playlistName}"`, {
          toastId: 1,
          draggable: true,
          hideProgressBar: true,
          transition: Bounce,
        });
        setIsOpen(false);
      }
    }
  }, [addSongPlaylistMutation.isSuccess]);
  const handleFavorite = () => {
    favoriteMutation.mutate({ userId: user.id, songId: song.id, accessToken: user.accessToken });
  };
  const handleAddPlaylist = (id, name) => {
    setPlaylistName(name);
    addSongPlaylistMutation.mutate({ playlistId: id, songId: song.id, accessToken: user.accessToken });
  };
  const handleAddToList = () => {
    const checkSong = list.find((item) => item.id === song.id);
    if (!checkSong) {
      list.push(song);
      localStorage.setItem('listMusic', JSON.stringify(list));
      setIsReload(!isReload);
      toast('Đã thêm bài hát vào danh sách phát!', {
        toastId: 1,
        draggable: true,
        hideProgressBar: true,
        transition: Bounce,
      });
    } else {
      toast('Bài hát đã tồn tại trong danh sách phát!', {
        toastId: 1,
        draggable: true,
        hideProgressBar: true,
        transition: Bounce,
      });
    }
  };
  const handlePlayNext = () => {
    const songIndex = list.findIndex((item) => item.id === song.id);
    if (songIndex !== -1) {
      list.splice(songIndex, 1);
      list.splice(1, 0, song);
    } else {
      list.splice(1, 0, song);
    }
    localStorage.setItem('listMusic', JSON.stringify(list));
    setIsReload(!isReload);
    toast('Đã thêm bài hát vào danh sách phát!', {
      toastId: 1,
      draggable: true,
      hideProgressBar: true,
      transition: Bounce,
    });
  };
  const handleOpenModal = (e) => {
    if (user?.accessToken) {
      setIsOpen(true);
      e.stopPropagation();
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
  const handleCancleModal = (e) => {
    setIsOpen(false);
    e.stopPropagation();
  };
  useEffect(() => {
    if (playlistMutation.isSuccess && playlistMutation.data) {
      toast(`Đã xóa bài hát ${song.name} khỏi playlist!`, {
        toastId: 1,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [playlistMutation.isSuccess]);
  const handleDeletePlaylist = () => {
    playlistMutation.mutate({ playlistId: playlistId, songId: song.id, accessToken: user.accessToken });
  };
  return (
    <div
      ref={boxRef}
      onClick={() => {
        setIsOpenPopover(!isOpenPopover);
        checkOpenPopover(!isOpenPopover);
      }}
    >
      <Popover
        zIndex={50}
        content={
          <BoxPopover songId={song.id}>
            {isFavorite ? (
              <MenuItem onClick={handleFavorite} isHeart icon={faHeart} text={'Xóa khỏi thư viện'} />
            ) : (
              <MenuItem onClick={handleFavorite} icon={faHeartRegular} text={'Thêm vào thư viện'} />
            )}
            <MenuItem onClick={handleAddToList} icon={faFileCirclePlus} text={'Thêm bài hát vào danh sách phát'} />
            <MenuItem onClick={handlePlayNext} icon={faPlay} text={'Phát tiếp theo'} />
            <MenuItem onClick={handleOpenModal} icon={faCirclePlus} text={'Thêm vào playlist'} />
            {playlistId && <MenuItem onClick={handleDeletePlaylist} icon={faTrashCan} text={'Xóa khỏi playlist'} />}
          </BoxPopover>
        }
        open={isOpenPopover}
      >
        <span className="p-[5px] h-[26px] w-[26px]">
          <FontAwesomeIcon icon={faEllipsis} />
        </span>
      </Popover>
      <div onClick={(e) => e.stopPropagation()}>
        <ModalPlaylist title={'Tìm kiến playlist'} isOpen={isOpen} isAddSong onCancel={handleCancleModal}>
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder="Tìm kiếm playlist"
            variant={null}
            size="large"
            className="bg-border-primary text-white text-[14px] outline-none border-border-primary rounded-[999px] hover:bg-border-primary hover:border-border-primary focus:bg-border-primary focus:border-border-primary placeholder:text-second-text"
          />
          <div className="mt-[10px]">
            {playlist.data?.data.map((item, index) => {
              return (
                <div
                  onClick={() => handleAddPlaylist(item.id, item.name)}
                  key={index}
                  className="cursor-pointer -mx-[24px]"
                >
                  <div className="py-[10px] px-[24px] flex items-center text-[14px] hover:bg-border-primary">
                    <span className="text-[18px] mr-[15px]">
                      <PiPlaylist />
                    </span>
                    <p className="text-ellipsis overflow-hidden line-clamp-1">{item.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ModalPlaylist>
      </div>
    </div>
  );
}

export default EllipsisIcon;
