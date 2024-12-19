import { Button, Flex, Image, Table } from 'antd';
import { GoTrash } from 'react-icons/go';
import { UserOutlined } from '@ant-design/icons';
import { useGetAllUserIntoTrash } from '../../hook';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../store';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import avatar from '../../Image/avatar.png';
import { useDeleteUser, useRestoreUser } from '../../mutationHook/user';
import { MdOutlineReplay } from 'react-icons/md';
import TitleAdmin from '../../components/titleAdmin';

function UserTrash() {
  const user = useUserStore((state) => state.user);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const users = useGetAllUserIntoTrash(10, currentPage - 1, user.accessToken);
  const restoreUser = useRestoreUser();
  const deleteUser = useDeleteUser();

  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'fullName',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
    },
    // {
    //   title: 'Tên đăng nhập',
    //   dataIndex: 'username',
    // },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center',
      render: (status) =>
        status ? (
          <p className="p-3 m-auto leading-none bg-green-500 w-fit rounded-lg text-white text-[12px] font-semibold">
            Hoạt động
          </p>
        ) : (
          <p className="p-3 m-auto leading-none bg-red-500 w-fit rounded-lg text-white text-[12px] font-semibold">
            Đã khóa
          </p>
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

  const dataSource = users.data?.data.rows.map((item) => {
    let img = avatar;
    if (item.image) img = `${import.meta.env.VITE_API_FILE_URL}/${item.image}`;
    return {
      key: item.id,
      fullName: <p className={item.vip ? 'text-yellow-500 font-bold' : ''}>{item.fullName}</p>,
      image: <Image height={64} width={64} className="rounded-full object-cover" src={img} />,
      // username: item.username,
      email: item.email,
      status: item.status,
      action: (
        <Flex gap="small">
          <Button type="primary" size="large" icon={<MdOutlineReplay />} onClick={() => handleRestore(item)}>
            Khôi phục
          </Button>
          <Button type="primary" danger size="large" icon={<GoTrash />} onClick={() => handleDelete(item)}>
            Xóa
          </Button>
        </Flex>
      ),
    };
  });
  const handleRestore = (item) => {
    Swal.fire({
      title: `Xác nhận khôi phục người dùng ${item.fullName}!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        restoreUser.mutate({ userIds: item.id.toString(), accessToken: user.accessToken });
      }
    });
  };
  const handleDelete = (item) => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn tài khoản ${item.fullName}!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser.mutate({ userIds: item.id.toString(), accessToken: user.accessToken });
      }
    });
  };
  const handleDeleteMany = () => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn ${selectedRowKeys.length} tài khoản!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser.mutate({
          userIds: selectedRowKeys.join(','),
          accessToken: user.accessToken,
        });
      }
    });
  };
  useEffect(() => {
    if (users.isError || restoreUser.isError || deleteUser.isError) {
      toast.error(`505! Server Error!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [users.isError, restoreUser.isError, deleteUser.isError]);
  useEffect(() => {
    if (restoreUser.isSuccess) {
      setSelectedRowKeys([]);
      toast.success('Đã khôi phục thành công tài khoản người dùng!', {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [restoreUser.isSuccess]);
  useEffect(() => {
    if (deleteUser.isSuccess) {
      setSelectedRowKeys([]);
      toast.success('Đã xóa thành công tài khoản người dùng!', {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [deleteUser.isSuccess]);
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
  const handleRestoreMany = () => {
    Swal.fire({
      title: `Xác nhận khôi phục lại ${selectedRowKeys.length} tài khoản!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        restoreUser.mutate({ userIds: selectedRowKeys.join(','), accessToken: user.accessToken });
      }
    });
  };
  return (
    <>
      <Flex gap="middle" vertical>
        <TitleAdmin
          trash
          disabled={selectedRowKeys.length === 0}
          title={'Quản lý tài khoản (Thùng rác)'}
          icon={<UserOutlined />}
          onCreate={handleRestoreMany}
          onDelete={handleDeleteMany}
        />
        <Table
          scroll={{
            y: users.data?.data.count > 5 ? 'calc(100vh - 270px)' : null,
          }}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: users.data?.data.count,
            onChange,
          }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          loading={users.isLoading}
        />
      </Flex>
    </>
  );
}
export default UserTrash;
