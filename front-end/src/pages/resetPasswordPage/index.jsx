import { useParams } from 'react-router-dom';
import { useCheckTokenResetPassword } from '../../hook';
import { Button, Form, Input } from 'antd';
import { useResetPassword } from '../../mutationHook/user';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { TfiFaceSad } from 'react-icons/tfi';

function ResetPasswordPage() {
  const token = useParams().token;
  const checkToken = useCheckTokenResetPassword(token);
  const resetPassword = useResetPassword();
  const handleSubmit = (data) => {
    resetPassword.mutate({ token: token, password: data.password, confirmPassword: data.confirmPassword });
  };
  useEffect(() => {
    if (resetPassword.isSuccess) {
      Swal.fire({
        title: 'Success!',
        text: 'Thay đổi mật khẩu thành công!',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        customClass: 'min-h-[35vh] w-[35vw] text-[14px]',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    }
  }, [resetPassword.isSuccess]);
  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#333]">
      {checkToken.data?.status === 'SUCCESS' ? (
        <div className="w-[600px] m-auto bg-white min-h-screen shadow-xl px-[16px] py-[64px]">
          <h2 className="text-[24px] font-semibold mb-[24px]">Thay đổi mật khẩu</h2>
          <Form
            name="reset-password"
            layout="vertical"
            size="large"
            onFinish={handleSubmit}
            initialValues={{ username: checkToken.data?.data.username, email: checkToken.data?.data.email }}
          >
            <Form.Item label="Tên đăng nhập" name="username">
              <Input disabled type="text" placeholder="Tên đăng nhập" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input disabled type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item
              rules={[
                { required: true, message: 'Hãy nhập mật khẩu' },
                { min: 8, message: 'Mật khẩu yêu cầu ít nhất 8 ký tự!' },
              ]}
              label="Mật khẩu mới"
              name="password"
            >
              <Input type="password" placeholder="Mật khẩu" />
            </Form.Item>
            <Form.Item
              rules={[
                { required: true, message: 'Hãy nhập mật khẩu xác nhận!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    } else return Promise.reject(new Error('Mật khẩu xác nhận không chính xác!'));
                  },
                }),
              ]}
              label="Mật khẩu xác nhận"
              name="confirmPassword"
            >
              <Input type="password" placeholder="Xác nhận mật khẩu" />
            </Form.Item>
            <Form.Item label={null}>
              <Button
                loading={resetPassword.isPending}
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: '210px' }}
              >
                Gửi
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div className="flex min-h-screen">
          <div className="m-auto flex flex-col items-center">
            <span className="text-[140px]">
              <TfiFaceSad />
            </span>
            <p className="mt-[40px] text-[18px]">Lỗi rồi! Đường dẫn này đã hết hạn.</p>
          </div>
        </div>
      )}
    </div>
  );
}
export default ResetPasswordPage;
