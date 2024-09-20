import SongItemSmall from '../../components/songItemSmall';
import { handleAddSongs } from '../../golobalFn';
import { useGetTopNewSongs } from '../../hook';
import { MdPlayCircle } from 'react-icons/md';
import { useAudioStore, useUserStore } from '../../store';
function NewSongPage() {
  const user = useUserStore((state) => state.user);
  const { updateSongPlay, updateSongId, updateSongAlbum } = useAudioStore();
  const topNewSongs = useGetTopNewSongs(100);
  const handleList = () => {
    handleAddSongs(topNewSongs.data?.data[0], topNewSongs.data?.data, user, updateSongId, updateSongAlbum);
    updateSongPlay(true);
  };
  return (
    <div className="pt-[40px]">
      <div className="mb-[32px] flex items-center">
        <h3 className="capitalize text-[40px] font-bold">BXH Nhạc Mới</h3>
        <span onClick={handleList} className="text-[44px] ml-[12px] cursor-pointer">
          <MdPlayCircle />
        </span>
      </div>
      <div>
        {topNewSongs.data?.data.map((item, index) => {
          return <SongItemSmall key={index} song={item} listSongs={topNewSongs.data?.data} index={index + 1} />;
        })}
      </div>
    </div>
  );
}
export default NewSongPage;
