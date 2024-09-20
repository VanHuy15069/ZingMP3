import { useEffect, useState } from 'react';
import { useGetAllCategory, useGetAllNation, useGetAllTopic } from '../../hook';
import { Link } from 'react-router-dom';
import Card from '../../components/cart';
import newSong from '../../Image/newSong.jpg';
import TopicItem from '../../components/topicItem';
import ListSongs from '../../components/listSongs/listSongs';

function HubPage() {
  const [randomImage, setRanDomImage] = useState({});
  const [topTopic, setTopTopic] = useState({});
  const [topCategory, setTopCategory] = useState({});
  const [topNation, setTopNation] = useState({});
  const allTopics = useGetAllTopic(null, null, false);
  const allCatgory = useGetAllCategory(null, null, false);
  const allNation = useGetAllNation(null, null, false);

  useEffect(() => {
    if (allTopics.isSuccess) {
      const top = allTopics.data.data.rows.reduce((max, current) => {
        return current.songInfo.length > max.songInfo.length ? current : max;
      });
      const random = Math.floor(Math.random() * allTopics.data?.data.count);
      setRanDomImage(allTopics.data?.data.rows[random]);
      setTopTopic(top);
    }
  }, [allTopics.isSuccess]);

  useEffect(() => {
    if (allCatgory.isSuccess) {
      const top = allCatgory.data.data.rows.reduce((max, current) => {
        return current.songInfo.length > max.songInfo.length ? current : max;
      });
      setTopCategory(top);
    }
  }, [allCatgory.isSuccess]);

  useEffect(() => {
    if (allNation.isSuccess) {
      const top = allNation.data.data.rows.reduce((max, current) => {
        return current.songInfo.length > max.songInfo.length ? current : max;
      });
      setTopNation(top);
    }
  }, [allNation.isSuccess]);

  return (
    <div className="pt-[20px]">
      <div className="pt-[29.1%] relative rounded-[4px] overflow-hidden">
        {allTopics.isSuccess && randomImage?.image && (
          <Link to={`/topic/${randomImage?.id}`}>
            <img
              className="absolute top-0 h-full w-full object-cover"
              src={`${import.meta.env.VITE_API_FILE_URL}/${randomImage?.image}`}
            />
          </Link>
        )}
      </div>
      <div className="mt-[48px]">
        <div className="mb-[20px] capitalize text-[20px] font-bold">Nổi bật</div>
        <div className="flex flex-wrap -mx-[14px]">
          <div className="px-[14px] w-1/4">
            <Card image={newSong} link={'/new-songs'} content={'BXH Nhạc mới'} />
          </div>
          {allTopics.isSuccess && (
            <div className="px-[14px] w-1/4">
              <Card
                image={`${import.meta.env.VITE_API_FILE_URL}/${topTopic?.image}`}
                link={`/topic/${topTopic.id}`}
                //  content={topTopic.name}
              />
            </div>
          )}
          {allCatgory.isSuccess && (
            <div className="px-[14px] w-1/4">
              <Card
                image={`${import.meta.env.VITE_API_FILE_URL}/${topCategory?.image}`}
                link={`/category/${topCategory.id}`}
                // content={topCategory.name}
              />
            </div>
          )}
          {allNation.isSuccess && (
            <div className="px-[14px] w-1/4">
              <Card
                image={`${import.meta.env.VITE_API_FILE_URL}/${topNation?.image}`}
                link={`/nation/${topNation.id}`}
                content={topNation.name}
              />
            </div>
          )}
        </div>
      </div>
      <div className="mt-[48px]">
        <div className="mb-[20px] capitalize text-[20px] font-bold">Quốc gia</div>
        <div className="flex flex-wrap -mx-[14px]">
          {allNation.data?.data.rows.map((item) => {
            return (
              <div key={item.id} className="px-[14px] w-1/4">
                <Card
                  image={`${import.meta.env.VITE_API_FILE_URL}/${item?.image}`}
                  link={`/nation/${item.id}`}
                  content={item.name}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-[48px]">
        <div className="mb-[20px] capitalize text-[20px] font-bold">Tâm trạng và hoạt động</div>
        <div className="flex flex-wrap -m-[14px]">
          {allTopics.data?.data.rows.map((item) => {
            return (
              <div key={item.id} className="w-1/4 p-[14px]">
                <TopicItem topic={item} />
              </div>
            );
          })}
        </div>
      </div>
      {allCatgory.data?.data.rows.map((item) => {
        return (
          <div key={item.id} className="mt-[48px]">
            {item.songInfo.length > 0 && (
              <ListSongs link={`/category/${item.id}`} navigate title={item.name} songs={item.songInfo} />
            )}
          </div>
        );
      })}
    </div>
  );
}
export default HubPage;
