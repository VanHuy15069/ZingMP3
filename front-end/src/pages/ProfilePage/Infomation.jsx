import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Image, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import avatar from '../../Image/avatar.png';
import './info.css';
import { useUpdateUser } from '../../mutationHook/user';
import { Bounce, toast } from 'react-toastify';
import { useUserStore } from '../../store';
import _ from 'lodash';
function Infomation({ user, accessToken }) {
  const { updateUser } = useUserStore();
  const inputRef = useRef();
  const [form] = Form.useForm();
  const [isChange, setIsChange] = useState(false);
  const [isChangeImg, setIsChangeImg] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [imgUpload, setImgUpload] = useState();
  const [image, setImage] = useState();
  const updateUserMutation = useUpdateUser();
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImgUpload(URL.createObjectURL(file));
      setIsChangeImg(true);
    }
  };
  useEffect(() => {
    return () => URL.revokeObjectURL(imgUpload);
  }, [imgUpload]);
  useEffect(() => {
    if (!user?.image) setImgUpload(avatar);
    else setImgUpload(`${import.meta.env.VITE_API_FILE_URL}/${user?.image}`);
    form.setFieldValue('fullName', user?.fullName);
    form.setFieldValue('email', user?.email);
  }, [user]);
  useEffect(() => {
    setInitialValues({
      fullName: user?.fullName,
      email: user?.email,
    });
  }, [user?.id, form, isChange]);
  const areObjectsEqual = (object1, object2) => {
    return _.isEqual(object1, object2);
  };
  useEffect(() => {
    if (updateUserMutation.isSuccess) {
      const user = updateUserMutation.data?.data;
      toast('Thông tin đã được cập nhật!', {
        toastId: 1,
        draggable: true,
        hideProgressBar: true,
        transition: Bounce,
      });
      updateUser(user.id, user.fullName, user.username, user.vip, user.image, accessToken);
      setIsChangeImg(false);
      setInitialValues({
        fullName: user.fullName,
        email: user.email,
      });
    }
  }, [updateUserMutation.isSuccess]);
  const handleChangeForm = () => {
    setIsChange(!isChange);
  };
  const onFinish = (data) => {
    const formData = new FormData();
    formData.append('id', user?.id);
    formData.append('accessToken', accessToken);
    if (data.fullName) formData.append('fullName', data.fullName);
    if (data.email) formData.append('email', data.email);
    if (image) formData.append('image', image);
    updateUserMutation.mutate(formData);
  };

  return (
    <div>
      <Form
        onFinish={onFinish}
        onValuesChange={handleChangeForm}
        form={form}
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 10,
        }}
        initialValues={user}
      >
        <Form.Item label="Tên đầy đủ" name="fullName" rules={[{ required: true, message: 'Tên không thể để trống!' }]}>
          <Input className="text-black" type="text" placeholder="Tên đầy đủ" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email không thể để trống!' }]}>
          <Input className="text-black" type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item className="form-image" label="Hình ảnh">
          <input type="file" id="file" ref={inputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
          <div className="flex items-center gap-[12px]">
            <Button className="text-black" icon={<UploadOutlined />} onClick={() => inputRef.current.click()}>
              Click to Upload
            </Button>
            {imgUpload && (
              <div className="h-[80px] w-[80px] rounded-full overflow-hidden">
                <Image src={imgUpload} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            // span: 20,
          }}
        >
          <Button
            disabled={areObjectsEqual(initialValues, form.getFieldsValue()) && !isChangeImg}
            className="bg-purple-primary text-white hover:bg-purple-hover disabled:opacity-[0.5] disabled:cursor-default"
            type="noType"
            htmlType="submit"
          >
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Infomation;
