import { Button, Form, Input } from 'antd';
import { useChangePassword } from '../../mutationHook/user';
import { useUserStore } from '../../store';
import { useEffect, useState } from 'react';
import { Bounce, toast } from 'react-toastify';

function ChangePassword({ tab }) {
  const user = useUserStore((state) => state.user);
  const [form] = Form.useForm();
  const changePassword = useChangePassword();
  const [checkPassword, setCheckPassword] = useState(false);
  const [password, setPassword] = useState(null);
  useEffect(() => {
    form.resetFields();
  }, [tab]);

  useEffect(() => {
    if (changePassword.isSuccess) {
      if (changePassword.data.status === 'SUCCESS') {
        toast('Mật khẩu được thay đổi thành công!', {
          toastId: 1,
          draggable: true,
          hideProgressBar: true,
          transition: Bounce,
        });
        form.resetFields();
      } else {
        toast(changePassword.data.msg, {
          toastId: 1,
          draggable: true,
          hideProgressBar: true,
          transition: Bounce,
        });
      }
    }
  }, [changePassword.isSuccess]);
  const onFinish = (data) => {
    if (data.newPassword === data.confirmPassword) {
      const formData = new FormData();
      formData.append('password', data.password);
      formData.append('newPassword', data.newPassword);
      formData.append('confirmPassword', data.confirmPassword);
      formData.append('id', user.id);
      formData.append('accessToken', user.accessToken);
      changePassword.mutate(formData);
    }
  };
  const handleChange = (value) => {
    if (value.newPassword) setPassword(value.newPassword);
    if (value.confirmPassword !== password) setCheckPassword(true);
    else setCheckPassword(false);
  };
  const checkPasswordMSG = () => {
    return new Promise((resolve, reject) => {
      if (checkPassword) {
        reject('Mật khẩu xác nhận không chính xác!');
      } else {
        resolve();
      }
    });
  };
  return (
    <div>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 10,
        }}
        onValuesChange={handleChange}
      >
        <Form.Item
          label="Mật khẩu hiện tại"
          name="password"
          rules={[{ required: true, message: 'Thông tin không thể để trống!' }]}
        >
          <Input.Password className="text-black" placeholder="Mật khẩu hiện tại" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: 'Thông tin không thể để trống!' }]}
        >
          <Input.Password className="text-black" placeholder="Mật khẩu mới" />
        </Form.Item>
        <Form.Item
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          rules={[
            { required: true, message: 'Thông tin không thể để trống!' },
            {
              validator: checkPasswordMSG,
            },
          ]}
        >
          <Input.Password className="text-black" placeholder="Nhập lại mật khẩu" />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 9,
            span: 20,
          }}
        >
          <Button className="bg-purple-primary text-white hover:bg-purple-hover" type="noType" htmlType="submit">
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ChangePassword;
