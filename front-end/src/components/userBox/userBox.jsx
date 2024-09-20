import { Link, useNavigate } from 'react-router-dom';
import { useGetDetailUser } from '../../hook';
import avatar from '../../Image/avatar.png';
import Button from '../button/button';
import IconBasic from '../IconBasic/IconBasic';
import { UserOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { RiFolderMusicLine } from 'react-icons/ri';
function UserBox({ user }) {
  const navigate = useNavigate();
  const image = user.image ? `${import.meta.env.VITE_API_FILE_URL}/${user.image}` : avatar;
  const detailUser = useGetDetailUser(user.id, user.accessToken);
  const handleLogout = () => {
    const list = JSON.parse(localStorage.getItem('listMusic'));
    const songNotVips = list.filter((item) => item.vip === false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.setItem('listMusic', JSON.stringify(songNotVips));
    navigate('/');
    window.location.reload();
  };
  return (
    <div className="w-[300px] bg-[#34224f] p-[6px] rounded-[8px] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] z-10">
      <div className="p-[10px] mb-[10px]">
        <div className="flex items-center mb-[16px]">
          <div className="h-[64px] w-[64px] rounded-full overflow-hidden mr-[12px]">
            <img className="block h-full w-full object-cover" src={image} alt="avata" />
          </div>
          <div>
            <p className="mb-[6px] font-bold text-[16px]">{user.name}</p>
            <IconBasic large premium={detailUser.data?.data?.vip} />
          </div>
        </div>
        {!detailUser.data?.vip && (
          <Button
            bgColor={'bg-border-primary'}
            border="border-none"
            py={'py-[6px]'}
            className={'h-[32px] w-full text-[13px]'}
          >
            Nâng cấp tài khoản
          </Button>
        )}
      </div>
      <div className="h-[1px] bg-border-primary my-[10px] mx-auto" style={{ width: 'calc(100% - 24px)' }}></div>
      <div className="text-[16px] font-semibold pl-[16px] mb-[8px] leading-[19px]">Cá nhân</div>
      <Link to={`/account`}>
        <div className="rounded-[4px] py-[12px] px-[10px] h-[44px] flex items-center text-[14px] hover:bg-[#493961]">
          <span className="mr-[12px] text-[20px]">
            <UserOutlined />
          </span>
          <p>Thông tin cá nhân</p>
        </div>
      </Link>
      <Link to={`/library`}>
        <div className="rounded-[4px] py-[12px] px-[10px] h-[44px] flex items-center text-[14px] hover:bg-[#493961]">
          <span className="mr-[12px] text-[20px]">
            <RiFolderMusicLine />
          </span>
          <p>Thư viện của bạn</p>
        </div>
      </Link>
      <div className="h-[1px] bg-border-primary my-[10px] mx-auto" style={{ width: 'calc(100% - 24px)' }}></div>
      <div
        onClick={handleLogout}
        className="rounded-[4px] py-[12px] px-[10px] h-[44px] flex items-center text-[14px] hover:bg-[#493961]"
      >
        <span className="mr-[12px] text-[20px]">
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </span>
        <p>Đăng xuất</p>
      </div>
    </div>
  );
}
export default UserBox;
