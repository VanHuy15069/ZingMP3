import { RightOutlined } from '@ant-design/icons';
import SongItemLarge from '../songItemLargre/songItemLargre';
import { useAudioStore, useUserStore } from '../../store';
import { handleAddSongs } from '../../golobalFn';
import { Link } from 'react-router-dom';

function ListSongs({ navigate = true, title, songs, time = false, link }) {
  const user = useUserStore((state) => state.user);
  const { updateSongId, updateSongAlbum } = useAudioStore();
  return (
    <>
      <div className="flex items-center justify-between mb-[20px] text-[20px]">
        <h3 className="capitalize text-[20px] font-bold">{title}</h3>
        {navigate && (
          <Link to={link}>
            <div className="uppercase flex items-center text-[12px] text-alpha cursor-pointer font-medium hover:text-purple-hover">
              <p>Tất cả</p>
              <span className="text-[16px] ml-[6px]">
                <RightOutlined />
              </span>
            </div>
          </Link>
        )}
      </div>
      <div className="flex items-center flex-wrap -mx-[14px]">
        {songs?.slice(0, 5)?.map((item, index) => {
          return (
            <div key={index} className="w-[20%] px-[14px] cursor-pointer block">
              <SongItemLarge
                time={time}
                song={item}
                onClick={() => handleAddSongs(item, songs, user, updateSongId, updateSongAlbum)}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ListSongs;
