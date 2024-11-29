import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { RxDashboard } from 'react-icons/rx';
import { LuListMusic } from 'react-icons/lu';
import { BsJournalAlbum } from 'react-icons/bs';
import { RiUserStarLine } from 'react-icons/ri';
import { Button, Layout, Menu, theme, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useUserStore } from '../store';
import { useGetDeatailSinger, useGetDetailUser } from '../hook';
import { IoLogOutOutline } from 'react-icons/io5';
import avatar from '../Image/avatar.png';
const { Header, Sider, Content } = Layout;
const SingerLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const detailSinger = useGetDeatailSinger(user.id, user.accessToken);
  const detailUser = useGetDetailUser(user.id, user.accessToken);
  const [collapsed, setCollapsed] = useState(false);
  let image = avatar;
  if (detailSinger.data?.data.image) image = `${import.meta.env.VITE_API_FILE_URL}/${detailSinger.data?.data.image}`;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleClick = (e) => {
    navigate(`${e.key}`);
  };
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
    window.location.reload();
  };
  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} width={256}>
        <div className="h-[64px] flex items-center justify-center bg-[#0c2c4b]">
          {collapsed ? (
            <span className="text-[16px]">
              <RxDashboard />
            </span>
          ) : (
            <h3 className="uppercase text-[16px] font-semibold">Quản trị hệ thống</h3>
          )}
        </div>
        <Menu
          className="text-[15px] select-none"
          onClick={handleClick}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={[
            {
              key: '/dashboard/singer/detail',
              icon: <RiUserStarLine />,
              label: 'Thông tin cá nhân',
            },
            {
              key: '/dashboard/singer/song',
              icon: <LuListMusic />,
              label: 'Quản lý bài hát',
            },
            {
              key: '/dashboard/singer/album',
              icon: <BsJournalAlbum />,
              label: 'Quản lý album',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div className="flex items-center mr-[16px]">
            <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
              <img className="h-full w-full object-cover" src={image} alt="" />
            </div>
            <p className="ml-[6px] font-semibold text-[#333] text-[16px]">{detailSinger.data?.data.name}</p>
            <Tooltip title={'Đăng xuất'} placement="bottomRight">
              <button
                onClick={handleLogout}
                className="text-[22px] cursor-pointer ml-[20px] rounded-full p-[16px] hover:bg-[#e7e3e3]"
              >
                <IoLogOutOutline />
              </button>
            </Tooltip>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
            // padding: 24,
            // background: colorBgContainer,
            // borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
      <ToastContainer position="top-right" containerId={3} theme="light" autoClose={3000} draggable />
    </Layout>
  );
};
export default SingerLayout;
