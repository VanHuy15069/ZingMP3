import { Button, Flex, Table } from 'antd';
import { useEffect, useState } from 'react';
import { GoTrash } from 'react-icons/go';
import { MdOutlineReplay } from 'react-icons/md';
import { TbCategoryPlus } from 'react-icons/tb';
import { useGetAllCategory } from '../../hook';
import TitleAdmin from '../../components/titleAdmin';
import { useDeleteCategory, useUpdateTrashCategory } from '../../mutationHook/category';
import Swal from 'sweetalert2';
import { useUserStore } from '../../store';
import { Bounce, toast } from 'react-toastify';

function CategoryTrash() {
  const user = useUserStore((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const category = useGetAllCategory(10, currentPage - 1, 1, searchValue);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const updateTrashCategory = useUpdateTrashCategory();
  const deleteCategory = useDeleteCategory();
  const columns = [
    {
      title: 'Tên thể loại',
      dataIndex: 'name',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      align: 'center',
      width: 290,
      fixed: 'right',
    },
  ];
  const dataSource = category.data?.data.rows.map((item) => {
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
    setCurrentPage(1);
    setSearchValue(value);
  };
  const handleRestore = (item) => {
    Swal.fire({
      title: `Xác nhận khôi phục thể loại nhạc ${category.name}!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashCategory.mutate({ categoryIds: item.id.toString(), accessToken: user.accessToken, trash: false });
      }
    });
  };
  const handleDelete = (item) => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn thể loại nhạc ${item.name}!`,
      text: 'Điều này có thể sẽ xóa đi các dữ liệu liên quan đến thể loại nhạc này.',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategory.mutate({ categoryIds: item.id.toString(), accessToken: user.accessToken });
      }
    });
  };
  useEffect(() => {
    if (category.isError) {
      toast.error(`505! Server Error!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [category.isError]);
  useEffect(() => {
    if (updateTrashCategory.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã khôi phục lại thể loại nhạc!`, {
        draggable: true,
        transition: Bounce,
      });
    } else if (updateTrashCategory.isError) {
      toast.error(`505! Server Error!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTrashCategory.isSuccess, updateTrashCategory.isError]);
  useEffect(() => {
    if (deleteCategory.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã xóa thành công!`, {
        draggable: true,
        transition: Bounce,
      });
    } else if (deleteCategory.isError) {
      toast.error(`505! Server Error!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [deleteCategory.isSuccess, deleteCategory.isError]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const handleRestoreMany = () => {
    Swal.fire({
      title: `Xác nhận khôi phục lại ${selectedRowKeys.length} thể loại nhạc!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashCategory.mutate({
          categoryIds: selectedRowKeys.join(','),
          accessToken: user.accessToken,
          trash: false,
        });
      }
    });
  };
  const handleDeleteMany = () => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn ${selectedRowKeys.length} thể loại nhạc!`,
      text: 'Điều này có thể sẽ xóa đi các dữ liệu liên quan đến thể loại nhạc này.',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategory.mutate({
          categoryIds: selectedRowKeys.join(','),
          accessToken: user.accessToken,
        });
      }
    });
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
        placeholderSearch={'Tìm kiếm thể loại'}
        trash
        disabled={selectedRowKeys.length === 0}
        title={'Quản lý thể loại (Thùng rác)'}
        icon={<TbCategoryPlus />}
        onCreate={handleRestoreMany}
        onDelete={handleDeleteMany}
        onSearch={handleSearch}
      />
      <Table
        scroll={{
          y: category.data?.data.count > 5 ? 'calc(100vh - 270px)' : null,
        }}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: category.data?.data.count,
          onChange,
        }}
        className="flex flex-col justify-between"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        loading={category.isLoading}
      />
    </Flex>
  );
}

export default CategoryTrash;
