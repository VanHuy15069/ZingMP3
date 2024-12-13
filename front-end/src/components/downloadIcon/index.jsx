import { Tooltip } from 'antd';
import { PiDownload } from 'react-icons/pi';
import { useUserStore } from '../../store';
import { useCheckFavorite, useGetDetailUser } from '../../hook';
import { saveAs } from 'file-saver';
import { useFavoriteSong } from '../../mutationHook/user';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function DownLoadIcon({ overlay = false, song }) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const detailUser = useGetDetailUser(user?.id, user.accessToken);
  const favoriteMutation = useFavoriteSong(user?.id, song.id);
  const checkFavorite = useCheckFavorite(user?.id, song.id);
  const handleDownload = () => {
    const src = `${import.meta.env.VITE_API_FILE_URL}/${song.link}`;
    const fileName = song.name;
    if (song.vip) {
      if (user?.accessToken && detailUser.data?.data.vip) {
        saveAs(src, fileName);
        if (!checkFavorite.data?.data) {
          favoriteMutation.mutate({ userId: user.id, songId: song.id, accessToken: user.accessToken });
        }
      } else {
        Swal.fire({
          title: 'Cần tài khoản premium để tải bài hát này!',
          confirmButtonText: 'Nâng cấp tài khoản',
          customClass: {
            popup: 'bg-alpha-primary',
            title: 'text-white',
            confirmButton: 'rounded-[100px] bg-[#e5ac1a]',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/upgrade-account');
          }
        });
      }
    } else {
      saveAs(src, fileName);
      if (user?.accessToken && !checkFavorite.data?.data) {
        favoriteMutation.mutate({ userId: user.id, songId: song.id, accessToken: user.accessToken });
      }
    }
  };
  return (
    <Tooltip title={<p className="text-[12px]">Tải xuống</p>}>
      <div
        onClick={handleDownload}
        className={`cursor-pointer ${
          overlay && 'bg-border-primary'
        } hover:bg-border-primary p-[5px]  text-[16px] rounded-full h-[32px] w-[32px] flex items-center justify-center mx-[2px]`}
      >
        <span className="flex items-center justify-center">
          <PiDownload />
        </span>
      </div>
    </Tooltip>
  );
}
export default DownLoadIcon;
