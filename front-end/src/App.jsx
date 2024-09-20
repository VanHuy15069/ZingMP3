import { Fragment, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { publicRouter, userRouter, adminRouter } from './router';
import DefaultLayout from './Layout/defaultLayout';
import { useAudioStore, useUserStore } from './store';
import * as userService from './service/userService';
import * as singerService from './service/singerService';
import { jwtDecode } from 'jwt-decode';
import { isJsonString } from './golobalFn';
import AdminLayout from './Layout/adminLayout';

function App() {
  const accessToken = JSON.parse(localStorage.getItem('accessToken'));
  const list = JSON.parse(localStorage.getItem('listMusic'));
  const { user, updateUser, updateRole } = useUserStore();
  const { updateSongId, updateSongAlbum } = useAudioStore();
  const handleGetDetailUser = async (id, accessToken) => {
    const user = await userService.getDetailUser(id, accessToken);
    updateUser(id, user.data.fullName, user.data.username, user.data.vip, user.data.image, accessToken);
    if (user.data.isAdmin) updateRole('admin');
    else updateRole('user');
  };
  const handleGetDetailSinger = async (id, accessToken) => {
    const singer = await singerService.getDetailSinger(id);
    updateUser(id, singer.data.name, singer.data.username, singer.data.vip, singer.data.image, accessToken);
    updateRole('singer');
  };
  const handleDecoded = () => {
    let storateData = localStorage.getItem('accessToken');
    let refreshToken = localStorage.getItem('refreshToken');
    let decoded = {};
    if (storateData && isJsonString(storateData)) {
      storateData = JSON.parse(storateData);
      refreshToken = JSON.parse(refreshToken);
      decoded = jwtDecode(storateData);
    }
    return { decoded, storateData, refreshToken };
  };
  console.log(handleDecoded());

  useEffect(() => {
    const { storateData, decoded } = handleDecoded();
    if (decoded?.id) {
      if (decoded.isSinger) handleGetDetailSinger(decoded.id, storateData);
      else handleGetDetailUser(decoded.id, storateData);
    }
  }, []);
  useEffect(() => {
    if (list) {
      updateSongId(list[0].id);
      updateSongAlbum(list[0].albumId);
    }
  }, []);
  userService.axiosJWT.interceptors.request.use(
    async (config) => {
      const { decoded, refreshToken } = handleDecoded();
      const currentTime = new Date();
      if (decoded?.exp < currentTime.getTime() / 1000 && refreshToken) {
        const data = await userService.refeshToken(refreshToken);
        config.headers['token'] = `Bearer ${data.access_token}`;
        localStorage.setItem('accessToken', JSON.stringify(data.access_token));
        updateUser(user.id, user.name, user.username, user.vip, user.image, data.access_token);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
  return (
    <>
      <Routes>
        {publicRouter.map((route, index) => {
          const Layout = route.layout === null ? Fragment : DefaultLayout;
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
        {userRouter.map((route, index) => {
          const Layout = route.layout === null ? Fragment : DefaultLayout;
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                accessToken && !handleDecoded().decoded.isSinger ? (
                  <Layout>
                    <Page />
                  </Layout>
                ) : (
                  <Navigate to={'/login'} />
                )
              }
            />
          );
        })}
        {adminRouter.map((route, index) => {
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                accessToken && handleDecoded().decoded.isAdmin ? (
                  <AdminLayout>
                    <Page />
                  </AdminLayout>
                ) : (
                  <Navigate to={'/login'} />
                )
              }
            />
          );
        })}
      </Routes>
    </>
  );
}

export default App;
