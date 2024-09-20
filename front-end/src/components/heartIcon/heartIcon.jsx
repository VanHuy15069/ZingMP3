import { Tooltip } from 'antd';
import { useFavoriteAlbum, useFavoriteSong } from '../../mutationHook/user';
import { useUserStore } from '../../store';
import { useEffect } from 'react';
import { Bounce, toast } from 'react-toastify';
import { PiHeartFill } from 'react-icons/pi';
import { PiHeart } from 'react-icons/pi';

function HeartIcon({ isFavorite, className, songId, isAlbum = false, overlay = false }) {
  const user = useUserStore((state) => state.user);
  const favoriteMutation = useFavoriteSong(user.id, songId);
  const favoriteAlbumMutation = useFavoriteAlbum(user.id, songId);
  useEffect(() => {
    if (favoriteMutation.isSuccess && favoriteMutation.data) {
      if (!isFavorite) {
        toast('Đã thêm bài hát vào thư viện!', {
          toastId: 1,
          draggable: true,
          hideProgressBar: true,
          transition: Bounce,
        });
      } else {
        toast('Đã xóa bài hát khỏi thư viện!', {
          toastId: 1,
          draggable: true,
          hideProgressBar: true,
          transition: Bounce,
        });
      }
    }
  }, [favoriteMutation.isSuccess]);

  useEffect(() => {
    if (favoriteAlbumMutation.isSuccess && favoriteAlbumMutation.data) {
      if (!isFavorite) {
        toast('Đã thêm album vào thư viện!', {
          toastId: 1,
          draggable: true,
          hideProgressBar: true,
          transition: Bounce,
        });
      } else {
        toast('Đã xóa album khỏi thư viện!', {
          toastId: 1,
          draggable: true,
          hideProgressBar: true,
          transition: Bounce,
        });
      }
    }
  }, [favoriteAlbumMutation.isSuccess]);

  const handleFavorite = (e) => {
    if (!isAlbum) favoriteMutation.mutate({ userId: user.id, songId: songId, accessToken: user.accessToken });
    else favoriteAlbumMutation.mutate({ userId: user.id, albumId: songId, accessToken: user.accessToken });
    e.stopPropagation();
  };
  return (
    <Tooltip title={<p className="text-[12px]">{isFavorite ? 'Xóa khỏi thư viện' : 'Thêm vào thư viện'}</p>}>
      <div
        onClick={handleFavorite}
        className={`cursor-pointer hover:bg-border-primary ${
          overlay && 'bg-border-primary'
        } p-[5px] rounded-full h-[32px] w-[32px] flex items-center justify-center ${className}`}
      >
        {isFavorite ? (
          <span className="text-purple-hover flex items-center justify-center">
            <PiHeartFill />
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <PiHeart />
          </span>
        )}
      </div>
    </Tooltip>
  );
}
export default HeartIcon;
