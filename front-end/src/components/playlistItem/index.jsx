import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import playIcon from '../../Image/icon-playing.gif';
import pauseIcon from '../../Image/play.81e7696e.svg';
import classNames from 'classnames/bind';
import styles from './playlistItem.module.scss';
import { Input, Tooltip } from 'antd';
import { GoPencil } from 'react-icons/go';
import { useAudioStore, useUserStore } from '../../store';
import defaultImage from '../../Image/playlist_default.png';
import { handleAddSongsPlaylist } from '../../golobalFn';
import ModalPlaylist from '../Modal/playlist';
import { useEffect, useState } from 'react';
import { useDeletePlaylist, useUpdatePlaylist } from '../../mutationHook/playlist';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);

function PlaylistItem({ playlist }) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { audio, updateSongPlay, updateSongAlbum, updateSongId } = useAudioStore();
  const playlistId = JSON.parse(localStorage.getItem('playlistId'));
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const updateMutation = useUpdatePlaylist();
  const deleteMutation = useDeletePlaylist();
  let image = defaultImage;
  if (playlist.songInfo[0]) image = `${import.meta.env.VITE_API_FILE_URL}/${playlist.songInfo[0].image}`;
  const handlePlay = (e) => {
    if (audio.isPlay && playlist.id === Number(playlistId)) {
      updateSongPlay(false);
    } else {
      if (playlist.songInfo.length > 0) {
        localStorage.setItem('playlistId', JSON.stringify(playlist.id));
        updateSongPlay(true);
        handleAddSongsPlaylist(playlist.songInfo[0], playlist.songInfo, user, updateSongId, updateSongAlbum);
      }
    }
    e.stopPropagation();
  };
  const handleOpenModal = (e) => {
    setValue(playlist.name);
    setIsOpen(true);
    e.stopPropagation();
  };
  const handleCancle = () => {
    setValue();
    setIsOpen(false);
  };
  useEffect(() => {
    if (updateMutation.isSuccess && updateMutation.data?.status === 'SUCCESS') {
      toast(`Cập nhật playlist thành công!`, {
        toastId: 1,
        draggable: true,
        hideProgressBar: true,
        transition: Bounce,
      });
      handleCancle();
    }
  }, [updateMutation.isSuccess]);
  useEffect(() => {
    if (deleteMutation.isSuccess && deleteMutation.data?.status === 'SUCCESS') {
      toast(`Xóa playlist thành công!`, {
        toastId: 1,
        draggable: true,
        hideProgressBar: true,
        transition: Bounce,
      });
      handleCancle();
    }
  }, [deleteMutation.isSuccess]);
  const handleUpdatePlaylist = () => {
    updateMutation.mutate({ playlistId: playlist.id, name: value, accessToken: user.accessToken });
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Xóa playlist',
      color: '#fff',
      text: 'Playlist của bạn sẽ bị xóa khỏi thư viện cá nhân. Bạn có muốn xóa?',
      confirmButtonText: 'Có',
      showCancelButton: true,
      cancelButtonText: 'Không',
      customClass: {
        popup: 'bg-alpha-primary',
        title: 'text-white ',
        confirmButton: 'rounded-[100px] bg-purple-primary px-[19px] py-[6px] text-[12px]',
        cancelButton: 'rounded-[100px] bg-border-primary px-[19px] py-[6px] text-[12px]',
        htmlContainer: 'text-[14px]',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate({ playlistId: playlist.id, accessToken: user.accessToken });
      }
    });
  };
  const handleNavigate = () => navigate(`/playlist/${playlist.id}`);
  return (
    <>
      <div className={cx('image', { active: playlist.id === Number(playlistId) })}>
        <img className={cx('img')} src={image} alt="" />
        <div onClick={handleNavigate} className={cx('overlay')}>
          <Tooltip zIndex={10} title={<p className="text-[12px]">Xóa playlist</p>}>
            <div
              onClick={handleDelete}
              className="text-[20px] h-[30px] w-[30px] flex items-center justify-center rounded-full hover:bg-overlay-hover"
            >
              <span className="flex items-center justify-center">
                <CloseOutlined />
              </span>
            </div>
          </Tooltip>
          <div onClick={handlePlay} className="flex items-center justify-center h-[45px] w-[45px] rounded-full border">
            {playlist.id === Number(playlistId) && audio.isPlay ? (
              <img height={20} width={20} src={playIcon} />
            ) : (
              <img src={pauseIcon} />
            )}
          </div>
          <Tooltip zIndex={10} title={<p className="text-[12px]">Sửa playlist</p>}>
            <div
              onClick={handleOpenModal}
              className="text-[20px] h-[30px] w-[30px] flex items-center justify-center rounded-full hover:bg-overlay-hover"
            >
              <span className="flex items-center justify-center">
                <GoPencil />
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
          {playlist.name}
        </p>
        <div className="text-second-text leading-[1.33] text-[14px]">{user.name}</div>
      </div>
      <ModalPlaylist
        title={'Chỉnh sửa playlist'}
        onOk={handleUpdatePlaylist}
        disabled={!value}
        isOpen={isOpen}
        onCancel={handleCancle}
        isUpdate
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
    </>
  );
}

export default PlaylistItem;
