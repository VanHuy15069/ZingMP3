import { useParams } from 'react-router-dom';
import { useGetTopicById } from '../../hook';
import ListSongs from '../../components/listSongs/listSongs';
import SongItemSmall from '../../components/songItemSmall';
import AlbumItem from '../../components/albumItem';
import SingerItem from '../../components/singerItem';

function TopicPage() {
  const topicId = useParams().id;
  const topic = useGetTopicById(topicId, 20, 'createdAt', 'DESC');
  const topSongs = useGetTopicById(topicId, 15, 'views', 'DESC');
  return (
    <>
      <div className="relative -mx-[59px] pt-[30%]">
        {topic.data?.data.image && (
          <img
            className="absolute top-0 h-full w-full object-cover"
            src={`${import.meta.env.VITE_API_FILE_URL}/${topic.data?.data.image}`}
            alt=""
          />
        )}
      </div>
      <div className="mt-[48px]">
        <ListSongs title={'Mới nhất'} songs={topic.data?.data.songInfo.slice(0, 5)} navigate={false} />
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
export default TopicPage;
