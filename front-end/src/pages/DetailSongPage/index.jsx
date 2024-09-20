import { useParams } from 'react-router-dom';
import DetailSongItem from '../../components/detailSongItem';
import { useCheckFavorite, useGetSameSong, useGetSongById } from '../../hook';
import { useAudioStore, useUserStore } from '../../store';
import SongItemSmall from '../../components/songItemSmall';
import { handleAddSongs } from '../../golobalFn';
import SingerItem from '../../components/singerItem';

function DetailSongPage() {
  const user = useUserStore((state) => state.user);
  const { audio, updateSongPlay, updateSongId, updateSongAlbum } = useAudioStore();
  const songId = useParams();
  const song = useGetSongById(songId.id);
  const checkFavorite = useCheckFavorite(user.id, song.data?.data.id);
  const listSongs = useGetSameSong(songId.id, 50);

  const handlePlay = () => {
    if (Number(songId.id) === audio.songId && audio.isPlay) {
      updateSongPlay(false);
    } else {
      handleAddSongs(listSongs.data?.data[0], listSongs.data?.data, user, updateSongId, updateSongAlbum);
      updateSongPlay(true);
    }
  };
  return (
    <div className="mt-[50px] flex flex-col">
      <div className="mb-[30px]">
        {song.data && (
          <DetailSongItem
            onPlay={handlePlay}
            isActive={Number(songId.id) === audio.songId && audio.isPlay}
            song={song.data?.data}
            favorite={song.data?.favorite}
            isFavorite={checkFavorite.data?.data}
          />
        )}
        <div className="ml-[330px]">
          <div className="px-[10px] pb-[10px] flex items-center text-[12px] text-second-text font-medium uppercase border-b border-b-border-primary">
            <div className="w-1/2">Bài hát</div>
            <div className="flex-1">Album</div>
            <div className="text-right">Thời gian</div>
          </div>
          {listSongs.data?.data.map((item) => {
            return <SongItemSmall key={item.id} song={item} listSongs={listSongs.data?.data} />;
          })}
        </div>
      </div>
      <div className="mt-[48px]">
        <h3 className="capitalize mb-[20px] text-[20px] font-bold">Nghệ sĩ tham gia</h3>
        <div className="flex items-center -mx-[14px]">
          {listSongs.data?.singers.map((item) => {
            return (
              <div key={item.id} className="w-1/5 px-[14px]">
                <SingerItem singerId={item.id} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default DetailSongPage;
