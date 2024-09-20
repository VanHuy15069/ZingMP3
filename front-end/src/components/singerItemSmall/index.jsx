import { Link, useNavigate } from 'react-router-dom';
import { RxShuffle } from 'react-icons/rx';
import avatar from '../../Image/avatar.png';
import { useGetTopSongBySinger } from '../../hook';
import { useAudioStore, useUserStore } from '../../store';
import { handleAddSongs } from '../../golobalFn';
function SingerItemSmall({ singer }) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { updateSongId, updateSongAlbum, updateSongPlay } = useAudioStore();
  const songs = useGetTopSongBySinger(singer.id, 20, 0, 'createdAt', 'DESC');
  let avatarImg = avatar;
  if (singer.image) avatarImg = `${import.meta.env.VITE_API_FILE_URL}/${singer.image}`;
  const handlePlaySong = (e) => {
    const list = songs.data?.data.sort(() => Math.random() - 0.5);
    handleAddSongs(list[0], list, user, updateSongId, updateSongAlbum);
    updateSongPlay(true);
    e.stopPropagation();
  };
  return (
    <div className="w-full">
      <div className="relative">
        <div
          onClick={() => navigate(`/singer/${singer.id}`)}
          className="pt-[100%] rounded-full w-full relative cursor-pointer overflow-hidden"
        >
          <img
            className="h-full w-full absolute top-0 left-0 right-0 bottom-0 object-cover transform ease-in-out duration-500 hover:scale-[1.1]"
            src={avatarImg}
            alt=""
          />
        </div>
        <div
          onClick={handlePlaySong}
          className="absolute h-[38px] w-[38px] bg-white rounded-full flex justify-center items-center top-[85.3%] left-[85.3%] text-black -translate-x-[60%] -translate-y-[60%] cursor-pointer hover:bg-[#e5e5e5]"
        >
          <RxShuffle />
        </div>
      </div>
      <Link to={`/singer/${singer.id}`}>
        <p className="mt-[15px] text-center whitespace-nowrap text-ellipsis overflow-hidden text-[14px] font-medium hover:text-purple-hover hover:underline">
          {singer.name}
        </p>
      </Link>
    </div>
  );
}
export default SingerItemSmall;
