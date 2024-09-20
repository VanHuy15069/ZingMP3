import { useForm } from 'react-hook-form';
import Box from '../../components/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import InputLG from '../../components/InputLG';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import * as userService from '../../service/userService';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { Button } from 'antd';

function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const mutation = useMutation({
    mutationFn: async (data) => await userService.register(data),
  });
  const { data, isSuccess } = mutation;
  useEffect(() => {
    if (isSuccess) {
      if (data.data) {
        Swal.fire({
          title: 'Success!',
          text: 'Đăng ký tài khoản thành công!',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
          customClass: 'min-h-[35vh] w-[35vw] text-[14px]',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: data?.msg,
          icon: 'error',
          customClass: 'min-h-[35vh] w-[35vw] text-[14px]',
        });
      }
    }
  }, [isSuccess]);
  const registerUser = (data) => {
    mutation.mutate(data);
  };
  return (
    <div className="flex h-screen bg-[#048ec8] bg-gradient-to-r from-[#048ec8] to-fuchsia-500 text-[#333333]">
      <Box>
        <form onSubmit={handleSubmit(registerUser)}>
          <h1 className="text-center text-[34px] font-bold py-[20px]">ĐĂNG KÝ</h1>
          <div className="py-[6px]">
            <p className="text-[12px] font-bold">Tên người dùng</p>
            <InputLG tyle={'text'} placeholder={'Nhập tên khách hàng'} {...register('fullName', { required: true })} />
            {errors?.fullName?.type === 'required' && (
              <p className="text-[#ff041d] mt-[4px] text-[10px]">Nhập tên của bạn vào!</p>
            )}
          </div>
          <div className="py-[6px]">
            <p className="text-[12px] font-bold">Email</p>
            <InputLG tyle={'email'} placeholder={'Nhập email của bạn'} {...register('email', { required: true })} />
            {errors?.email?.type === 'required' && (
              <p className="text-[#ff041d] mt-[4px] text-[10px]">Nhập email của bạn vào!</p>
            )}
          </div>
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
              {...register('passWord', { required: true, minLength: 8 })}
            />
            {errors?.passWord?.type === 'required' && (
              <p className="text-[#ff041d] mt-[4px] text-[10px]">Nhập mật khẩu của bạn vào!</p>
            )}
            {errors?.passWord?.type === 'minLength' && (
              <p className="text-[#ff041d] mt-[4px] text-[10px]">Mật khẩu hơi yếu</p>
            )}
          </div>
          <div className="py-[6px]">
            <p className="text-[12px] font-bold">Xác nhận mật khẩu</p>
            <InputLG
              tyle={'password'}
              placeholder={'Nhập lại mật khẩu của bạn của bạn'}
              {...register('confirmPassword', { required: true, minLength: 8 })}
            />
            {errors?.confirmPassword?.type === 'required' && (
              <p className="text-[#ff041d] mt-[4px] text-[10px]">Nhập mật khẩu của bạn vào!</p>
            )}
            {errors?.confirmPassword?.type === 'minLength' && (
              <p className="text-[#ff041d] mt-[4px] text-[10px]">Mật khẩu hơi yếu</p>
            )}
          </div>
          <div className="flex justify-between text-[13px]">
            <p className="text-[#048ec8] cursor-pointer hover:text-[#ff04d1]" onClick={() => navigate('/')}>
              <span>
                <FontAwesomeIcon icon={faHome} />{' '}
              </span>
              Trở về
            </p>
            <p className="text-[#048ec8] cursor-pointer hover:text-[#ff04d1]" onClick={() => navigate('/login')}>
              Đã có tài khoản?
            </p>
          </div>
          <Button
            size="large"
            type="noThing"
            loading={mutation.isPending}
            htmlType="submit"
            className="my-[32px] py-[12px] w-full rounded-[20px] border-none text-white font-bold bg-[#048ec8] bg-gradient-to-r from-[#048ec8] to-fuchsia-500"
          >
            ĐĂNG KÝ
          </Button>
        </form>
      </Box>
    </div>
  );
}
export default RegisterPage;
