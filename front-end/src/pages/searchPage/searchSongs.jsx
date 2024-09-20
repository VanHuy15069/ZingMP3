import { Empty } from 'antd';
import SongItemSmall from '../../components/songItemSmall';
import { useGetAllSongs } from '../../hook';
import emptyImg from '../../Image/empty-dark.png';

function SearchSongs({ searchValue }) {
  const songs = useGetAllSongs(null, null, searchValue, 'createdAt', 'DESC', false);

  return (
    <>
      {songs.data?.count > 0 ? (
        <div className="mt-[12px]">
          <div className="mb-[20px] capitalize text-[20px] font-bold">Bài hát</div>
          {songs.data?.data.map((item) => {
            return <SongItemSmall key={item.id} song={item} listSongs={songs.data?.data} />;
          })}
        </div>
      ) : (
        <Empty
          className="flex flex-col items-center justify-center"
          description={<p className="text-second-text text-[16px] font-semibold">Không có kết quả tìm kiếm phù hợp</p>}
          image={emptyImg}
        />
      )}
    </>
  );
}

export default SearchSongs;
