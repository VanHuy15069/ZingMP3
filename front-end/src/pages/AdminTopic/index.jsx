import { Button, Flex, Form, Image, Input, Table } from 'antd';
import TitleAdmin from '../../components/titleAdmin';
import { GoTrash } from 'react-icons/go';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import { useGetAllTopic } from '../../hook';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineTopic } from 'react-icons/md';
import { useCreateTopic, useUpdateTopic, useUpdateTrashTopic } from '../../mutationHook/topic';
import ModalCreate from '../../components/Modal/modalCreate';
import { useUserStore } from '../../store';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function AdminTopic() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = useUserStore((state) => state.user);
  const [imgUpload, setImgUpload] = useState();
  const inputRef = useRef(null);
  const [image, setImage] = useState();
  const [item, setItem] = useState();
  const [option, setOption] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkImage, setCheckImage] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const topic = useGetAllTopic(10, currentPage - 1, false, searchValue);
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();
  const updateTrashTopic = useUpdateTrashTopic();
  const trashTopic = useGetAllTopic(null, null, 1);
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
  const handleOpenUpdate = (topic) => {
    setItem(topic);
    setImage();
    setOption(2);
    setIsModalOpen(true);
    setImgUpload(`${import.meta.env.VITE_API_FILE_URL}/${topic.image}`);
  };
  const handleTrash = (topic) => {
    Swal.fire({
      title: `Chuyển chủ đề ${topic.name} vào thùng rác!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashTopic.mutate({ topicIds: topic.id.toString(), accessToken: user.accessToken, trash: true });
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
  const handleSearch = (value) => {
    setSearchValue(value);
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
        title: `Chuyển ${selectedRowKeys.length} chủ đề vào thùng rác!`,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
        customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
      }).then((result) => {
        if (result.isConfirmed) {
          updateTrashTopic.mutate({ topicIds: selectedRowKeys.join(','), accessToken: user.accessToken, trash: true });
        }
      });
    } else navigate('/dashboard/topic/trash');
  };
  useEffect(() => {
    if (topic.isError || createTopic.isError || updateTopic.isError || updateTrashTopic.isError) {
      toast.error(`505! Server Error!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [topic.isError, createTopic.isError, updateTopic.isError, updateTrashTopic.isError]);
  useEffect(() => {
    if (createTopic.isSuccess) {
      if (createTopic.data?.status === 'SUCCESS') {
        setIsModalOpen(false);
        form.resetFields();
        setImgUpload();
        toast.success(`Thêm mới chủ đề thành công!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      } else {
        setIsModalOpen(false);
        toast.error(`Chủ đề đã tồn tại trên hệ thống!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      }
    }
  }, [createTopic.isSuccess]);
  useEffect(() => {
    if (updateTopic.isSuccess) {
      setIsModalOpen(false);
      form.resetFields();
      setImgUpload();
      toast.success(`Cập nhật chủ đề thành công!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTopic.isSuccess]);
  useEffect(() => {
    if (updateTrashTopic.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã chuyển vào thùng rác!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTrashTopic.isSuccess]);
  const onFinish = (data) => {
    if (option === 1) {
      if (image) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('image', image);
        formData.append('accessToken', user.accessToken);
        createTopic.mutate(formData);
      } else setCheckImage(true);
    } else if (option === 2) {
      const formData = new FormData();
      formData.append('id', item.id);
      formData.append('name', data.name);
      if (image) formData.append('image', image);
      formData.append('accessToken', user.accessToken);
      updateTopic.mutate(formData);
    }
  };
  useEffect(() => {
    form.setFieldValue('name', item?.name);
  }, [item]);
  useEffect(() => {
    return () => URL.revokeObjectURL(imgUpload);
  }, [imgUpload]);
  return (
    <>
      <Flex gap="middle" vertical>
        <TitleAdmin
          search
          placeholderSearch={'Tìm kiếm chủ đề'}
          title={'Quản lý chủ đề'}
          icon={<MdOutlineTopic />}
          onCreate={handleCreate}
          onDelete={handleTrashMany}
          onSearch={handleSearch}
          number={trashTopic.data?.data.count}
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
      <ModalCreate
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        title={option === 1 ? 'Thêm mới chủ đề' : 'Cập nhật chủ đề'}
        isModalOpen={isModalOpen}
        formId={'topic'}
        btnText={option === 1 ? 'Thêm mới' : 'Cập nhật'}
        loading={createTopic.isPending || updateTopic.isPending}
      >
        <Form
          form={form}
          onFinish={onFinish}
          id="topic"
          labelCol={{
            span: 5,
          }}
          initialValues={item}
        >
          <Form.Item label="Tên chủ đề" name="name" rules={[{ required: true, message: 'Hãy nhập tên chủ đề' }]}>
            <Input type="text" placeholder="Tên chủ đề" />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <input type="file" id="file" ref={inputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
            <div className="flex flex-col gap-[8px]">
              <Button icon={<UploadOutlined />} onClick={() => inputRef.current.click()}>
                Click to Upload
              </Button>
              {checkImage && <p className="text-text-err">Hãy chọn hình ảnh cho quốc gia</p>}
              {imgUpload && <Image src={imgUpload} alt="" height={90} className="w-[40%] object-cover block" />}
            </div>
          </Form.Item>
        </Form>
      </ModalCreate>
    </>
  );
}
export default AdminTopic;
