import { Button, Flex, Image, Table } from 'antd';
import { MdOutlineReplay } from 'react-icons/md';
import { useUserStore } from '../../store';
import TitleAdmin from '../../components/titleAdmin';
import { useEffect, useState } from 'react';
import { useGetAllSingers } from '../../hook';
import { GoTrash } from 'react-icons/go';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import avatar from '../../Image/avatar.png';
import { useDeleteSinger, useUpdateTrashSinger } from '../../mutationHook/singer';
import { RiUserStarLine } from 'react-icons/ri';

function SingerTrash() {
  const user = useUserStore((state) => state.user);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const singers = useGetAllSingers(5, currentPage - 1, 1);
  const updateTrashSinger = useUpdateTrashSinger();
  const deleteSinger = useDeleteSinger();
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
  const handleRestore = (singer) => {
    Swal.fire({
      title: `Xác nhận khôi phục ca sĩ ${singer.name}!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashSinger.mutate({ singerIds: singer.id.toString(), accessToken: user.accessToken, trash: false });
      }
    });
  };
  const handleRestoreMany = () => {
    Swal.fire({
      title: `Xác nhận khôi phục lại ${selectedRowKeys.length} ca sĩ!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashSinger.mutate({ singerIds: selectedRowKeys.join(','), accessToken: user.accessToken, trash: false });
      }
    });
  };
  const handleDelete = (singer) => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn ca sĩ ${singer.name}!`,
      text: 'Điều này có thể sẽ xóa đi các dữ liệu liên quan đến ca sĩ này.',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSinger.mutate({ singerIds: singer.id.toString(), accessToken: user.accessToken });
      }
    });
  };
  const handleDeleteMany = () => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn ${selectedRowKeys.length} ca sĩ!`,
      text: 'Điều này có thể sẽ xóa đi các dữ liệu liên quan đến ca sĩ này.',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSinger.mutate({
          singerIds: selectedRowKeys.join(','),
          accessToken: user.accessToken,
        });
      }
    });
  };
  useEffect(() => {
    if (updateTrashSinger.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Ca sĩ đã được khôi phục!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTrashSinger.isSuccess]);
  useEffect(() => {
    if (deleteSinger.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã xóa thành công!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [deleteSinger.isSuccess]);
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
  return (
    <Flex gap="middle" vertical>
      <TitleAdmin
        trash
        disabled={selectedRowKeys.length === 0}
        title={'Quản lý ca sĩ (Thùng rác)'}
        icon={<RiUserStarLine />}
        onCreate={handleRestoreMany}
        onDelete={handleDeleteMany}
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
  );
}
export default SingerTrash;
