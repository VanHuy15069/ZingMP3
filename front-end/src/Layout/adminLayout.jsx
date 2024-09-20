import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, PieChartOutlined, UserOutlined } from '@ant-design/icons';
import { RxDashboard } from 'react-icons/rx';
import { IoEarthOutline } from 'react-icons/io5';
import { MdOutlineTopic } from 'react-icons/md';
import { TbCategoryPlus } from 'react-icons/tb';
import { LuListMusic } from 'react-icons/lu';
import { BsJournalAlbum } from 'react-icons/bs';
import { RiUserStarLine } from 'react-icons/ri';
import { TfiLayoutSliderAlt } from 'react-icons/tfi';
import { Button, Layout, Menu, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { LiaHomeSolid } from 'react-icons/lia';
import { useUserStore } from '../store';
import { useGetDetailUser } from '../hook';
import avatar from '../Image/avatar.png';
const { Header, Sider, Content } = Layout;
const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const detailUser = useGetDetailUser(user.id, user.accessToken);
  const [collapsed, setCollapsed] = useState(false);
  let image = avatar;
  if (detailUser.data?.data.image) image = `${import.meta.env.VITE_API_FILE_URL}/${detailUser.data?.data.image}`;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleClick = (e) => {
    navigate(`${e.key}`);
  };
  return (
    <Layout className="h-screen">
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
              key: '/dashboard',
              icon: <PieChartOutlined />,
              label: 'Thống kê',
            },
            {
              key: '/dashboard/topic',
              icon: <MdOutlineTopic />,
              label: 'Quản lý chủ đề',
            },
            {
              key: '/dashboard/nation',
              icon: <IoEarthOutline />,
              label: 'Quản lý quốc gia',
            },
            {
              key: '/dashboard/category',
              icon: <TbCategoryPlus />,
              label: 'Quản lý thể loại',
            },
            {
              key: '/dashboard/singer',
              icon: <RiUserStarLine />,
              label: 'Quản lý ca sĩ',
            },
            {
              key: '/dashboard/song',
              icon: <LuListMusic />,
              label: 'Quản lý bài hát',
            },
            {
              key: '/dashboard/album',
              icon: <BsJournalAlbum />,
              label: 'Quản lý album',
            },
            {
              key: '/dashboard/user',
              icon: <UserOutlined />,
              label: 'Quản lý người dùng',
            },
            {
              key: '/dashboard/slide',
              icon: <TfiLayoutSliderAlt />,
              label: 'Quản lý slider',
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
          <div className="flex items-center">
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
            <Button
              type="text"
              icon={<LiaHomeSolid />}
              onClick={() => navigate('/')}
              style={{
                fontSize: '20px',
                width: 64,
                height: 64,
              }}
            />
          </div>
          <div className="flex items-center mr-[16px]">
            <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
              <img className="h-full w-full object-cover" src={image} alt="" />
            </div>
            <p className="ml-[6px] font-semibold text-[#333]">{detailUser.data?.data.fullName}</p>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            // padding: 24,
            minHeight: 280,
            // background: colorBgContainer,
            // borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
      <ToastContainer position="top-right" containerId={2} theme="light" autoClose={3000} draggable />
    </Layout>
  );
};
export default AdminLayout;
