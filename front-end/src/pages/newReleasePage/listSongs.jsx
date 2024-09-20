import { Empty } from 'antd';
import SongItemSmall from '../../components/songItemSmall';
import { useGetSongsByNation } from '../../hook';
import emptyImg from '../../Image/empty-dark.png';
function ListSong({ nation }) {
  const songs = useGetSongsByNation(nation, 50);
  return (
    <>
      {songs.data?.data?.length > 0 ? (
        <>
          <div className="p-[10px] flex items-center text-[12px] text-second-text font-medium uppercase border-b border-b-border-primary">
            <div className="w-1/2">Bài hát</div>
            <div className="flex-1">Phát hành</div>
            <div className="text-right">Thời gian</div>
          </div>
          {songs.data?.data.map((item) => {
            return <SongItemSmall key={item.id} song={item} listSongs={songs.data?.data} hideAlbum showTime />;
          })}
        </>
      ) : (
        <Empty
          className="flex flex-col items-center justify-center"
          description={
            <p className="text-second-text text-[16px] font-semibold">Không có bài hát nào thuộc quốc gia này</p>
          }
          image={emptyImg}
        />
      )}
    </>
  );
}

export default ListSong;
