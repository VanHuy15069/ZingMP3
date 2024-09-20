import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { Autoplay, EffectCreative, Navigation } from 'swiper/modules';
import './slider.css';
import {
  useGetAlbumsHot,
  useGetAllSongs,
  useGetSingerFollow,
  useGetSlider,
  useGetSongByTopic,
  useGetSongsByNation,
  useGetTopNewSongs,
} from '../../hook';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/button/button';
import { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import ListSongs from '../../components/listSongs/listSongs';
import SongItem from '../../components/songItem/songItem';
import 'react-toastify/dist/ReactToastify.css';
import NewSongItem from '../../components/newSongItem';
import 'swiper/css/navigation';
import AlbumItem from '../../components/albumItem';
import { useAudioStore, useUserStore } from '../../store';
import SongItemLarge from '../../components/songItemLargre/songItemLargre';
import { handleAddSongs } from '../../golobalFn';

function HomePage() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState({
    all: true,
    vn: false,
    qt: false,
  });
  const user = useUserStore((state) => state.user);
  const { updateSongId, updateSongAlbum } = useAudioStore();
  const sliders = useGetSlider(9, 0, false, 1);
  const newSongs = useGetSongsByNation(null, 12);
  const newSongsVN = useGetSongsByNation('Việt Nam', 12);
  const newSongsQT = useGetSongsByNation('Âu Mỹ', 12);
  const topSongs = useGetAllSongs(20, 0, null, 'views', 'DESC');
  const chillTopic = useGetSongByTopic('Chill/Thư giãn', 20, 'views', 'DESC');
  const sadTopic = useGetSongByTopic('Giai điệu buồn', 20, 'views', 'DESC');
  const [songs, setSongs] = useState(newSongs);
  const albumsHot = useGetAlbumsHot(5);
  const topNewSongs = useGetTopNewSongs(8);
  const singerFollow = useGetSingerFollow(user?.id, user?.accessToken);

  useEffect(() => {
    setSongs(newSongs);
  }, [newSongs.isSuccess]);

  return (
    <div className="pt-[32px]">
      <Swiper
        slidesPerView={2}
        autoplay={true}
        speed={700}
        rewind={false}
        grabCursor={true}
        effect={'creative'}
        creativeEffect={{
          prev: {
            translate: [584, 0, 0],
          },
          next: {
            translate: ['100%', 0, 0],
          },
        }}
        modules={[EffectCreative, Autoplay]}
        className="mySwiper"
      >
        {sliders.data?.data.map((slider) => {
          return (
            <SwiperSlide key={slider.id}>
              <Link to={slider.link} className="h-full w-full rounded-[10px] overflow-hidden px-[15px]">
                <img
                  className="h-full w-full object-cover block rounded-[10px] "
                  src={`${import.meta.env.VITE_API_FILE_URL}/${slider.image}`}
                  alt="slider"
                />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="mt-[48px]">
        <ListSongs navigate={false} title={'Có thể bạn muốn nghe'} songs={topSongs.data?.data} />
      </div>
      <div className="mt-[48px]">
        <h3 className="text-[20px] font-bold mb-[20px]">Mới phát hành</h3>
        <div className="flex justify-between items-center mb-[16px]">
          <div className="flex items-center gap-[15px]">
            <Button
              onClick={() => {
                setIsActive({ all: true, vn: false, qt: false });
                setSongs(newSongs);
              }}
              small
              className={`border ${
                isActive.all ? 'bg-purple-primary border-purple-primary' : 'bg-transparent border-border-primary'
              }  text-[12px]`}
            >
              TẤT CẢ
            </Button>
            <Button
              onClick={() => {
                setIsActive({ all: false, vn: true, qt: false });
                setSongs(newSongsVN);
              }}
              small
              className={`border ${
                isActive.vn ? 'bg-purple-primary border-purple-primary' : 'bg-transparent border-border-primary'
              }  text-[12px]`}
            >
              VIỆT NAM
            </Button>
            <Button
              onClick={() => {
                setIsActive({ all: false, vn: false, qt: true });
                setSongs(newSongsQT);
              }}
              small
              className={`border ${
                isActive.qt ? 'bg-purple-primary border-purple-primary' : 'bg-transparent border-border-primary'
              }  text-[12px]`}
            >
              QUỐC TẾ
            </Button>
          </div>
          <Link
            to={'/new-release'}
            className="flex items-center text-[12px] text-alpha hover:text-[#c273ed] cursor-pointer"
          >
            <p>TẤT CẢ</p>
            <span className="text-[16px] ml-[6px]">
              <RightOutlined />
            </span>
          </Link>
        </div>
        <div className="flex items-center flex-wrap -mx-[14px]">
          {songs.data?.data?.map((item) => (
            <div key={item.id} className="w-1/3 px-[14px]">
              <SongItem song={item} listSongs={songs.data?.data} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-[48px]">
        <ListSongs title={'Chill'} songs={chillTopic.data?.data} link={`/topic/${chillTopic.data?.data[0].topicId}`} />
      </div>
      <div className="mt-[48px]">
        <ListSongs
          title={'Giai điệu buồn'}
          songs={sadTopic.data?.data}
          link={`/topic/${sadTopic.data?.data[0].topicId}`}
        />
      </div>
      <div className="mt-[48px]">
        <div className="flex justify-between items-center">
          <h3 className="mb-[20px] text-[20px] font-bold">BXH Nhạc Mới</h3>
          <Link
            to={'new-songs'}
            className="flex items-center text-[12px] text-alpha hover:text-[#c273ed] cursor-pointer"
          >
            <p>TẤT CẢ</p>
            <span className="text-[16px] ml-[6px]">
              <RightOutlined />
            </span>
          </Link>
        </div>
        <Swiper
          slidesPerView={3}
          spaceBetween={28}
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          speed={200}
          rewind={true}
          navigation={true}
          slidesPerGroup={3}
          grabCursor={true}
          modules={[Autoplay, Navigation]}
          className="swiper2"
        >
          {topNewSongs.data?.data.map((song, index) => {
            return (
              <SwiperSlide key={song.id}>
                <NewSongItem song={song} index={index + 1} listSongs={topNewSongs.data?.data} />
              </SwiperSlide>
            );
          })}
          <SwiperSlide>
            <div
              onClick={() => navigate('/new-songs')}
              className="bg-border-primary flex items-center justify-center text-purple-primary w-full h-[150px] rounded-[4px] font-bold text-[14px] cursor-pointer"
            >
              <p>XEM TẤT CẢ</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      {user.accessToken && (
        <div className="mt-[48px]">
          <div className="flex items-center mb-[20px]">
            <div
              onClick={() => navigate(`/singer/${singerFollow.data?.data.id}`)}
              className="h-[50px] w-[50px] rounded-[4px] overflow-hidden mr-[10px] cursor-pointer"
            >
              {singerFollow.data?.data.image && (
                <img
                  className="object-cover h-full w-full transition-transform duration-500 ease-out hover:scale-[1.1]"
                  src={`${import.meta.env.VITE_API_FILE_URL}/${singerFollow.data?.data.image}`}
                />
              )}
            </div>
            <div className="flex flex-col justify-center gap-[3px]">
              <p className="uppercase text-[14px] text-second-text">DÀNH CHO FAN</p>
              <p
                onClick={() => navigate(`/singer/${singerFollow.data?.data.id}`)}
                className="capitalize cursor-pointer text-[18px] font-bold hover:text-purple-hover"
              >
                {singerFollow.data?.data.name}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center -mx-[14px]">
            {singerFollow.data?.song.map((item) => {
              return (
                <div key={item.id} className="px-[14px] w-1/5">
                  <SongItemLarge
                    song={item}
                    onClick={() => handleAddSongs(item, singerFollow.data?.song, user, updateSongId, updateSongAlbum)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="mt-[48px]">
        <div className="flex items-center justify-between mb-[20px] text-[20px]">
          <h3 className="capitalize text-[20px] font-bold">Album Hot</h3>
        </div>
        <div className="flex items-center flex-wrap -mx-[14px]">
          {albumsHot.data?.data?.map((item, index) => {
            return (
              <div key={index} className="w-[20%] px-[14px] cursor-pointer block">
                <AlbumItem album={item} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
