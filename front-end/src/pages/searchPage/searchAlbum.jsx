import { useGetAllAlbums } from '../../hook';
import ListFavoriteAlbum from '../libraryPage/listFavoriteAlbum';
import emptyImg from '../../Image/empty-dark.png';
import { Empty } from 'antd';

function SearchAlbum({ searchValue }) {
  const albums = useGetAllAlbums(null, null, searchValue, false, 'createdAt', 'DESC');
  return (
    <>
      {albums.data?.data.count > 0 ? (
        <div className="mt-[12px]">
          <h3 className="mb-[20px] capitalize text-[20px] font-bold">Album</h3>
          <ListFavoriteAlbum listAlbums={albums.data?.data.rows} />
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

export default SearchAlbum;
