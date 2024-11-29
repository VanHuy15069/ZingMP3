import { useParams } from 'react-router-dom';
import { useGetDeatailSinger, useGetTopSongBySinger } from '../../hook';
import { MdOutlineSort, MdPlayCircle } from 'react-icons/md';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import pauseIcon from '../../Image/play.81e7696e.svg';
import { SlArrowDown } from 'react-icons/sl';
import { SlArrowUp } from 'react-icons/sl';
import { Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';
import SongItemSmall from '../../components/songItemSmall';
import { useAudioStore, useUserStore } from '../../store';
import { handleAddSongs } from '../../golobalFn';

function SingerSongPage() {
  const params = useParams();
  const boxRef = useRef();
  const user = useUserStore((state) => state.user);
  const [play, setPlay] = useState(false);
  const [currentList, setCurrentList] = useState(false);
  const { audio, updateSongId, updateSongPlay, updateSongAlbum } = useAudioStore();
  const singer = useGetDeatailSinger(params.id);
  const [open, setOpen] = useState(false);
  const [topSong, setTopSongs] = useState(true);
  const topSongs = useGetTopSongBySinger(params.id, null, null, `${topSong ? 'views' : 'createdAt'}`, 'DESC');
  const handleChangeSort = () => {
    setOpen(!open);
  };
  const handleSortTopSongs = () => {
    setTopSongs(true);
    setOpen(false);
  };
  const handleSortNewSongs = () => {
    setTopSongs(false);
    setOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const checkPlay = topSongs.data?.data.some((song) => song.id == audio.songId);
    if (checkPlay) setCurrentList(true);
    else setCurrentList(false);
    if (checkPlay && audio.isPlay) setPlay(true);
    else setPlay(false);
    console.log(123);
  });
  const handlePlaySong = () => {
    if (audio.isPlay) {
      updateSongPlay(false);
    } else {
      if (!currentList) {
        handleAddSongs(topSongs.data?.data[0], topSongs.data?.data, user, updateSongId, updateSongAlbum);
      }
      updateSongPlay(true);
    }
  };
  return (
    <div>
      <div className="py-4 mb-[10px] flex justify-between">
        <div className="flex items-center">
          <h3 className="font-bold text-[20px] mr-[10px]">{`${singer.data?.data.name} - Tất cả bài hát`}</h3>
          <div
            onClick={handlePlaySong}
            className='className="ml-[20px] h-[34px] w-[34px] rounded-full bg-purple-hover flex items-center justify-center hover:bg-purple-primary cursor-pointer'
          >
            {play ? (
              <span className="text-[18px]">
                <FontAwesomeIcon icon={faPause} />
              </span>
            ) : (
              <img height={30} width={30} src={pauseIcon} alt="" />
            )}
          </div>
        </div>
        <div ref={boxRef}>
          <Popover
            content={
              <div className="bg-alpha-primary text-white p-[5px] rounded-[8px] w-[140px]">
                <div
                  onClick={handleSortTopSongs}
                  className="p-[10px] rounded-[4px] text-[12px] cursor-pointer hover:bg-border-primary"
                >
                  Nổi bật
                </div>
                <div
                  onClick={handleSortNewSongs}
                  className="p-[10px] rounded-[4px] text-[12px] cursor-pointer hover:bg-border-primary"
                >
                  Mới nhất
                </div>
              </div>
            }
            placement="bottomLeft"
            open={open}
          >
            <div
              onClick={handleChangeSort}
              className="px-[16px] py-[7px] leading-none rounded-[999px] cursor-pointer bg-border-primary flex items-center"
            >
              <span className="text-[18px]">
                <MdOutlineSort />
              </span>
              <p className="mr-[20px] ml-[10px] text-[14px] select-none">{topSong ? 'Nổi bật' : 'Mới nhất'}</p>
              {open ? (
                <span className="text-[14px]">
                  <SlArrowUp />
                </span>
              ) : (
                <span className="text-[14px]">
                  <SlArrowDown />
                </span>
              )}
            </div>
          </Popover>
        </div>
      </div>
      <div>
        {topSongs.data?.data.map((song) => {
          return <SongItemSmall key={song.id} song={song} listSongs={topSongs.data?.data} />;
        })}
      </div>
    </div>
  );
}

export default SingerSongPage;
