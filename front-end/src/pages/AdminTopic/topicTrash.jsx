import { Button, Flex, Image, Table } from 'antd';
import { MdOutlineReplay, MdOutlineTopic } from 'react-icons/md';
import { useUserStore } from '../../store';
import TitleAdmin from '../../components/titleAdmin';
import { useEffect, useState } from 'react';
import { useGetAllTopic } from '../../hook';
import { GoTrash } from 'react-icons/go';
import { useDeleteTopic, useUpdateTrashTopic } from '../../mutationHook/topic';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';

function TopicTrash() {
  const user = useUserStore((state) => state.user);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const topic = useGetAllTopic(10, currentPage - 1, 1, searchValue);
  const updateTrashTopic = useUpdateTrashTopic();
  const deleteTopic = useDeleteTopic();
  const columns = [
    {
      title: 'Tên chủ đề',
      dataIndex: 'name',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: 290,
      fixed: 'right',
    },
  ];
  const dataSource = topic.data?.data.rows.map((item) => {
    return {
      key: item.id,
      name: item.name,
      image: (
        <Image
          height={64}
          width={140}
          className="rounded-[4px] object-cover"
          src={`${import.meta.env.VITE_API_FILE_URL}/${item.image}`}
        />
      ),
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
  const handleSearch = (value) => {
    setSearchValue(value);
  };
  const handleRestore = (topic) => {
    Swal.fire({
      title: `Xác nhận khôi phục chủ đề ${topic.name}!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashTopic.mutate({ topicIds: topic.id.toString(), accessToken: user.accessToken, trash: false });
      }
    });
  };
  const handleRestoreMany = () => {
    Swal.fire({
      title: `Xác nhận khôi phục lại ${selectedRowKeys.length} chủ đề!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashTopic.mutate({ topicIds: selectedRowKeys.join(','), accessToken: user.accessToken, trash: false });
      }
    });
  };
  const handleDelete = (topic) => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn chủ đề ${topic.name}!`,
      text: 'Điều này có thể sẽ xóa đi các dữ liệu liên quan đến chủ đề này.',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTopic.mutate({ topicIds: topic.id.toString(), accessToken: user.accessToken });
      }
    });
  };
  const handleDeleteMany = () => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn ${selectedRowKeys.length} chủ đề!`,
      text: 'Điều này có thể sẽ xóa đi các dữ liệu liên quan đến chủ đề này.',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTopic.mutate({
          topicIds: selectedRowKeys.join(','),
          accessToken: user.accessToken,
        });
      }
    });
  };
  useEffect(() => {
    if (updateTrashTopic.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Chủ đề đã được khôi phục!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTrashTopic.isSuccess]);
  useEffect(() => {
    if (deleteTopic.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã xóa thành công!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [deleteTopic.isSuccess]);
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
        search
        placeholderSearch={'Tìm kiếm chủ đề'}
        trash
        disabled={selectedRowKeys.length === 0}
        title={'Quản lý chủ đề (Thùng rác)'}
        icon={<MdOutlineTopic />}
        onCreate={handleRestoreMany}
        onDelete={handleDeleteMany}
        onSearch={handleSearch}
      />
      <Table
        scroll={{
          y: topic.data?.data.count > 5 ? 'calc(100vh - 270px)' : null,
        }}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: topic.data?.data.count,
          onChange,
        }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        loading={topic.isLoading}
      />
    </Flex>
  );
}
export default TopicTrash;
