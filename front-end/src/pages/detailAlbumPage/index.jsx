import { useParams } from 'react-router-dom';
import DetailSongItem from '../../components/detailSongItem';
import { useCheckFavoriteAlbum, useGetAlbumById } from '../../hook';
import { useAudioStore, useUserStore } from '../../store';
import SongItemSmall from '../../components/songItemSmall';
import SingerItem from '../../components/singerItem';
import { handleAddSongs } from '../../golobalFn';
import { useContext } from 'react';
import { Context } from '../../provider/provider';

function DetailAlbumPage() {
  const [isReload, setIsReload] = useContext(Context);
  const user = useUserStore((state) => state.user);
  const albumId = useParams();
  const { audio, updateSongPlay, updateSongId, updateSongAlbum } = useAudioStore();
  const album = useGetAlbumById(albumId.id);
  const checkFavorite = useCheckFavoriteAlbum(user.id, albumId.id);
  const handlePlay = () => {
    if (Number(albumId.id) === audio.albumId && audio.isPlay) {
      updateSongPlay(false);
    } else {
      handleAddSongs(album.data?.data.songInfo[0], album.data?.data.songInfo, user, updateSongId, updateSongAlbum);
      updateSongPlay(true);
    }
    setIsReload(!isReload);
  };
  return (
    <div className="mt-[50px] flex flex-col">
      <div className="mb-[30px]">
        {album.data && (
          <DetailSongItem
            onPlay={handlePlay}
            isActive={audio.albumId && Number(albumId.id) === audio.albumId && audio.isPlay}
            song={album.data?.data}
            favorite={album.data?.favorite}
            isFavorite={checkFavorite.data?.data}
            listSingers={album?.data.singers}
            isAlbum
          />
        )}
        <div className="ml-[330px]">
          <div className="px-[10px] pb-[10px] flex items-center justify-between text-[12px] text-second-text font-medium uppercase border-b border-b-border-primary">
            <div>Bài hát</div>
            <div className="text-right">Thời gian</div>
          </div>
          {album.data?.data.songInfo.map((item) => {
            return <SongItemSmall key={item.id} song={item} listSongs={album.data?.data.songInfo} />;
          })}
        </div>
      </div>
      <div className="mt-[48px]">
        <h3 className="capitalize mb-[20px] text-[20px] font-bold">Nghệ sĩ tham gia</h3>
        <div className="flex items-center -mx-[14px]">
          {album.data?.singers.map((item) => {
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

export default DetailAlbumPage;
