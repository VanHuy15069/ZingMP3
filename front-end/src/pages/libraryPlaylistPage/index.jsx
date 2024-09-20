import { Input } from 'antd';
import ModalPlaylist from '../../components/Modal/playlist';
import PlaylistItem from '../../components/playlistItem';
import { useGetPlaylist } from '../../hook';
import { useUserStore } from '../../store';
import { GoPlusCircle } from 'react-icons/go';
import { useCreatePlaylist } from '../../mutationHook/playlist';
import { Bounce, toast } from 'react-toastify';
import { useEffect, useState } from 'react';

function LibraryPlaylistPage() {
  const user = useUserStore((state) => state.user);
  const playlists = useGetPlaylist(user.id, null, null, user.accessToken);
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const playlistMutation = useCreatePlaylist(user?.id);
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
  const handleCancle = () => {
    setValue();
    setIsOpen(false);
  };
  const handleCreatePlaylist = () => {
    playlistMutation.mutate({ name: value, userId: user.id, accessToken: user.accessToken });
  };
  return (
    <>
      <div className="-mx-[59px] mb-[28px] border-b border-b-border-primary flex items-center select-none">
        <div className="px-[59px] text-[24px] font-bold pr-[20px] border-r border-r-border-primary">Playlist</div>
        <p className="uppercase py-[15px] mx-[20px]">Tất cả</p>
      </div>
      <div className="flex flex-wrap -mx-[14px]">
        <div className="px-[14px] w-1/5 ">
          <div className="relative pb-full45">
            <div
              onClick={() => setIsOpen(true)}
              className="absolute top-0 left-0 bottom-0 right-0 border border-border-primary rounded-[4px] flex cursor-pointer hover:text-purple-hover"
            >
              <div className="m-auto flex flex-col justify-center items-center gap-[15px]">
                <span className="text-[47px]">
                  <GoPlusCircle />
                </span>
                <p className="text-[15px]">Thêm playlist mới</p>
              </div>
            </div>
          </div>
        </div>
        {playlists.data?.data.map((item) => {
          return (
            <div key={item.id} className="px-[14px] w-1/5">
              <PlaylistItem playlist={item} />
            </div>
          );
        })}
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
    </>
  );
}

export default LibraryPlaylistPage;
