import { RightOutlined } from '@ant-design/icons';
import SearchItem from '../../components/searchItem';
import { useGetAllAlbums, useGetAllSingers, useGetAllSongs } from '../../hook';
import SongItemSmall from '../../components/songItemSmall';
import ListFavoriteAlbum from '../libraryPage/listFavoriteAlbum';
import SingerItem from '../../components/singerItem';
import emptyImg from '../../Image/empty-dark.png';
import { Empty } from 'antd';

function SearchAll({ value, navigateSongs, navigateAlbum, navigateSinger }) {
  const topSongs = useGetAllSongs(20, 0, value, 'views', 'DESC');
  const newSongs = useGetAllSongs(20, 0, value, 'createdAt', 'DESC');
  const albums = useGetAllAlbums(5, 0, value, false, 'createdAt', 'DESC');
  const singers = useGetAllSingers(5, 0, false, value);

  return (
    <>
      {topSongs.data?.count > 0 ||
      newSongs.data?.count > 0 ||
      albums.data?.data.count > 0 ||
      singers.data?.count > 0 ? (
        <>
          {topSongs.data?.count > 0 && (
            <div className="mt-[12px]">
              <div className="mb-[20px] capitalize text-[20px] font-bold">Nổi bật</div>
              <div className="flex items-center -mx-[14px]">
                {topSongs.data?.data.slice(0, 3).map((item) => {
                  return (
                    <div key={item.id} className="w-1/3 px-[14px]">
                      <SearchItem song={item} listSongs={topSongs.data?.data} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {newSongs.data?.count > 0 && (
            <div className="mt-[30px]">
              <div className="flex items-center justify-between mb-[20px] text-[20px]">
                <h3 className="capitalize text-[20px] font-bold">Bài hát</h3>
                <div
                  onClick={navigateSongs}
                  className="uppercase flex items-center text-[12px] text-alpha cursor-pointer font-medium hover:text-purple-hover"
                >
                  <p>Tất cả</p>
                  <span className="text-[16px] ml-[6px]">
                    <RightOutlined />
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap -mx-[14px]">
                {newSongs.data?.data.slice(0, 6).map((item) => {
                  return (
                    <div key={item.id} className="w-1/2 px-[14px]">
                      <SongItemSmall hideAlbum song={item} listSongs={newSongs.data?.data} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {albums.data?.data.count > 0 && (
            <div className="mt-[30px]">
              <div className="flex items-center justify-between mb-[20px] text-[20px]">
                <h3 className="capitalize text-[20px] font-bold">Album</h3>
                <div
                  onClick={navigateAlbum}
                  className="uppercase flex items-center text-[12px] text-alpha cursor-pointer font-medium hover:text-purple-hover"
                >
                  <p>Tất cả</p>
                  <span className="text-[16px] ml-[6px]">
                    <RightOutlined />
                  </span>
                </div>
              </div>
              <ListFavoriteAlbum listAlbums={albums.data?.data.rows} />
            </div>
          )}
          {singers.data?.count > 0 && (
            <div className="mt-[30px]">
              <div className="flex items-center justify-between mb-[20px] text-[20px]">
                <h3 className="capitalize text-[20px] font-bold">Nghệ sĩ</h3>
                <div
                  onClick={navigateSinger}
                  className="uppercase flex items-center text-[12px] text-alpha cursor-pointer font-medium hover:text-purple-hover"
                >
                  <p>Tất cả</p>
                  <span className="text-[16px] ml-[6px]">
                    <RightOutlined />
                  </span>
                </div>
              </div>
              <div className="flex items-center flex-wrap -mx-[14px]">
                {singers.data?.data.map((item) => {
                  return (
                    <div key={item.id} className="px-[14px] w-1/5">
                      <SingerItem singerId={item.id} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
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
export default SearchAll;
