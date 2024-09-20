import { Button, Flex, Form, Image, Input, Switch, Table } from 'antd';
import TitleAdmin from '../../components/titleAdmin';
import { GoTrash } from 'react-icons/go';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import { useGetSlider } from '../../hook';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineTopic } from 'react-icons/md';
import { useUpdateTopic, useUpdateTrashTopic } from '../../mutationHook/topic';
import ModalCreate from '../../components/Modal/modalCreate';
import { useUserStore } from '../../store';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useCreateSlider, useUpdateSlider, useUpdateTrashSlider } from '../../mutationHook/slider';
import { TfiLayoutSliderAlt } from 'react-icons/tfi';

function AdminSlider() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = useUserStore((state) => state.user);
  const [imgUpload, setImgUpload] = useState();
  const inputRef = useRef(null);
  const [image, setImage] = useState();
  const [status, setStatus] = useState(true);
  const [item, setItem] = useState();
  const [option, setOption] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkImage, setCheckImage] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const slider = useGetSlider(5, currentPage - 1, false, null);
  const createSlider = useCreateSlider();
  const updateSlider = useUpdateSlider();
  const updateTrashSlider = useUpdateTrashSlider();
  const trashSlider = useGetSlider(null, null, 1, null);
  const columns = [
    {
      title: 'Đường dẫn',
      dataIndex: 'link',
      width: '30%',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      width: '50%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: '50%',
      render: (status) => `${status ? 'Hiển thị' : 'Không hiển thị'}`,
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: '20%',
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
  const handleOpenUpdate = (slider) => {
    setItem(slider);
    setImage();
    setOption(2);
    setIsModalOpen(true);
    setImgUpload(`${import.meta.env.VITE_API_FILE_URL}/${slider.image}`);
  };
  const handleTrash = (slider) => {
    Swal.fire({
      title: `Chuyển slider này vào thùng rác!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashSlider.mutate({ sliderIds: slider.id.toString(), accessToken: user.accessToken, trash: true });
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
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImgUpload(URL.createObjectURL(file));
      setCheckImage(false);
    }
  };
  const handleCreate = () => {
    setIsModalOpen(true);
    setImgUpload();
    setImage();
    setOption(1);
    setItem({});
  };
  const handleTrashMany = () => {
    if (selectedRowKeys.length > 0) {
      Swal.fire({
        title: `Chuyển ${selectedRowKeys.length} slider vào thùng rác!`,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
        customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
      }).then((result) => {
        if (result.isConfirmed) {
          updateTrashSlider.mutate({
            sliderIds: selectedRowKeys.join(','),
            accessToken: user.accessToken,
            trash: true,
          });
        }
      });
    } else navigate('/dashboard/slider/trash');
  };
  useEffect(() => {
    if (createSlider.isSuccess) {
      if (createSlider.data?.status === 'SUCCESS') {
        setIsModalOpen(false);
        form.resetFields();
        setImgUpload();
        toast.success(`Thêm mới slider thành công!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      }
    }
  }, [createSlider.isSuccess]);
  useEffect(() => {
    if (updateSlider.isSuccess) {
      setIsModalOpen(false);
      form.resetFields();
      setImgUpload();
      toast.success(`Cập nhật slider thành công!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateSlider.isSuccess]);
  useEffect(() => {
    if (updateTrashSlider.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã chuyển vào thùng rác!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTrashSlider.isSuccess]);
  const onFinish = (data) => {
    if (option === 1) {
      if (image) {
        const formData = new FormData();
        formData.append('link', data.link);
        formData.append('status', status);
        formData.append('image', image);
        formData.append('accessToken', user.accessToken);
        createSlider.mutate(formData);
      } else setCheckImage(true);
    } else if (option === 2) {
      const formData = new FormData();
      formData.append('id', item.id);
      formData.append('link', data.link);
      formData.append('status', status);
      if (image) formData.append('image', image);
      formData.append('accessToken', user.accessToken);
      updateSlider.mutate(formData);
    }
  };
  useEffect(() => {
    form.setFieldValue('link', item?.link);
    form.setFieldValue('status', item?.status);
  }, [item]);
  useEffect(() => {
    return () => URL.revokeObjectURL(imgUpload);
  }, [imgUpload]);
  return (
    <>
      <Flex gap="middle" vertical>
        <TitleAdmin
          title={'Quản lý slider'}
          icon={<TfiLayoutSliderAlt />}
          onCreate={handleCreate}
          onDelete={handleTrashMany}
          number={trashSlider.data?.count}
        />
        <Table
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: slider.data?.count,
            onChange,
          }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
        />
      </Flex>
      <ModalCreate
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        title={option === 1 ? 'Thêm mới slider' : 'Cập nhật slider'}
        isModalOpen={isModalOpen}
        formId={'slider'}
        btnText={option === 1 ? 'Thêm mới' : 'Cập nhật'}
      >
        <Form
          form={form}
          onFinish={onFinish}
          id="slider"
          labelCol={{
            span: 5,
          }}
          initialValues={item}
        >
          <Form.Item
            label="Link slider"
            name="link"
            rules={[{ required: true, message: 'Hãy nhập đường dẫn cho slider' }]}
          >
            <Input type="text" placeholder="Đường dẫn slider" />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status">
            <div className="flex items-center gap-6">
              <Switch checked={status} onChange={(value) => setStatus(value)} />
              <p>{status ? 'Hiển thị' : 'Không hiển thị'}</p>
            </div>
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <input type="file" id="file" ref={inputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
            <div className="flex flex-col gap-[8px]">
              <Button icon={<UploadOutlined />} onClick={() => inputRef.current.click()}>
                Click to Upload
              </Button>
              {checkImage && <p className="text-text-err">Hãy chọn hình ảnh cho slider</p>}
              {imgUpload && <Image src={imgUpload} alt="" height={90} className="w-[40%] object-cover block" />}
            </div>
          </Form.Item>
        </Form>
      </ModalCreate>
    </>
  );
}
export default AdminSlider;
