import { useParams } from 'react-router-dom';
import { useGetPlaylistById } from '../../hook';
import DetailSongItem from '../../components/detailSongItem';
import SongItemSmall from '../../components/songItemSmall';
import { useAudioStore, useUserStore } from '../../store';
import { handleAddSongsPlaylist } from '../../golobalFn';
import { Empty } from 'antd';
import emptyImg from '../../Image/empty-dark.png';
import SingerItem from '../../components/singerItem';

function DetailPlaylistPage() {
  const user = useUserStore((state) => state.user);
  const { audio, updateSongPlay, updateSongId, updateSongAlbum } = useAudioStore();
  const localPlaylistId = JSON.parse(localStorage.getItem('playlistId'));
  const playlistId = useParams();
  const playlist = useGetPlaylistById(playlistId.id);
  const handlePlay = () => {
    if (playlist.data?.data.songInfo.length > 0) {
      if (localPlaylistId === playlistId.id && audio.isPlay) {
        updateSongPlay(false);
      } else {
        localStorage.setItem('playlistId', JSON.stringify(playlistId.id));
        handleAddSongsPlaylist(
          playlist.data?.data.songInfo[0],
          playlist.data?.data.songInfo,
          user,
          updateSongId,
          updateSongAlbum,
        );
        updateSongPlay(true);
      }
    }
  };
  return (
    <div className="mt-[50px] flex flex-col">
      <div className="mb-[30px]">
        {playlist.data && (
          <DetailSongItem
            onPlay={handlePlay}
            isActive={localPlaylistId === playlistId.id && audio.isPlay}
            song={playlist.data?.data}
            isPlaylist
          />
        )}
        {playlist.data?.data.songInfo.length > 0 ? (
          <div className="ml-[330px]">
            <div className="px-[10px] pb-[10px] flex items-center text-[12px] text-second-text font-medium uppercase border-b border-b-border-primary">
              <div className="w-1/2">Bài hát</div>
              <div className="flex-1">Album</div>
              <div className="text-right">Thời gian</div>
            </div>
            {playlist.data?.data.songInfo.map((item) => {
              return (
                <SongItemSmall
                  key={item.id}
                  song={item}
                  listSongs={playlist.data?.data.songInfo}
                  playlistId={playlistId.id}
                />
              );
            })}
          </div>
        ) : (
          <div className="ml-[330px]">
            <Empty
              className="flex flex-col items-center justify-center bg-border-primary py-[20px] min-h-[220px]"
              description={
                <p className="text-second-text text-[16px] font-semibold">
                  Không có bài hát nào trong playlist của bạn
                </p>
              }
              image={emptyImg}
            />
          </div>
        )}
      </div>
      {playlist.data?.data.songInfo.length > 0 && (
        <div className="mt-[48px]">
          <h3 className="capitalize mb-[20px] text-[20px] font-bold">Nghệ sĩ tham gia</h3>
          <div className="flex items-center -mx-[14px]">
            {playlist.data?.singers.map((item) => {
              return (
                <div key={item.id} className="w-1/5 px-[14px]">
                  <SingerItem singerId={item.id} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
export default DetailPlaylistPage;
