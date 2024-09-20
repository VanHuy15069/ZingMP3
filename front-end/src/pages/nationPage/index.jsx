import { useParams } from 'react-router-dom';
import { useGetNationById } from '../../hook';
import ListSongs from '../../components/listSongs/listSongs';
import SongItemSmall from '../../components/songItemSmall';
import AlbumItem from '../../components/albumItem';
import SingerItem from '../../components/singerItem';

function NationPage() {
  const nationId = useParams().id;
  const nation = useGetNationById(nationId, 20, 'createdAt', 'DESC');
  const topSongs = useGetNationById(nationId, 15, 'views', 'DESC');
  return (
    <>
      <div className="relative -mx-[59px] pt-[30%]">
        {nation.data?.data.image && (
          <img
            className="absolute top-0 h-full w-full object-cover"
            src={`${import.meta.env.VITE_API_FILE_URL}/${nation.data?.data.image}`}
            alt=""
          />
        )}
        <p className="absolute text-[64px] top-1/2 -translate-y-1/2 left-[8%] font-bold select-none">
          {nation.data?.data.name}
        </p>
      </div>
      <div className="mt-[48px]">
        <ListSongs title={'Mới nhất'} songs={nation.data?.data.songInfo.slice(0, 5)} navigate={false} />
      </div>
      <div className="mt-[48px]">
        <div className="mb-[20px] text-[20px]">
          <h3 className="capitalize text-[20px] font-bold">Hot Songs</h3>
        </div>
        <div className="flex items-center flex-wrap -mx-[14px]">
          {topSongs.data?.data.songInfo.map((item) => {
            return (
              <div key={item.id} className="w-1/3 px-[14px]">
                <SongItemSmall hideHeard hideAlbum song={item} listSongs={topSongs.data?.data.songInfo} />
              </div>
            );
          })}
        </div>
      </div>
      {nation.data?.album.length > 0 && (
        <div className="mt-[48px]">
          <div className="mb-[20px] text-[20px]">
            <h3 className="capitalize text-[20px] font-bold">Album</h3>
          </div>
          <div className="flex items-center flex-wrap -mx-[14px]">
            {topSongs.data?.album.map((item) => {
              return (
                <div key={item.id} className="w-1/5 px-[14px]">
                  <AlbumItem album={item} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="mt-[48px]">
        <div className="mb-[20px] text-[20px]">
          <h3 className="capitalize text-[20px] font-bold">Nghệ Sĩ</h3>
        </div>
        <div className="flex items-center flex-wrap -mx-[14px]">
          {topSongs.data?.singers.map((item) => {
            return (
              <div key={item.id} className="w-1/5 px-[14px]">
                <SingerItem singerId={item.id} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
export default NationPage;
