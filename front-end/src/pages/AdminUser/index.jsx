import { Button, Flex, Image, Table } from 'antd';
import { GoLock, GoTrash, GoUnlock } from 'react-icons/go';
import { UserOutlined } from '@ant-design/icons';
import { useGetAllUser, useGetAllUserIntoTrash } from '../../hook';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../store';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import avatar from '../../Image/avatar.png';
import { useMoveUserToTrash, usesUpdatePrivateUser } from '../../mutationHook/user';

function AdminUser() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const users = useGetAllUser(10, currentPage - 1, user.accessToken);
  const usersTrash = useGetAllUserIntoTrash(null, null, user.accessToken);
  const updateUser = usesUpdatePrivateUser();
  const trashUser = useMoveUserToTrash();

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
        <Flex gap="small" justify="end">
          <Button
            type="primary"
            size="large"
            icon={item.status ? <GoLock /> : <GoUnlock />}
            onClick={() => handleUpdate(item)}
          >
            {item.status ? 'Khóa tài khoản' : 'Mở khóa'}
          </Button>
          <Button type="primary" danger size="large" icon={<GoTrash />} onClick={() => handleTrash(item)}>
            Thùng rác
          </Button>
        </Flex>
      ),
    };
  });
  const handleUpdate = (item) => {
    updateUser.mutate({ status: !item.status, vip: null, id: item.id, accessToken: user.accessToken });
  };
  useEffect(() => {
    if (updateUser.isSuccess) {
      toast.success(updateUser.data?.data.status ? 'Tài khoản đã được mở khóa' : 'Tài khoản đã khóa', {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateUser.isSuccess]);
  const handleTrash = (item) => {
    Swal.fire({
      title: `Chuyển người dùng ${item.fullName} vào thùng rác!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        trashUser.mutate({ userIds: item.id.toString(), accessToken: user.accessToken });
      }
    });
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
  const handleTrashMany = () => {
    if (selectedRowKeys.length > 0) {
      Swal.fire({
        title: `Chuyển ${selectedRowKeys.length} người dùng vào thùng rác!`,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
        customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
      }).then((result) => {
        if (result.isConfirmed) {
          trashUser.mutate({ userIds: selectedRowKeys.join(','), accessToken: user.accessToken });
        }
      });
    } else navigate('/dashboard/user/trash');
  };
  useEffect(() => {
    if (trashUser.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã chuyển vào thùng rác!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [trashUser.isSuccess]);
  return (
    <>
      <Flex gap="middle" vertical>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[26px] font-bold text-[#333]">
            <span>
              <UserOutlined />
            </span>
            <h3>Quản lý tài khoản</h3>
          </div>
          <Button onClick={handleTrashMany} type="primary" size="large" danger icon={<GoTrash />}>
            {`Thùng rác ${usersTrash.data?.data.count > 0 ? `(${usersTrash.data?.data.count})` : ''}`}
          </Button>
        </div>
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
export default AdminUser;
