import { faBackwardStep, faForwardStep, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { useAudioStore, useUserStore } from '../../store/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './audio.module.scss';
import { Context } from '../../provider/provider';
import { useCheckFavorite } from '../../hook';
import { Drawer, Tooltip } from 'antd';
import './drawer.css';
import HeartIcon from '../heartIcon/heartIcon';
import { RxShuffle } from 'react-icons/rx';
import { FiRepeat } from 'react-icons/fi';
import SongItemSmall from '../songItemSmall';
import { PiPlayCircleThin } from 'react-icons/pi';
import { PiPauseCircleThin } from 'react-icons/pi';
import { PiPlaylist } from 'react-icons/pi';
import DownLoadIcon from '../downloadIcon';
import { useCountViews } from '../../mutationHook/song';
const cx = classNames.bind(styles);
function Audio() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const countViews = useCountViews();
  const { audio, updateSongId, updateSongPlay, updateSongAlbum } = useAudioStore();
  const [isReload, setIsReload] = useContext(Context);
  const audioRef = useRef();
  const inputRef = useRef();
  const volumRef = useRef();
  const list = JSON.parse(localStorage.getItem('listMusic'));
  const [listSongs, setListSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState({});
  const [isRandom, setIsRandom] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isVolum, setIsVolum] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(0);
  const [isASong, setIsASong] = useState(false);
  const [isShowDrawer, setIsShowDrawer] = useState(false);
  const [isViewed, setIsViewed] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleChangeList = (list, song) => {
    const newList = [...list];
    const index = newList.indexOf(song);
    const afterList = newList.slice(index);
    newList.splice(index, newList.length - index);
    const listMusic = afterList.concat(newList);
    localStorage.setItem('listMusic', JSON.stringify(listMusic));
  };
  const checkFavorite = useCheckFavorite(user?.id, currentSong?.id);

  useEffect(() => {
    if (list) {
      if (list.length === 1) setIsASong(true);
      else setIsASong(false);
      setCurrentSong(list[0]);
      setListSongs(list);
    } else {
      setCurrentSong({});
      setListSongs([]);
      updateSongId(null);
      updateSongAlbum(null);
    }
  }, [isReload, list[0]?.id]);

  const handleLoad = (e) => {
    const target = e.target;
    const audioDuration = target.duration;
    if (!isNaN(audioDuration)) {
      setMinute(Math.floor(audioDuration / 60));
      setSecond(Math.round(audioDuration % 60));
      setCurrentTime(target.currentTime);
    }
    //audioRef.current.autoplay = true;
    if (audio.isPlay) audioRef.current.play();
    else audioRef.current.pause();
  };
  const handleInputSong = useCallback(() => {
    audioRef.current.currentTime = (inputRef.current.value * audioRef.current.duration) / 100;
    if (!audio.isPlay) audioRef.current.pause();
  }, [audio.isPlay]);
  const handleUpdate = () => {
    if (audioRef.current.duration) {
      const progressPercent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      inputRef.current.value = progressPercent;
      setCurrentTime(audioRef.current.currentTime);
      if (isLoop) {
        if (audioRef.current.currentTime >= audioRef.current.duration - 0.5) {
          setIsViewed(false);
        }
      }
    }
  };
  const handlePlay = () => {
    updateSongPlay(true);
    audioRef.current.play();
  };
  const handlePause = () => {
    updateSongPlay(false);
    audioRef.current.pause();
  };
  const handleNextSong = () => {
    setIsReload(!isReload);
    if (!isASong) {
      updateSongPlay(true);
      const songIndex = listSongs.indexOf(currentSong);
      if (!isRandom) {
        if (songIndex === listSongs.length - 1) {
          setCurrentSong(listSongs[0]);
        } else {
          setCurrentSong(listSongs[songIndex + 1]);
          handleChangeList(listSongs, listSongs[songIndex + 1]);
        }
      } else {
        let randomIndex = 0;
        do {
          randomIndex = Math.floor(Math.random() * listSongs.length);
        } while (randomIndex === songIndex);
        setCurrentSong(listSongs[randomIndex]);
        handleChangeList(listSongs, listSongs[randomIndex]);
      }
    }
  };
  const handleMute = () => {
    setIsVolum(false);
    volumRef.current.value = 0;
    audioRef.current.volume = 0;
  };
  const handleOnVolum = () => {
    setIsVolum(true);
    volumRef.current.value = 1;
    audioRef.current.volume = 1;
  };
  const handleVolum = () => {
    const volumValue = volumRef.current.value;
    volumRef.current.value = volumValue;
    if (volumValue > 0) setIsVolum(true);
    else setIsVolum(false);
    audioRef.current.volume = volumRef.current.value;
  };
  useEffect(() => {
    if (currentSong?.id) {
      updateSongId(currentSong?.id);
      inputRef.current.value = 0;
      setIsViewed(false);
    }
  }, [currentSong]);
  const handlePrevSong = () => {
    if (!isASong) {
      updateSongPlay(true);
      const songIndex = listSongs.indexOf(currentSong);
      if (listSongs.length === 1) {
        setCurrentSong(listSongs[listSongs.length - 1]);
        handleChangeList(listSongs, listSongs[listSongs.length - 1]);
      } else {
        setCurrentSong(listSongs[songIndex - 1]);
        handleChangeList(listSongs, listSongs[songIndex - 1]);
      }
    }
    setIsReload(!isReload);
  };
  const handleEndSong = () => {
    if (!isLoop) {
      if (!isASong) handleNextSong();
      else {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        audioRef.current.play();
        setIsViewed(false);
      }
    }
  };
  useEffect(() => {
    if (audioRef.current) {
      if (audio.isPlay) {
        if (currentSong.id === audio.songId) audioRef.current.play();
        // if (audioRef.current.autoplay === false) {
        //   audioRef.current.autoplay = true;
        // }
        // if (!audioRef.current.paused) {

        // }
        // audioRef.current.play();
      } else {
        // audioRef.current.autoplay = false;
        audioRef.current.pause();
      }
    }
  }, [audio.songId, audio.isPlay, isReload]);

  useEffect(() => {
    if (audio.isPlay && !isViewed) {
      const countViewSong = setTimeout(() => {
        countViews.mutate({ id: currentSong.id });
      }, 40000);
      setTimeoutId(countViewSong);
    } else {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    return () => clearTimeout(timeoutId);
  }, [audio.songId, audio.isPlay, isViewed]);

  useEffect(() => {
    if (countViews.isSuccess) {
      setIsViewed(true);
    }
  }, [countViews.isSuccess]);
  return (
    <div className="h-full">
      <Drawer
        style={{ backgroundColor: '#120822', color: 'white' }}
        rootClassName="my-drawer"
        closeIcon={null}
        width={330}
        mask={false}
        zIndex={35}
        maskClosable={false}
        title="Danh sách phát"
        onClose={() => setIsShowDrawer(false)}
        open={isShowDrawer}
      >
        {list.map((item, index) => {
          return (
            <div
              key={index}
              className={index === 0 ? 'fixed w-full z-10 bg-[#120822]' : index === 1 ? 'mt-[100px]' : ''}
            >
              <SongItemSmall hideAlbum song={item} listSongs={list} isPlayList />
              {index === 0 && <h3 className="font-bold text-[14px] pt-[15px] pb-[8px]">Tiếp theo</h3>}
            </div>
          );
        })}
      </Drawer>
      {currentSong?.link && (
        <audio
          ref={audioRef}
          src={`${import.meta.env.VITE_API_FILE_URL}/${currentSong.link}`}
          loop={isLoop}
          onLoadedMetadata={handleLoad}
          onTimeUpdate={handleUpdate}
          onEnded={handleEndSong}
        />
      )}
      <div className="h-full font-light text-[14px] flex items-center justify-between">
        <div className="w-[30vw] flex items-center">
          <div
            onClick={() => navigate(`/song/${currentSong.id}`)}
            className="w-[64px] h-[64px] rounded-[4px] overflow-hidden cursor-pointer mr-[10px]"
          >
            {currentSong?.image && (
              <img
                className="h-full w-full object-cover"
                src={`${import.meta.env.VITE_API_FILE_URL}/${currentSong.image}`}
                alt=""
              />
            )}
          </div>
          <div>
            <div
              onClick={() => navigate(`/song/${currentSong.id}`)}
              className="font-normal text-[14px] overflow-visible text-clip leading-[1.36] cursor-pointer"
            >
              {currentSong?.name}
            </div>
            <div className="text-alpha text-[12px] mt-[1px] w-fit flex items-center cursor-pointer">
              {currentSong?.singerInfo?.map((item, index) => {
                let isNotLastElement = true;
                if (index === currentSong.singerInfo.length - 1) isNotLastElement = false;
                return (
                  <div key={index} className="flex">
                    <Link to={`/singer/${item.id}`}>
                      <p className="text-alpha hover:text-purple-hover hover:underline">{item.name}</p>
                    </Link>
                    {isNotLastElement && <p>,&ensp;</p>}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="ml-[10px]">
            <div className="flex items-center text-[14px]">
              <HeartIcon
                isFavorite={checkFavorite.data?.data}
                className={'mx-[2px] text-[16px]'}
                songId={currentSong?.id}
              />
              <DownLoadIcon />
            </div>
          </div>
        </div>
        <div className="w-[40vw] flex flex-col items-center">
          <div className="flex items-center justify-center h-[50px]">
            <Tooltip title={<p className="text-[12px]">{isRandom ? 'Tắt phát ngẫu nhiên' : 'Bật phát ngẫu nhiên'}</p>}>
              <span
                onClick={() => setIsRandom(!isRandom)}
                className={`p-[3px] flex items-center justify-center mx-[7px] text-[16px] h-[40px] w-[40px] cursor-pointer ${
                  isRandom && 'text-purple-hover'
                } hover:bg-border-primary rounded-full`}
              >
                <RxShuffle />
              </span>
            </Tooltip>
            <span
              onClick={handlePrevSong}
              className={`${
                isASong && 'text-alpha'
              } h-[40px] w-[40px] p-[3px] flex items-center justify-center mx-[7px] text-[16px] cursor-pointer hover:bg-border-primary rounded-full`}
            >
              <FontAwesomeIcon icon={faBackwardStep} />
            </span>
            {audio.isPlay ? (
              <span
                onClick={handlePause}
                className={`p-[3px] flex items-center justify-center mx-[7px] text-[50px] cursor-pointer hover:text-purple-hover rounded-full`}
              >
                <PiPauseCircleThin />
              </span>
            ) : (
              <span
                onClick={handlePlay}
                className={`p-[3px] flex items-center justify-center mx-[7px] text-[50px] cursor-pointer hover:text-purple-hover rounded-full`}
              >
                <PiPlayCircleThin />
              </span>
            )}
            <span
              onClick={handleNextSong}
              className={`${
                isASong && 'text-alpha'
              } h-[40px] w-[40px] p-[3px] flex items-center justify-center mx-[7px] text-[16px] cursor-pointer hover:bg-border-primary rounded-full`}
            >
              <FontAwesomeIcon icon={faForwardStep} />
            </span>
            <Tooltip title={<p className="text-[12px]">{isLoop ? 'Tắt phát lại' : 'Bật phát lại'}</p>}>
              <span
                onClick={() => setIsLoop(!isLoop)}
                className={`p-[3px] flex items-center justify-center mx-[7px] text-[16px] cursor-pointer ${
                  isLoop && 'text-purple-hover'
                } hover:bg-border-primary rounded-full`}
              >
                <FiRepeat />
              </span>
            </Tooltip>
          </div>
          <div className={cx('input')}>
            <p>
              {Math.floor(currentTime / 60) >= 10 ? Math.floor(currentTime / 60) : '0' + Math.floor(currentTime / 60)}:
              {Math.round(currentTime % 60) >= 10 ? Math.round(currentTime % 60) : '0' + Math.round(currentTime % 60)}
            </p>
            <input
              className={cx('range')}
              type="range"
              defaultValue={0}
              min={0}
              max={100}
              step={0.1}
              onInput={handleInputSong}
              ref={inputRef}
            />
            <p>
              {minute >= 10 ? minute : '0' + minute}:{second >= 10 ? second : '0' + second}
            </p>
          </div>
        </div>
        <div className="w-[30vw] flex items-center justify-end">
          {isVolum ? (
            <span
              onClick={handleMute}
              className={`p-[3px] flex items-center justify-center text-[14px] h-[32px] w-[32px] cursor-pointer hover:bg-border-primary rounded-full`}
            >
              <FontAwesomeIcon icon={faVolumeHigh} />
            </span>
          ) : (
            <span
              onClick={handleOnVolum}
              className={`p-[3px] flex items-center justify-center text-[14px] h-[32px] w-[32px] cursor-pointer hover:bg-border-primary rounded-full`}
            >
              <FontAwesomeIcon icon={faVolumeXmark} />
            </span>
          )}
          <input
            className={cx('range', 'volum-range')}
            onInput={handleVolum}
            type="range"
            defaultValue={100}
            min={0}
            max={1}
            step={0.1}
            ref={volumRef}
          />
          <div className="w-[1px] h-[33px] bg-border-primary mx-[20px]"></div>
          <Tooltip title={<p className="text-[12px]">Danh sách phát</p>}>
            <span
              onClick={() => setIsShowDrawer(!isShowDrawer)}
              className={`p-[3px] flex items-center justify-center text-[18px] h-[30px] w-[30px] cursor-pointer ${
                isShowDrawer ? 'bg-purple-primary' : 'bg-border-primary '
              } rounded-[4px]`}
            >
              <PiPlaylist />
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default Audio;
