import { useGetDeatailSinger } from '../../hook';
import { useUserStore } from '../../store';
import avatar from '../../Image/avatar.png';
import { Button, Form, Image, Input } from 'antd';
import ModalCreate from '../../components/Modal/modalCreate';
import { useEffect, useRef, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateAccountSinger, useUpdateSinger } from '../../mutationHook/singer';
import { Bounce, toast } from 'react-toastify';
function SingerDetailPage() {
  const [form] = Form.useForm();
  const user = useUserStore((state) => state.user);
  const singerDetail = useGetDeatailSinger(user.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef(null);
  const [imgUpload, setImgUpload] = useState();
  const [image, setImage] = useState();
  const updateSinger = useUpdateSinger();
  const updateAccount = useCreateAccountSinger();
  let avatarImg = avatar;
  if (singerDetail.data?.data.image)
    avatarImg = `${import.meta.env.VITE_API_FILE_URL}/${singerDetail.data?.data.image}`;
  const handleOpenModal = () => {
    setIsModalOpen(true);
    form.setFieldValue('name', singerDetail.data?.data.name);
    form.setFieldValue('desc', singerDetail.data?.data.desc);
    form.setFieldValue('username', singerDetail.data?.data.username);
    setImgUpload(avatarImg);
  };
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImgUpload(URL.createObjectURL(file));
    }
  };
  const onFinish = (data) => {
    const formData = new FormData();
    formData.append('id', user.id);
    formData.append('name', data.name);
    formData.append('accessToken', user.accessToken);
    if (data.desc) formData.append('desc', data.desc);
    if (image) formData.append('image', image);
    updateSinger.mutate(formData);
    if (data.password && data.confirmPassword && data.password === data.confirmPassword) {
      updateAccount.mutate({
        id: user.id,
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
        accessToken: user.accessToken,
      });
    }
  };
  useEffect(() => {
    if (updateSinger.isSuccess || updateAccount.isSuccess) {
      setIsModalOpen(false);
      setImgUpload();
      toast.success(`Cập nhật thông tin thành công!`, {
        toastId: 3,
        draggable: true,
        transition: Bounce,
      });
      form.resetFields();
    }
  }, [updateSinger.isSuccess, updateAccount.isSuccess]);
  useEffect(() => {
    return () => URL.revokeObjectURL(imgUpload);
  }, [imgUpload]);
  return (
    <>
      <div className="flex flex-col items-center gap-6">
        <img src={avatarImg} height={120} width={120} className="rounded-full object-cover select-none" />
        <p className="text-[24px] font-semibold text-[#444]">{singerDetail.data?.data.name}</p>
        <div className="w-[600px] text-justify">{singerDetail.data?.data.desc}</div>
        <div className="w-[600px] flex justify-between font-medium text-[16px] text-[#444] select-none">
          <div className="flex flex-col items-center">
            <p className="text-[24px]">{singerDetail.data?.songs}</p>
            <p>Bài hát</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-[24px]">{singerDetail.data?.follow}</p>
            <p>Lượt theo dõi</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-[24px]">{singerDetail.data?.albums}</p>
            <p>Album</p>
          </div>
        </div>
        <Button onClick={handleOpenModal} type="primary" size="large">
          Cập nhật thông tin cá nhân
        </Button>
      </div>
      <ModalCreate
        title={'Cập nhật thông tin cá nhân'}
        isModalOpen={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        btnText={'Cập nhật'}
        formId={'utdsinger'}
      >
        <Form
          form={form}
          onFinish={onFinish}
          id="utdsinger"
          labelCol={{
            span: 6,
          }}
        >
          <Form.Item label="Tên nghệ sĩ" name="name" rules={[{ required: true, message: 'Hãy nhập tên nghệ sĩ' }]}>
            <Input type="text" placeholder="Tên nghệ sĩ" />
          </Form.Item>
          <Form.Item label="Mô tả" name="desc">
            <TextArea rows={4} type="text" placeholder="Mô tả nghệ sĩ" />
          </Form.Item>
          <Form.Item label="Tên đăng nhập" name="username">
            <Input readOnly type="text" placeholder="Tên đăng nhập" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ min: 8, message: 'Mật khẩu yêu cầu ít nhất 8 ký tự!' }]}
          >
            <Input type="password" placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="confirmPassword"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  } else return Promise.reject(new Error('Mật khẩu xác nhận không chính xác!'));
                },
              }),
            ]}
          >
            <Input type="password" placeholder="Xác nhận mật khẩu" />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <input type="file" id="file" ref={inputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
            <div className="flex flex-col gap-[8px]">
              <Button icon={<UploadOutlined />} onClick={() => inputRef.current.click()}>
                Click to Upload
              </Button>
              {imgUpload && <Image src={imgUpload} alt="" height={90} className="w-[40%] object-cover block" />}
            </div>
          </Form.Item>
        </Form>
      </ModalCreate>
    </>
  );
}

export default SingerDetailPage;
