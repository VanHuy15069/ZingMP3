import { DatePicker, Flex, Spin } from 'antd';
import Chart from '../../components/chart';
import {
  useCountStatical,
  useGetAllSingers,
  useGetAllSongs,
  useGetAllUser,
  useGetTopSongs,
  useStaticalSongs,
} from '../../hook';
import { useUserStore } from '../../store';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import ChartCicle from '../../components/PieChart';
import { PiHeadphonesLight, PiHeart } from 'react-icons/pi';
import { Bounce, toast } from 'react-toastify';

function AdminPage() {
  const user = useUserStore((state) => state.user);
  const users = useGetAllUser(1, 0, user.accessToken);
  const singers = useGetAllSingers(1, 0, false, null);
  const songs = useGetAllSongs(1, 0, null, null, null, false, null, null);
  const [date, setDate] = useState(dayjs());
  const [lable, setLable] = useState('nations');
  const statical = useStaticalSongs(date?.month() + 1, 10, user.accessToken);
  const countStatical = useCountStatical(lable, user.accessToken);
  const topSongs = useGetTopSongs(5, user.accessToken);
  const onChange = (date) => {
    setDate(date);
  };
  useEffect(() => {
    if (
      users.isError ||
      songs.isError ||
      singers.isError ||
      topSongs.isError ||
      countStatical.isError ||
      statical.isError
    ) {
      toast.error(`505! Server Error!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [users.isError, songs.isError, singers.isError, topSongs.isError, countStatical.isError, statical.isError]);
  return (
    <>
      <div className="-mx-[14px] flex items-center">
        <div className="w-1/3 px-[14px] ">
          <div className="bg-green-500 text-white text-[22px] font-bold h-[100px] w-full flex items-center justify-center rounded-[6px]">
            {users.data?.data.count} nguời dùng
          </div>
        </div>
        <div className="w-1/3 px-[14px] ">
          <div className="bg-blue-500 text-white text-[22px] font-bold h-[100px] w-full flex items-center justify-center rounded-[6px]">
            {singers.data?.count} nghệ sĩ
          </div>
        </div>
        <div className="w-1/3 px-[14px] ">
          <div className="bg-red-500 text-white text-[22px] font-bold h-[100px] w-full flex items-center justify-center rounded-[6px]">
            {songs.data?.count} Bài hát
          </div>
        </div>
      </div>
      <div className="flex gap-8 my-4 items-center">
        <h2 className="text-[18px] font-semibold text-[#333]">Thống kê theo tháng</h2>
        <DatePicker
          allowClear={false}
          defaultValue={date}
          format={'MM-YYYY'}
          size="large"
          onChange={onChange}
          picker="month"
          placeholder="MM-YYYY"
          minDate={dayjs().startOf('year')}
          maxDate={dayjs().endOf('month')}
        />
      </div>
      <Chart data={statical.data?.data} />
      <div className="flex mt-[42px]">
        <div className="w-2/5 flex flex-col">
          <div className="flex justify-center gap-x-20 text-[#333] font-semibold text-[16px]">
            <h3
              onClick={() => setLable('nations')}
              className={`cursor-pointer ${lable === 'nations' && 'text-purple-600'} hover:text-purple-600`}
            >
              Quốc gia
            </h3>
            <h3
              onClick={() => setLable('topics')}
              className={`cursor-pointer ${lable === 'topics' && 'text-purple-600'} hover:text-purple-600`}
            >
              Chủ đề
            </h3>
            <h3
              onClick={() => setLable('categories')}
              className={`cursor-pointer ${lable === 'categories' && 'text-purple-600'} hover:text-purple-600`}
            >
              Thể loại
            </h3>
          </div>
          {countStatical.isLoading && (
            <Flex className="flex-1" align="center" justify="center">
              <Spin size="large" />
            </Flex>
          )}
          {countStatical.data?.data && <ChartCicle data={countStatical.data?.data} />}
        </div>
        <div className="w-3/5">
          <h3 className="font-semibold text-[16px]">Bài hát nổi bật</h3>
          {topSongs.data?.data?.map((song, index) => {
            return (
              <div
                key={index}
                className={'flex p-[10px] items-center justify-between border-b-border-primary text-[#333]'}
              >
                <div className={'flex items-center'}>
                  <img
                    className={'h-[50px] w-[50px] object-cover rounded-[4px]'}
                    src={`${import.meta.env.VITE_API_FILE_URL}/${song.image}`}
                    alt=""
                  />
                  <div className={'text-[12px] flex flex-col justify-between ml-[10px]'}>
                    <p className={'text-[14px]'}>{song.songName}</p>
                    <div className="flex items-center">
                      {song.singerInfo?.map((item, index) => {
                        let isNotLastElement = true;
                        if (index === song.singerInfo.length - 1) isNotLastElement = false;
                        return (
                          <div key={index} className="flex text-[12px]">
                            <p>{item.name}</p>
                            {isNotLastElement && (
                              <p className="tracking-normal ml-[1px]" style={{ wordSpacing: '0.1px' }}>
                                ,&ensp;
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className={'flex text-[14px] justify-between w-[120px]'}>
                  <span className={'flex items-center ml-0'}>
                    <PiHeadphonesLight />
                    <p className="ml-[6px] text-[12px]">{song.views}</p>
                  </span>
                  <span className={'flex items-center mx-[12px]'}>
                    <PiHeart />
                    <p className="ml-[6px] text-[12px]">{song.favorite}</p>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
export default AdminPage;
