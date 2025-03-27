import { useEffect, useRef, useState } from 'react';
import { useGetAllSingers } from '../../hook';
import { Avatar, Button, Flex, Form, Image, Input, Switch, Table, Tag } from 'antd';
import TitleAdmin from '../../components/titleAdmin';
import { RiUserStarLine } from 'react-icons/ri';
import { EditOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { GoTrash } from 'react-icons/go';
import avatar from '../../Image/avatar.png';
import ModalCreate from '../../components/Modal/modalCreate';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import {
  useCreateAccountSinger,
  useCreateSinger,
  useDeleteAccountSinger,
  useUpdateSinger,
  useUpdateTrashSinger,
} from '../../mutationHook/singer';
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
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const trash = useGetAllSingers(5, currentPage - 1, 1, null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState({});
  const [status, setStatus] = useState(false);
  const [name, setName] = useState('createdAt');
  const [sort, setSort] = useState('DESC');
  const singers = useGetAllSingers(10, currentPage - 1, false, searchValue, name, sort);
  const createSinger = useCreateSinger();
  const updateSinger = useUpdateSinger();
  const updateTrashSinger = useUpdateTrashSinger();
  const createAccountSinger = useCreateAccountSinger();
  const deleteAccountSinger = useDeleteAccountSinger();
  const columns = [
    {
      title: 'Tên nghệ sĩ',
      dataIndex: 'name',
      fixed: 'left',
      sorter: true,
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
      align: 'center',
      render: (item) =>
        item.username ? (
          <p
            onClick={() => handleDeleteAccount(item)}
            className=" cursor-pointer text-center text-blue-600 hover:underline"
          >
            Đã có tài khoản
          </p>
        ) : (
          <p
            onClick={() => handleOpenCreateAccount(item)}
            className="text-center cursor-pointer text-blue-600 hover:underline"
          >
            Chưa có tài khoản
          </p>
        ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center',
      render: (status) =>
        status ? (
          <Tag
            bordered={true}
            style={{ padding: '2px 12px', margin: 'auto', minWidth: '100px', textAlign: 'center' }}
            color="success"
          >
            Hoạt động
          </Tag>
        ) : (
          <Tag
            bordered={true}
            style={{ padding: '2px 12px', margin: 'auto', minWidth: '100px', textAlign: 'center' }}
            color="error"
          >
            Đã khóa
          </Tag>
        ),
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      align: 'center',
      width: 290,
      fixed: 'right',
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
      username: item.username
        ? { username: item.username, id: item.id, name: item.name }
        : { username: null, id: item.id },
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
  const handleOpenCreateAccount = (singer) => {
    setItem(singer);
    setOption(3);
    setIsModalOpen(true);
  };
  const handleTrash = (singer) => {
    Swal.fire({
      title: `Chuyển nghệ sĩ ${singer.name} vào thùng rác!`,
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
  const handleDeleteAccount = (singer) => {
    Swal.fire({
      title: `Xác nhận xóa tài khoản nghệ sĩ ${singer.name}!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAccountSinger.mutate({ id: singer.id, accessToken: user.accessToken });
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
        title: `Chuyển ${selectedRowKeys.length} nghệ sĩ vào thùng rác!`,
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
  const onChangeTable = (pagination, filters, sorter, extra) => {
    if (sorter.order) {
      setName(sorter.field);
      setSort(sorter.order === 'ascend' ? 'ASC' : sorter.order === 'descend' ? 'DESC' : undefined);
    } else {
      setName('createdAt');
      setSort('DESC');
    }
  };
  const onChange = (currentPage) => {
    setCurrentPage(currentPage);
  };
  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };
  useEffect(() => {
    if (singers.isError || createSinger.isError || updateSinger.isError || updateTrashSinger.isError) {
      toast.error(`505! Server Error!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [singers.isError, createSinger.isError, updateSinger.isError, updateTrashSinger.isError]);
  useEffect(() => {
    if (createSinger.isSuccess) {
      if (createSinger.data?.status === 'SUCCESS') {
        setIsModalOpen(false);
        form.resetFields();
        setImgUpload();
        toast.success(`Thêm mới nghệ sĩ thành công!`, {
          draggable: true,
          transition: Bounce,
        });
      } else {
        setIsModalOpen(false);
        toast.error(`Nghệ sĩ đã tồn tại trên hệ thống!`, {
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
      toast.success(`Cập nhật nghệ sĩ thành công!`, {
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
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTrashSinger.isSuccess]);
  useEffect(() => {
    if (createAccountSinger.isSuccess) {
      setIsModalOpen(false);
      toast.success(`Tài khoản nghệ sĩ tạo thành công!`, {
        draggable: true,
        transition: Bounce,
      });
      form.resetFields();
    }
  }, [createAccountSinger.isSuccess]);
  useEffect(() => {
    if (deleteAccountSinger.isSuccess) {
      toast.success(`Đã xóa tài khoản của nghệ sĩ!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [deleteAccountSinger.isSuccess]);
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
    } else if (option === 3) {
      createAccountSinger.mutate({
        id: item.id,
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
        accessToken: user.accessToken,
      });
    }
  };
  useEffect(() => {
    form.setFieldValue('name', item?.name);
    form.setFieldValue('desc', item?.desc);
    form.setFieldValue('username', null);
  }, [isModalOpen]);
  useEffect(() => {
    return () => URL.revokeObjectURL(imgUpload);
  }, [imgUpload]);
  return (
    <>
      <Flex gap="middle" vertical>
        <TitleAdmin
          search
          placeholderSearch={'Tìm kiếm nghệ sĩ'}
          title={'Quản lý nghệ sĩ'}
          icon={<RiUserStarLine />}
          onCreate={handleCreate}
          onDelete={handleTrashMany}
          onSearch={handleSearch}
          number={trash.data?.count}
        />
        <Table
          scroll={{
            y: singers.data?.count > 5 ? 'calc(100vh - 270px)' : null,
          }}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: singers.data?.count,
            onChange,
          }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          showSorterTooltip={{
            target: 'sorter-icon',
          }}
          onChange={onChangeTable}
          locale={{
            triggerDesc: 'Sắp xếp giảm dần',
            triggerAsc: 'Sắp xếp tăng dần',
            cancelSort: 'Hủy sắp xếp',
          }}
          loading={singers.isLoading}
        />
      </Flex>
      <ModalCreate
        title={option === 1 ? 'Thêm mới nghệ sĩ' : option === 2 ? 'Cập nhật nghệ sĩ' : 'Tạo tài khoản nghệ sĩ'}
        isModalOpen={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        btnText={option === 1 ? 'Thêm mới' : 'Cập nhật'}
        formId={'singer'}
        loading={createSinger.isPending || updateSinger.isPending}
      >
        <Form
          form={form}
          onFinish={onFinish}
          id="singer"
          labelCol={{
            span: 6,
          }}
          initialValues={item}
        >
          {(option === 1 || option === 2) && (
            <Form.Item label="Tên nghệ sĩ" name="name" rules={[{ required: true, message: 'Hãy nhập tên nghệ sĩ' }]}>
              <Input type="text" placeholder="Tên nghệ sĩ" />
            </Form.Item>
          )}
          {(option === 1 || option === 2) && (
            <Form.Item label="Mô tả" name="desc">
              <TextArea rows={4} type="text" placeholder="Mô tả nghệ sĩ" />
            </Form.Item>
          )}
          {(option === 1 || option === 3) && (
            <Form.Item
              rules={[option === 3 && { required: true, message: 'Tên đăng nhập không thể trống' }]}
              label="Tên đăng nhập"
              name="username"
            >
              <Input type="text" placeholder="Tên đăng nhập" />
            </Form.Item>
          )}
          {(option === 1 || option === 3) && (
            <Form.Item
              rules={[
                option === 3 && { required: true, message: 'Hãy nhập mật khẩu' },
                { min: 8, message: 'Mật khẩu yêu cầu ít nhất 8 ký tự!' },
              ]}
              label="Mật khẩu"
              name="password"
            >
              <Input type="password" placeholder="Mật khẩu" />
            </Form.Item>
          )}
          {(option === 1 || option === 3) && (
            <Form.Item
              rules={[
                option === 3 && { required: true, message: 'Hãy nhập mật khẩu xác nhận!' },
                option === 3 &&
                  (({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      } else return Promise.reject(new Error('Mật khẩu xác nhận không chính xác!'));
                    },
                  })),
              ]}
              label="Mật khẩu"
              name="confirmPassword"
            >
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
          {(option === 1 || option === 2) && (
            <Form.Item className="form-image" label="Hình ảnh">
              <input type="file" id="file" ref={inputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
              <div className="flex items-center gap-[18px]">
                <Button icon={<UploadOutlined />} className="w-1/2" onClick={() => inputRef.current.click()}>
                  Click to Upload
                </Button>
                {imgUpload ? (
                  <Image src={imgUpload} alt="" height={90} width={90} className="object-cover block rounded-full" />
                ) : (
                  <Avatar size={90} icon={<UserOutlined />} />
                )}
              </div>
            </Form.Item>
          )}
        </Form>
      </ModalCreate>
    </>
  );
}
export default AdminSinger;
