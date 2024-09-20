import { ConfigProvider, Tabs } from 'antd';
import HeaderProfile from '../../components/headerProfile';
import { useGetDetailUser } from '../../hook';
import { useUserStore } from '../../store';
import Infomation from './Infomation';
import ChangePassword from './changePassword';
import { useState } from 'react';

function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const detailUser = useGetDetailUser(user.id, user.accessToken);
  const [key, setKey] = useState(0);
  const items = [
    {
      key: '1',
      label: <p className="font-semibold select-none">Thông tin cá nhân</p>,
      children: <Infomation user={detailUser.data?.data} accessToken={user.accessToken} />,
    },
    {
      key: '2',
      label: <p className="font-semibold select-none">Đổi mật khẩu</p>,
      children: <ChangePassword tab={key} />,
    },
  ];

  return (
    <>
      <div className="h-[230px] mb-[30px]">
        <HeaderProfile
          name={detailUser.data?.data.fullName}
          image={detailUser.data?.data.image}
          vip={detailUser.data?.data.vip}
        />
      </div>
      <div>
        <ConfigProvider
          theme={{
            token: {
              colorBorderSecondary: 'hsla(0,0%,100%,0.1)',
              colorText: '#dadada',
            },
            components: {
              Tabs: {
                itemSelectedColor: '#9b4de0',
                inkBarColor: '#9b4de0',
                itemHoverColor: '#9b4de0',
                itemActiveColor: '#9b4de0',
                horizontalItemGutter: 40,
              },
            },
          }}
        >
          <Tabs onChange={(key) => setKey(key)} defaultActiveKey="1" items={items} className="text-white" />
        </ConfigProvider>
      </div>
    </>
  );
}
export default ProfilePage;
