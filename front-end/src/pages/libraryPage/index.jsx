import { MdPlayCircle } from 'react-icons/md';
import SingerItemSmall from '../../components/singerItemSmall';
import { useGetAlbumFavorite, useGetAllSingerFollow, useGetPlaylist, useGetSongFavorite } from '../../hook';
import { useAudioStore, useUserStore } from '../../store';
import { RxArrowRight } from 'react-icons/rx';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { ConfigProvider, Empty, Input, Tabs, Tooltip } from 'antd';
import PlaylistItem from '../../components/playlistItem';
import ModalPlaylist from '../../components/Modal/playlist';
import { useEffect, useState } from 'react';
import { useCreatePlaylist } from '../../mutationHook/playlist';
import { Bounce, toast } from 'react-toastify';
import ListFavoriteSong from './listFavoriteSong';
import ListFavoriteAlbum from './listFavoriteAlbum';
import emptyImg from '../../Image/empty-dark.png';
import { useNavigate } from 'react-router-dom';
import { handleAddSongs } from '../../golobalFn';

function LibraryPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { updateSongId, updateSongAlbum, updateSongPlay } = useAudioStore();
  const singers = useGetAllSingerFollow(user.id, 5, user.accessToken);
  const playlists = useGetPlaylist(user.id, 5, null, user.accessToken);
  const playlistMutation = useCreatePlaylist(user?.id);
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const songFavorites = useGetSongFavorite(user.id, user.accessToken);
  const albumFavorite = useGetAlbumFavorite(user.id, user.accessToken);

  const items = [
    {
      key: '1',
      label: <p className="font-semibold select-none">BÀI HÁT</p>,
      children: (
        <>
          {songFavorites.data?.data.length > 0 ? (
            <ListFavoriteSong listSongs={songFavorites.data?.data} />
          ) : (
            <Empty
              className="flex flex-col items-center justify-center"
              description={
                <p className="text-second-text text-[16px] font-semibold">Chưa có bài hát trong thư viện cá nhân</p>
              }
              image={emptyImg}
            />
          )}
        </>
      ),
    },
    {
      key: '2',
      label: <p className="font-semibold select-none">ALBUM</p>,
      children: (
        <>
          {albumFavorite.data?.data.length > 0 ? (
            <ListFavoriteAlbum listAlbums={albumFavorite.data?.data} />
          ) : (
            <Empty
              className="flex flex-col items-center justify-center"
              description={
                <p className="text-second-text text-[16px] font-semibold">Chưa có album trong thư viện cá nhân</p>
              }
              image={emptyImg}
            />
          )}
        </>
      ),
    },
  ];
  const handlePlaySong = () => {
    const list = [...songFavorites.data?.data];
    list.sort(() => Math.random() - 0.5);
    handleAddSongs(list[0], list, user, updateSongId, updateSongAlbum);
    updateSongPlay(true);
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
  const handleCancle = () => {
    setValue();
    setIsOpen(false);
  };
  const handleCreatePlaylist = () => {
    playlistMutation.mutate({ name: value, userId: user.id, accessToken: user.accessToken });
  };
  return (
    <div className="pt-[40px]">
      <div className="flex items-center">
        <h3 className="capitalize text-[40px] font-bold">Thư viện</h3>
        <span onClick={handlePlaySong} className="text-[44px] ml-[12px] cursor-pointer">
          <MdPlayCircle />
        </span>
      </div>
      {singers.data?.data.length > 0 && (
        <div className="flex flex-wrap items-center -mx-[14px] mt-[32px]">
          {singers.data?.data.map((item, index) => {
            return (
              <div key={index} className="px-[14px] w-1/6">
                <SingerItemSmall singer={item.singerInfo} />
              </div>
            );
          })}
          <div
            onClick={() => navigate('/my-music/singers')}
            className="px-[14px] w-1/6 cursor-pointer hover:text-purple-hover"
          >
            <div className="relative pt-[100%] rounded-full border border-border-primary">
              <span className="absolute text-[40px] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                <RxArrowRight />
              </span>
            </div>
            <p className="mt-[15px] text-center text-[14px] font-medium">Xem tất cả</p>
          </div>
        </div>
      )}
      <div className="mt-[48px]">
        <div className="flex items-center justify-between mb-[20px] text-[20px]">
          <div className="flex items-center">
            <h3 className="uppercase text-[20px] font-bold">Playlist</h3>
            <Tooltip title="Tạo playlist mới">
              <span
                onClick={() => setIsOpen(true)}
                className="cursor-pointer ml-[4px] text-[16px] h-[26px] w-[26px] flex items-center justify-center bg-border-primary rounded-full"
              >
                <PlusOutlined />
              </span>
            </Tooltip>
          </div>
          <div
            onClick={() => navigate('/my-music/playlists')}
            className="uppercase flex items-center text-[12px] text-alpha cursor-pointer font-medium hover:text-purple-hover"
          >
            <p>Tất cả</p>
            <span className="text-[16px] ml-[6px]">
              <RightOutlined />
            </span>
          </div>
        </div>
        <div className="flex items-center -mx-[14px]">
          {playlists.data?.data.map((item) => {
            return (
              <div key={item.id} className="px-[14px] w-1/5">
                <PlaylistItem playlist={item} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-[48px] mb-[80px]">
        <ConfigProvider
          theme={{
            token: {
              colorBorderSecondary: 'hsla(0,0%,100%,0.1)',
              colorText: '#dadada',
            },
            components: {
              Tabs: {
                itemSelectedColor: '#9b4de0',
                inkBarColor: '#9b4de0',
                itemHoverColor: '#9b4de0',
                itemActiveColor: '#9b4de0',
                horizontalItemGutter: 40,
              },
            },
          }}
        >
          <Tabs defaultActiveKey="1" items={items} className="text-white" />
        </ConfigProvider>
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
  );
}
export default LibraryPage;
