import { Button, Flex, Image, Table } from 'antd';
import { MdOutlineReplay, MdOutlineTopic } from 'react-icons/md';
import { useUserStore } from '../../store';
import TitleAdmin from '../../components/titleAdmin';
import { useEffect, useState } from 'react';
import { useGetAllTopic, useGetSlider } from '../../hook';
import { GoTrash } from 'react-icons/go';
import { useDeleteTopic } from '../../mutationHook/topic';
import { TfiLayoutSliderAlt } from 'react-icons/tfi';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useDeleteSlider, useUpdateTrashSlider } from '../../mutationHook/slider';

function SliderTrash() {
  const user = useUserStore((state) => state.user);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const slider = useGetSlider(10, currentPage - 1, 1, null);
  const updateTrashSlider = useUpdateTrashSlider();
  const deleteSlider = useDeleteSlider();
  const columns = [
    {
      title: 'Đường dẫn',
      dataIndex: 'link',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => `${status ? 'Hiển thị' : 'Không hiển thị'}`,
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: 290,
      fixed: 'right',
    },
  ];
  const dataSource = slider.data?.data.map((item) => {
    return {
      key: item.id,
      link: item.link,
      image: (
        <Image
          height={64}
          width={140}
          className="rounded-[4px] object-cover"
          src={`${import.meta.env.VITE_API_FILE_URL}/${item.image}`}
        />
      ),
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
  const handleRestore = (slider) => {
    Swal.fire({
      title: `Xác nhận khôi phục slider này!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashSlider.mutate({ sliderIds: slider.id.toString(), accessToken: user.accessToken, trash: false });
      }
    });
  };
  const handleRestoreMany = () => {
    Swal.fire({
      title: `Xác nhận khôi phục lại ${selectedRowKeys.length} slider!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashSlider.mutate({ sliderIds: selectedRowKeys.join(','), accessToken: user.accessToken, trash: false });
      }
    });
  };
  const handleDelete = (slider) => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn slider này!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSlider.mutate({ sliderIds: slider.id.toString(), accessToken: user.accessToken });
      }
    });
  };
  const handleDeleteMany = () => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn ${selectedRowKeys.length} slider!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSlider.mutate({
          sliderIds: selectedRowKeys.join(','),
          accessToken: user.accessToken,
        });
      }
    });
  };
  useEffect(() => {
    if (slider.isError || updateTrashSlider.isError || deleteSlider.isError) {
      toast.error(`505! Server Error!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [slider.isError, deleteSlider.isError, updateTrashSlider.isError]);
  useEffect(() => {
    if (updateTrashSlider.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Slider đã được khôi phục!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTrashSlider.isSuccess]);
  useEffect(() => {
    if (deleteSlider.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã xóa thành công!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [deleteSlider.isSuccess]);
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
        title={'Quản lý slider (Thùng rác)'}
        icon={<TfiLayoutSliderAlt />}
        onCreate={handleRestoreMany}
        onDelete={handleDeleteMany}
      />
      <Table
        scroll={{
          y: slider.data?.count > 5 ? 'calc(100vh - 270px)' : null,
        }}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: slider.data?.count,
          onChange,
        }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        loading={slider.isLoading}
      />
    </Flex>
  );
}
export default SliderTrash;
