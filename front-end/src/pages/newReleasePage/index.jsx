import { ConfigProvider, Tabs } from 'antd';
import { MdPlayCircle } from 'react-icons/md';
import ListSong from './listSongs';
import { useGetSongsByNation } from '../../hook';
import { useAudioStore, useUserStore } from '../../store';
import { handleAddSongs } from '../../golobalFn';

function NewReleasePage() {
  const user = useUserStore((state) => state.user);
  const { updateSongPlay, updateSongId, updateSongAlbum } = useAudioStore();
  const songs = useGetSongsByNation(null, 50);
  const items = [
    {
      key: '1',
      label: <p className="font-semibold select-none">TẤT CẢ</p>,
      children: <ListSong nation={null} />,
    },
    {
      key: '2',
      label: <p className="font-semibold select-none">VIỆT NAM</p>,
      children: <ListSong nation={'Việt Nam'} />,
    },
    {
      key: '3',
      label: <p className="font-semibold select-none">ÂU MỸ</p>,
      children: <ListSong nation={'Âu Mỹ'} />,
    },
    {
      key: '4',
      label: <p className="font-semibold select-none">HÀN QUỐC</p>,
      children: <ListSong nation={'Hàn Quốc'} />,
    },
    {
      key: '5',
      label: <p className="font-semibold select-none">TRUNG QUỐC</p>,
      children: <ListSong nation={'Trung Quốc'} />,
    },
  ];
  const handlePlaySong = () => {
    const list = [...songs.data?.data];
    list.sort(() => Math.random() - 0.5);
    handleAddSongs(list[0], list, user, updateSongId, updateSongAlbum);
    updateSongPlay(true);
  };
  return (
    <div className="pt-[40px] pb-[50px]">
      <div className="flex items-center">
        <h3 className="capitalize text-[40px] font-bold">Mới phát hành</h3>
        <span onClick={handlePlaySong} className="text-[44px] ml-[12px] cursor-pointer">
          <MdPlayCircle />
        </span>
      </div>
      <div className="mt-[32px]">
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
    </div>
  );
}
export default NewReleasePage;
