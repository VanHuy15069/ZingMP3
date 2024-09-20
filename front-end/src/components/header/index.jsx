import { faDownload, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import avatar from '../../Image/avatar.png';
import { useUserStore } from '../../store';
import SettingBox from '../settingBox/settingBox';
import Button from '../button/button';
import UserBox from '../userBox/userBox';
import { HiXMark } from 'react-icons/hi2';
import { GoSearch } from 'react-icons/go';
import { RxArrowLeft, RxArrowRight } from 'react-icons/rx';
import Tippy from '@tippyjs/react/headless';
import { useDebounce } from '@uidotdev/usehooks';
import { useGetAllSingers, useGetAllSongs } from '../../hook';
import classNames from 'classnames/bind';
import styles from './header.module.scss';
import SongItem from '../songItem/songItem';
import SearchSingerItem from '../searchSingerItem';
const cx = classNames.bind(styles);

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const inputRef = useRef();
  const settingRef = useRef();
  const userRef = useRef();
  const backgroundRef = useRef();
  const [image, setImage] = useState();
  const [showSettingBox, setShowSettingBox] = useState(false);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [showUserBox, setShowUserBox] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showResult, setShowReult] = useState(false);
  const debounce = useDebounce(searchValue, 500);
  const songs = useGetAllSongs(5, 0, debounce, 'views', 'DESC');
  const singers = useGetAllSingers(5, 0, false, debounce);
  const handleChange = (e) => {
    const value = e.target.value;
    if (!value.startsWith(' ')) {
      setSearchValue(value);
    }
  };
  const handleClear = () => {
    setShowReult(false);
    setSearchValue('');
    inputRef.current.focus();
  };
  useEffect(() => {
    setShowReult(false);
  }, [location.pathname]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingRef.current && !settingRef.current.contains(event.target)) setShowSettingBox(false);
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowLoginBox(false);
        setShowUserBox(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (backgroundRef.current) {
        if (window.scrollY > 10) {
          backgroundRef.current.style.backgroundColor = 'rgba(23,15,35,0.7)';
        } else {
          backgroundRef.current.style.backgroundColor = 'transparent';
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    if (user?.image) setImage(`${import.meta.env.VITE_API_FILE_URL}/${user.image}`);
    else setImage(avatar);
  }, [user?.image]);
  const handleSearch = () => {
    if (searchValue) {
      const encodedSearchTerm = encodeURIComponent(searchValue);
      navigate(`/search/?q=${encodedSearchTerm}`);
      inputRef.current.blur();
      setShowReult(false);
    }
  };
  const handleEnter = (e) => {
    if (e.keyCode === 13) handleSearch();
  };
  return (
    <div className="flex justify-between items-center px-[59px] h-[70px] backdrop-blur-xl z-20" ref={backgroundRef}>
      <div className="flex items-center">
        <div className="flex items-center text-[20px]">
          <span className="text-[24px] mr-[10px] cursor-pointer" onClick={() => navigate(-1)}>
            <RxArrowLeft />
          </span>
          <span className="text-[24px] ml-[10px] cursor-pointer" onClick={() => navigate(+1)}>
            <RxArrowRight />
          </span>
        </div>
        <Tippy
          interactive
          visible={showResult && !!debounce}
          onClickOutside={() => setShowReult(false)}
          zIndex={10}
          render={(attrs) => (
            <div
              tabIndex="-1"
              {...attrs}
              className="w-[30vw] max-w-[440px] rounded-[12px] bg-alpha-primary overflow-hidden py-[13px] px-[10px]"
            >
              <div className={cx('box-result')}>
                {songs.data?.data.length > 0 && (
                  <p className="text-alpha text-[14px] font-semibold select-none">Bài hát</p>
                )}
                {songs.data?.data.map((item) => {
                  return <SongItem key={item.id} song={item} listSongs={songs.data?.data} isItemSearch />;
                })}
                {songs.data?.data.length > 0 && singers.data?.data.length > 0 && (
                  <p className="w-full border-b border-b-border-primary my-[10px]"></p>
                )}
                {singers.data?.data.length > 0 && (
                  <p className="text-alpha text-[14px] font-semibold select-none">Nghệ sĩ</p>
                )}
                {singers.data?.data.map((item) => {
                  return <SearchSingerItem key={item.id} singer={item} />;
                })}
                {songs.data?.data.length === 0 && singers.data?.data.length === 0 && (
                  <p className="text-alpha text-center py-[30px] text-[14px] font-semibold select-none">
                    Không tìm thấy kết quả
                  </p>
                )}
              </div>
            </div>
          )}
        >
          <div className="flex items-center w-[30vw] max-w-[440px] h-[40px] rounded-[20px] px-[12px] ml-[20px] bg-border-primary">
            <button onClick={handleSearch} className="text-[20px]">
              <GoSearch />
            </button>
            <input
              className="w-[95%] py-[2px] px-[8px] bg-transparent caret-white outline-none text-[14px]"
              type="text"
              placeholder="Tìm kiếm bài hát, nghệ sĩ,..."
              ref={inputRef}
              value={searchValue}
              onFocus={() => setShowReult(true)}
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
            {searchValue && (
              <span className="text-[18px] mr-[2px] cursor-pointer" onClick={handleClear}>
                <HiXMark />
              </span>
            )}
          </div>
        </Tippy>
      </div>
      <div className="flex items-center">
        <div className="py-[10px] px-[24px] flex items-center h-[40px] font-semibold rounded-[20px] text-[14px] text-[#c273ed] bg-border-primary cursor-pointer">
          <span className="mr-[4px]">
            <FontAwesomeIcon icon={faDownload} />
          </span>
          <p>Tải bản Windows</p>
        </div>
        <div
          onClick={() => {
            setShowSettingBox(!showSettingBox);
            setShowLoginBox(false);
          }}
          ref={settingRef}
          className="relative rounded-full h-[40px] w-[40px] bg-border-primary flex items-center justify-center mx-[10px] cursor-pointer"
        >
          <span className="flex justify-center items-center]">
            <FontAwesomeIcon icon={faGear} />
          </span>
          <div className="absolute top-[130%] -right-[1px]">{showSettingBox && <SettingBox />}</div>
        </div>
        <div
          onClick={() => {
            setShowLoginBox(!showLoginBox);
            setShowUserBox(!showUserBox);
            setShowSettingBox(false);
          }}
          ref={userRef}
          className="relative flex items-center justify-center rounded-full h-[40px] w-[40px] cursor-pointer"
        >
          <img className="h-full w-full rounded-full object-cover" src={image} alt="avatar" />
          {showUserBox && user.id && (
            <div className="absolute top-[130%] -right-[1px]">
              <UserBox user={user} />
            </div>
          )}
          {showLoginBox && !user.id && (
            <div className="text-center absolute top-[130%] -right-[1px] w-[300px] bg-[#34224f] p-[6px] rounded-[8px] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] z-[10]">
              <Button
                onClick={() => navigate('/login')}
                className={'py-[12px] px-[10px] w-[90%] text-center mx-[10px] mt-[10px] mb-[20px] border-none'}
                bgColor={'bg-[#9b4de0]'}
              >
                Đăng nhập
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
