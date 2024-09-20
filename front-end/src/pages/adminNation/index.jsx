import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Image, Input, Table } from 'antd';
import { GoTrash } from 'react-icons/go';
import { useGetAllNation } from '../../hook';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import { useEffect, useRef, useState } from 'react';
import { IoEarthOutline } from 'react-icons/io5';
import TitleAdmin from '../../components/titleAdmin';
import ModalCreate from '../../components/Modal/modalCreate';
import { useCreateNation, useUpdateNation, useUpdateTrashNation } from '../../mutationHook/nation';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';

function AdminNation() {
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
  const nation = useGetAllNation(5, currentPage - 1, false);
  const trash = useGetAllNation(null, null, 1);
  const createNation = useCreateNation();
  const updateNation = useUpdateNation();
  const updateTrashNation = useUpdateTrashNation();
  const columns = [
    {
      title: 'Tên quốc gia',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      width: '50%',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: '20%',
    },
  ];
  const dataSource = nation.data?.data.rows.map((item) => {
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
    setOption(1);
    setImage();
    setItem({});
  };
  const handleOpenUpdate = (nation) => {
    setItem(nation);
    setOption(2);
    setImage();
    setIsModalOpen(true);
    setImgUpload(`${import.meta.env.VITE_API_FILE_URL}/${nation.image}`);
  };
  const handleTrash = (nation) => {
    Swal.fire({
      title: `Chuyển quốc gia ${nation.name} vào thùng rác!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashNation.mutate({ nationIds: nation.id.toString(), accessToken: user.accessToken, trash: true });
      }
    });
  };
  const handleTrashMany = () => {
    if (selectedRowKeys.length > 0) {
      Swal.fire({
        title: `Chuyển ${selectedRowKeys.length} quốc gia vào thùng rác!`,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
        customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
      }).then((result) => {
        if (result.isConfirmed) {
          updateTrashNation.mutate({
            nationIds: selectedRowKeys.join(','),
            accessToken: user.accessToken,
            trash: true,
          });
        }
      });
    } else navigate('/dashboard/nation/trash');
  };
  useEffect(() => {
    if (createNation.isSuccess) {
      if (createNation.data?.status === 'SUCCESS') {
        setIsModalOpen(false);
        form.resetFields();
        setImgUpload();
        toast.success(`Thêm mới quốc thành công!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      } else {
        setIsModalOpen(false);
        toast.error(`Quốc gia đã tồn tại trên hệ thống!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      }
    }
  }, [createNation.isSuccess]);
  useEffect(() => {
    if (updateNation.isSuccess) {
      setIsModalOpen(false);
      form.resetFields();
      setImgUpload();
      toast.success(`Cập nhật quốc gia thành công!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateNation.isSuccess]);
  useEffect(() => {
    if (updateTrashNation.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã chuyển vào thùng rác!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTrashNation.isSuccess]);
  const onFinish = (data) => {
    if (option === 1) {
      if (image) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('image', image);
        formData.append('accessToken', user.accessToken);
        createNation.mutate(formData);
      } else setCheckImage(true);
    } else if (option === 2) {
      const formData = new FormData();
      formData.append('id', item.id);
      formData.append('name', data.name);
      if (image) formData.append('image', image);
      formData.append('accessToken', user.accessToken);
      updateNation.mutate(formData);
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
          title={'Quản lý quốc gia'}
          icon={<IoEarthOutline />}
          onCreate={handleCreate}
          onDelete={handleTrashMany}
          number={trash.data?.data.count}
        />
        <Table
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: nation.data?.data.count,
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
        title={option === 1 ? 'Thêm mới quốc gia' : 'Cập nhật quốc gia'}
        isModalOpen={isModalOpen}
        formId={'nation'}
        btnText={option === 1 ? 'Thêm mới' : 'Cập nhật'}
      >
        <Form
          form={form}
          onFinish={onFinish}
          id="nation"
          labelCol={{
            span: 5,
          }}
          initialValues={item}
        >
          <Form.Item label="Tên quốc gia" name="name" rules={[{ required: true, message: 'Hãy nhập tên quốc gia' }]}>
            <Input type="text" placeholder="Tên quốc gia" />
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
export default AdminNation;
