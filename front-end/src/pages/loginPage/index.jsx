import { useForm } from 'react-hook-form';
import Box from '../../components/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import InputLG from '../../components/InputLG';
import { useNavigate } from 'react-router-dom';
import * as userService from '../../service/userService';
import * as singerService from '../../service/singerService';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Button, Checkbox } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { useUserStore } from '../../store';
import { useMutation } from '@tanstack/react-query';

function LoginPage() {
  const navigate = useNavigate();
  const { updateUser, updateRole } = useUserStore();
  const [isSinger, setIsSinger] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const mutation = useMutation({
    mutationFn: async (data) => await userService.login(data),
  });

  const singerMutation = useMutation({
    mutationFn: async (data) => await singerService.loginSinger(data),
  });

  const handleCheckUser = (e) => {
    setIsSinger(e.target.checked);
  };

  const handleGetDetailUser = async (id, accessToken) => {
    const user = await userService.getDetailUser(id, accessToken);
    updateUser(id, user.data.fullName, user.data.username, user.data.vip, user.data.image, accessToken);
    if (user.data.isAdmin) {
      updateRole('admin');
      navigate('/dashboard');
    } else {
      updateRole('user');
      navigate('/');
    }
  };

  const handleGetDetailSinger = async (id, accessToken) => {
    const singer = await singerService.getDetailSinger(id);
    updateUser(id, singer.data.name, singer.data.username, singer.data.vip, singer.data.image, accessToken);
    updateRole('singer');
    navigate('/');
  };
  useEffect(() => {
    if (mutation.isSuccess) {
      if (mutation.data?.accessToken && !isSinger) {
        localStorage.setItem('accessToken', JSON.stringify(mutation.data.accessToken));
        localStorage.setItem('refreshToken', JSON.stringify(mutation.data.refreshToken));
        const decoded = jwtDecode(mutation.data.accessToken);
        if (decoded?.id && !decoded.isSinger) {
          handleGetDetailUser(decoded.id, mutation.data.accessToken);
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: mutation.data?.msg,
          icon: 'error',
          customClass: 'min-h-[35vh] w-[35vw] text-[14px]',
        });
      }
    }
  }, [mutation.isSuccess]);
  useEffect(() => {
    if (singerMutation.isSuccess) {
      if (singerMutation.data?.accessToken && isSinger) {
        localStorage.setItem('accessToken', JSON.stringify(singerMutation.data.accessToken));
        localStorage.setItem('refreshToken', JSON.stringify(singerMutation.data.refreshToken));
        const decoded = jwtDecode(singerMutation.data.accessToken);
        if (decoded?.id && decoded.isSinger) {
          handleGetDetailSinger(decoded.id, singerMutation.data.accessToken);
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: singerMutation.data?.msg,
          icon: 'error',
          customClass: 'min-h-[35vh] w-[35vw] text-[14px]',
        });
      }
    }
  }, [singerMutation.isSuccess]);

  const loginUser = (data) => {
    if (!isSinger) mutation.mutate(data);
    else singerMutation.mutate(data);
  };

  return (
    <div className="flex h-screen bg-[#048ec8] bg-gradient-to-r from-[#048ec8] to-fuchsia-500 text-[#333333]">
      <Box>
        <form onSubmit={handleSubmit(loginUser)}>
          <h1 className="text-center text-[34px] font-bold py-[20px]">ĐĂNG NHẬP</h1>
          <div className="py-[6px]">
            <p className="text-[12px] font-bold">Tên đăng nhập</p>
            <InputLG
              tyle={'text'}
              placeholder={'Nhập tên đăng nhập của bạn'}
              {...register('username', {
                required: true,
              })}
            />
            {errors?.username?.type === 'required' && (
              <p className="text-[#ff041d] mt-[4px] text-[10px]">Nhập tên đăng nhập của bạn vào!</p>
            )}
          </div>
          <div className="py-[6px]">
            <p className="text-[12px] font-bold">Mật khẩu</p>
            <InputLG
              tyle={'password'}
              placeholder={'Nhập mật khẩu của bạn'}
              {...register('password', { required: true, minLength: 8 })}
            />
            {errors?.password?.type === 'required' && (
              <p className="text-[#ff041d] mt-[4px] text-[10px]">Nhập mật khẩu của bạn vào!</p>
            )}
          </div>
          <div className="my-[4px]">
            <Checkbox
              onChange={handleCheckUser}
              className="text-[13px] text-[#048ec8] cursor-pointer hover:text-[#ff04d1] select-none"
            >
              Tôi là một ca sĩ
            </Checkbox>
          </div>
          <div className="flex justify-between text-[13px]">
            <p className="text-[#048ec8] cursor-pointer hover:text-[#ff04d1]" onClick={() => navigate('/')}>
              <span>
                <FontAwesomeIcon icon={faHome} />{' '}
              </span>
              Trở về
            </p>
            <p className="text-[#048ec8] cursor-pointer hover:text-[#ff04d1]" onClick={() => navigate('/register')}>
              Chưa có tài khoản?
            </p>
          </div>
          <Button
            size="large"
            type="noThing"
            loading={isSinger ? singerMutation.isPending : mutation.isPending}
            htmlType="submit"
            className="my-[32px] py-[12px] w-full rounded-[20px] border-none text-white font-bold bg-[#048ec8] bg-gradient-to-r from-[#048ec8] to-fuchsia-500"
          >
            ĐĂNG NHẬP
          </Button>
        </form>
      </Box>
    </div>
  );
}
export default LoginPage;
