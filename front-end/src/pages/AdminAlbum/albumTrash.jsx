import { Button, Flex, Image, Table } from 'antd';
import { MdOutlineReplay } from 'react-icons/md';
import { useUserStore } from '../../store';
import TitleAdmin from '../../components/titleAdmin';
import { useEffect, useState } from 'react';
import { useGetAllAlbums } from '../../hook';
import { GoTrash } from 'react-icons/go';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useDeleteAlbum, useUpdateTrashAlbum } from '../../mutationHook/album';
import { BsJournalAlbum } from 'react-icons/bs';

function AlbumTrash() {
  const user = useUserStore((state) => state.user);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const albums = useGetAllAlbums(5, currentPage - 1, null, 1, 'createdAt', 'DESC');
  const updateTrashAlbum = useUpdateTrashAlbum();
  const deleteAlbum = useDeleteAlbum();
  const columns = [
    {
      title: 'Tên album',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      width: '30%',
    },
    {
      title: 'Ca sĩ',
      dataIndex: 'singer',
      width: '20%',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: '20%',
    },
  ];
  const dataSource = albums.data?.data.rows.map((item) => {
    return {
      key: item.id,
      name: item.name,
      image: (
        <Image
          height={64}
          width={64}
          className="rounded-[4px] object-cover"
          src={`${import.meta.env.VITE_API_FILE_URL}/${item.image}`}
        />
      ),
      singer: item.singerInfo?.name,
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
  const handleRestore = (album) => {
    Swal.fire({
      title: `Xác nhận khôi phục album ${album.name}!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashAlbum.mutate({ albumIds: album.id.toString(), accessToken: user.accessToken, trash: false });
      }
    });
  };
  const handleRestoreMany = () => {
    Swal.fire({
      title: `Xác nhận khôi phục lại ${selectedRowKeys.length} album!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashAlbum.mutate({ albumIds: selectedRowKeys.join(','), accessToken: user.accessToken, trash: false });
      }
    });
  };
  const handleDelete = (album) => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn album ${album.name}!`,
      text: 'Điều này có thể sẽ xóa đi các dữ liệu liên quan đến album này.',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAlbum.mutate({ albumIds: album.id.toString(), accessToken: user.accessToken });
      }
    });
  };
  const handleDeleteMany = () => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn ${selectedRowKeys.length} album!`,
      text: 'Điều này có thể sẽ xóa đi các dữ liệu liên quan đến album này.',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAlbum.mutate({
          albumIds: selectedRowKeys.join(','),
          accessToken: user.accessToken,
        });
      }
    });
  };
  useEffect(() => {
    if (updateTrashAlbum.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`album đã được khôi phục!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTrashAlbum.isSuccess]);
  useEffect(() => {
    if (deleteAlbum.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã xóa thành công!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [deleteAlbum.isSuccess]);
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
        title={'Quản lý album (Thùng rác)'}
        icon={<BsJournalAlbum />}
        onCreate={handleRestoreMany}
        onDelete={handleDeleteMany}
      />
      <Table
        pagination={{
          current: currentPage,
          pageSize: 5,
          total: albums.data?.data.count,
          onChange,
        }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
      />
    </Flex>
  );
}
export default AlbumTrash;
