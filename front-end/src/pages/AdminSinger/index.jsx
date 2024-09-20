import { useEffect, useRef, useState } from 'react';
import { useGetAllSingers } from '../../hook';
import { Button, Flex, Form, Image, Input, Switch, Table } from 'antd';
import TitleAdmin from '../../components/titleAdmin';
import { RiUserStarLine } from 'react-icons/ri';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import { GoTrash } from 'react-icons/go';
import avatar from '../../Image/avatar.png';
import ModalCreate from '../../components/Modal/modalCreate';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import { useCreateSinger, useUpdateSinger, useUpdateTrashSinger } from '../../mutationHook/singer';
import { Bounce, toast } from 'react-toastify';
import TextArea from 'antd/es/input/TextArea';
import Swal from 'sweetalert2';

function AdminSinger() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = useUserStore((state) => state.user);
  const inputRef = useRef(null);
  const [imgUpload, setImgUpload] = useState();
  const [image, setImage] = useState();
  const [option, setOption] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const trash = useGetAllSingers(5, currentPage - 1, 1, null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState({});
  const [status, setStatus] = useState(false);
  const singers = useGetAllSingers(5, currentPage - 1, false, null);
  const createSinger = useCreateSinger();
  const updateSinger = useUpdateSinger();
  const updateTrashSinger = useUpdateTrashSinger();

  const columns = [
    {
      title: 'Tên ca sĩ',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      align: 'center',
    },
    {
      title: 'Lượt theo dõi',
      dataIndex: 'follows',
      align: 'center',
    },
    {
      title: 'Tài khoản',
      dataIndex: 'username',
      render: (username) => `${username ? 'Đã có tài khoản' : 'Chưa có tài khoản'}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => `${status ? 'Hoạt động' : 'Đã khóa'}`,
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      fixed: 'right',
      width: '10%',
    },
  ];
  const dataSource = singers.data?.data.map((item) => {
    return {
      key: item.id,
      name: item.name,
      image: (
        <Image
          height={64}
          width={64}
          className="rounded-full object-cover overflow-hidden"
          src={item.image ? `${import.meta.env.VITE_API_FILE_URL}/${item.image}` : avatar}
        />
      ),
      follows: item.follows,
      username: item.username ?? null,
      status: item.status,
      action: (
        <Flex gap="small">
          <Button type="primary" size="large" icon={<EditOutlined />} onClick={() => handleOpenUpdate(item)}>
            Chỉnh sửa
          </Button>
          <Button type="primary" danger size="large" icon={<GoTrash />} onClick={() => handleTrash(item)}>
            Thùng rác
          </Button>
        </Flex>
      ),
    };
  });
  const handleOpenUpdate = (singer) => {
    setItem(singer);
    setStatus(singer.status);
    setImage();
    setOption(2);
    setIsModalOpen(true);
    setImgUpload(singer.image ? `${import.meta.env.VITE_API_FILE_URL}/${singer.image}` : avatar);
  };
  const handleTrash = (singer) => {
    Swal.fire({
      title: `Chuyển ca sĩ ${singer.name} vào thùng rác!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashSinger.mutate({ singerIds: singer.id.toString(), accessToken: user.accessToken, trash: true });
      }
    });
  };
  const handleCreate = () => {
    setIsModalOpen(true);
    setImage();
    setImgUpload();
    setOption(1);
    setItem({});
  };
  const handleTrashMany = () => {
    if (selectedRowKeys.length > 0) {
      Swal.fire({
        title: `Chuyển ${selectedRowKeys.length} ca sĩ vào thùng rác!`,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
        customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
      }).then((result) => {
        if (result.isConfirmed) {
          updateTrashSinger.mutate({
            singerIds: selectedRowKeys.join(','),
            accessToken: user.accessToken,
            trash: true,
          });
        }
      });
    } else navigate('/dashboard/singer/trash');
  };
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImgUpload(URL.createObjectURL(file));
    }
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const onChange = (currentPage) => {
    setCurrentPage(currentPage);
  };
  useEffect(() => {
    if (createSinger.isSuccess) {
      if (createSinger.data?.status === 'SUCCESS') {
        setIsModalOpen(false);
        form.resetFields();
        setImgUpload();
        toast.success(`Thêm mới ca sĩ thành công!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      } else {
        setIsModalOpen(false);
        toast.error(`Ca sĩ đã tồn tại trên hệ thống!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      }
    }
  }, [createSinger.isSuccess]);
  useEffect(() => {
    if (updateSinger.isSuccess) {
      setIsModalOpen(false);
      form.resetFields();
      setImgUpload();
      toast.success(`Cập nhật ca sĩ thành công!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateSinger.isSuccess]);
  useEffect(() => {
    if (updateTrashSinger.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã chuyển vào thùng rác!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTrashSinger.isSuccess]);
  const onFinish = (data) => {
    if (option === 1) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('accessToken', user.accessToken);
      if (data.desc) formData.append('desc', data.desc);
      if (data.username && data.password && data.confirmPassword) {
        formData.append('username', data.username);
        formData.append('password', data.password);
        formData.append('confirmPassword', data.confirmPassword);
      }
      if (image) formData.append('image', image);
      createSinger.mutate(formData);
    } else if (option === 2) {
      const formData = new FormData();
      formData.append('id', item.id);
      formData.append('name', data.name);
      formData.append('accessToken', user.accessToken);
      formData.append('status', status);
      if (data.desc) formData.append('desc', data.desc);
      if (image) formData.append('image', image);
      updateSinger.mutate(formData);
    }
  };
  useEffect(() => {
    form.setFieldValue('name', item?.name);
    form.setFieldValue('desc', item?.desc);
    form.setFieldValue('username', null);
  }, [item]);
  useEffect(() => {
    return () => URL.revokeObjectURL(imgUpload);
  }, [imgUpload]);
  return (
    <>
      <Flex gap="middle" vertical>
        <TitleAdmin
          title={'Quản lý ca sĩ'}
          icon={<RiUserStarLine />}
          onCreate={handleCreate}
          onDelete={handleTrashMany}
          number={trash.data?.count}
        />
        <Table
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: singers.data?.count,
            onChange,
          }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
        />
      </Flex>
      <ModalCreate
        title={option === 1 ? 'Thêm mới ca sĩ' : 'Cập nhật ca sĩ'}
        isModalOpen={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        btnText={option === 1 ? 'Thêm mới' : 'Cập nhật'}
        formId={'singer'}
      >
        <Form
          form={form}
          onFinish={onFinish}
          id="singer"
          labelCol={{
            span: 5,
          }}
          initialValues={item}
        >
          <Form.Item label="Tên ca sĩ" name="name" rules={[{ required: true, message: 'Hãy nhập tên ca sĩ' }]}>
            <Input type="text" placeholder="Tên ca sĩ" />
          </Form.Item>
          <Form.Item label="Mô tả" name="desc">
            <TextArea rows={4} type="text" placeholder="Mô tả ca sĩ" />
          </Form.Item>
          {option === 1 && (
            <Form.Item label="Tên đăng nhập" name="username">
              <Input type="text" placeholder="Tên đăng nhập" />
            </Form.Item>
          )}
          {option === 1 && (
            <Form.Item label="Mật khẩu" name="password">
              <Input type="password" placeholder="Mật khẩu" />
            </Form.Item>
          )}
          {option === 1 && (
            <Form.Item label="Mật khẩu" name="confirmPassword">
              <Input type="password" placeholder="Xác nhận mật khẩu" />
            </Form.Item>
          )}
          {option === 2 && (
            <Form.Item label="Trạng thái" name="status">
              <div className="flex items-center gap-6">
                <Switch checked={status} onChange={(value) => setStatus(value)} />{' '}
                <p>{status ? 'Hoạt động' : 'Đã khóa'}</p>
              </div>
            </Form.Item>
          )}
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
export default AdminSinger;
