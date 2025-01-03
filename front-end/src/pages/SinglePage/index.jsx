import { useParams } from 'react-router-dom';
import { useGetDeatailSinger, useGetSingleSong } from '../../hook';
import SongItemLarge from '../../components/songItemLargre/songItemLargre';
import { handleAddSongs } from '../../golobalFn';
import { useAudioStore, useUserStore } from '../../store';

function SinglePage() {
  const user = useUserStore((state) => state.user);
  const { updateSongId, updateSongAlbum, updateSongPlay } = useAudioStore();
  const params = useParams();
  const singer = useGetDeatailSinger(params.id);
  const singleSong = useGetSingleSong(params.id, null, null);
  return (
    <div>
      <h3 className="font-bold text-[20px] py-4 mb-[10px]">{`${singer.data?.data.name} - Tất cả Single & Ep`}</h3>
      <div className="flex flex-wrap -mx-[14px]">
        {singleSong.data?.data.map((song) => {
          return (
            <div key={song.id} className="px-[14px] w-1/5 block cursor-pointer">
              <SongItemLarge
                song={song}
                onClick={() =>
                  handleAddSongs(song, singleSong.data?.data, user, updateSongId, updateSongAlbum, updateSongPlay)
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SinglePage;
