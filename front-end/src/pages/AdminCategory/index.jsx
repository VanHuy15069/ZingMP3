import React, { useEffect, useRef, useState } from 'react';
import { Button, Flex, Form, Image, Input, Table } from 'antd';
import { useGetAllCategory } from '../../hook';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import { GoTrash } from 'react-icons/go';
import TitleAdmin from '../../components/titleAdmin';
import { TbCategoryPlus } from 'react-icons/tb';
import ModalCreate from '../../components/Modal/modalCreate';
import { useCreateCategory, useUpdateCategory, useUpdateTrashCategory } from '../../mutationHook/category';
import { useUserStore } from '../../store';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function AdminCategory() {
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
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = useUserStore((state) => state.user);
  const inputRef = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imgUpload, setImgUpload] = useState();
  const [image, setImage] = useState();
  const [searchValue, setSearchValue] = useState('');
  const category = useGetAllCategory(10, currentPage - 1, false, searchValue);
  const trash = useGetAllCategory(null, null, 1, null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const updateTrashCategory = useUpdateTrashCategory();
  const [checkImage, setCheckImage] = useState(false);
  const [option, setOption] = useState(1);
  const [item, setItem] = useState();

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
  const handleSearch = (value) => {
    setSearchValue(value);
  };
  const handleCreate = () => {
    setIsModalOpen(true);
    setImgUpload();
    setImage();
    setOption(1);
    setItem({});
    form.resetFields();
  };
  const handleOpenUpdate = (category) => {
    setItem(category);
    setOption(2);
    setImage();
    setIsModalOpen(true);
    setImgUpload(`${import.meta.env.VITE_API_FILE_URL}/${category.image}`);
  };
  const handleTrash = (category) => {
    Swal.fire({
      title: `Chuyển thể loại ${category.name} vào thùng rác!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashCategory.mutate({ categoryIds: category.id.toString(), accessToken: user.accessToken, trash: true });
      }
    });
  };
  useEffect(() => {
    return () => URL.revokeObjectURL(imgUpload);
  }, [imgUpload]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  useEffect(() => {
    if (category.isError) {
      toast.error(`505! Server Error!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [category.isError]);
  useEffect(() => {
    if (createCategory.isSuccess) {
      if (createCategory.data?.status === 'SUCCESS') {
        setIsModalOpen(false);
        form.resetFields();
        setImgUpload();
        toast.success(`Thêm mới thể loại thành công!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      } else {
        toast.error(`Thể loại nhạc đã tồn tại trên hệ thống!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      }
    } else if (createCategory.isError) {
      toast.error(`505! Server Error!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [createCategory.isSuccess, createCategory.isError]);
  useEffect(() => {
    if (updateCategory.isSuccess) {
      setIsModalOpen(false);
      form.resetFields();
      setImgUpload();
      toast.success(`Cập nhật thể loại thành công!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    } else if (updateCategory.isError) {
      toast.error(`505! Server Error!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateCategory.isSuccess, updateCategory.isError]);
  useEffect(() => {
    if (updateTrashCategory.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã chuyển vào thùng rác!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    } else if (updateTrashCategory.isError) {
      toast.error(`505! Server Error!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTrashCategory.isSuccess, updateTrashCategory.isError]);

  useEffect(() => {
    form.setFieldValue('name', item?.name);
  }, [item]);
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImgUpload(URL.createObjectURL(file));
      setCheckImage(false);
    }
  };
  const handleDelete = () => {
    if (selectedRowKeys.length > 0) {
      Swal.fire({
        title: `Chuyển ${selectedRowKeys.length} thể loại vào thùng rác!`,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
        customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
      }).then((result) => {
        if (result.isConfirmed) {
          updateTrashCategory.mutate({
            categoryIds: selectedRowKeys.join(','),
            accessToken: user.accessToken,
            trash: true,
          });
        }
      });
    } else navigate('/dashboard/category/trash');
  };
  const onFinish = (data) => {
    if (option === 1) {
      if (image) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('image', image);
        formData.append('accessToken', user.accessToken);
        createCategory.mutate(formData);
      } else setCheckImage(true);
    } else if (option === 2) {
      const formData = new FormData();
      formData.append('id', item.id);
      formData.append('name', data.name);
      formData.append('accessToken', user.accessToken);
      if (image) formData.append('image', image);
      updateCategory.mutate(formData);
    }
  };
  const onChange = (currentPage) => {
    setCurrentPage(currentPage);
  };

  return (
    <>
      <Flex gap="middle" vertical>
        <TitleAdmin
          search
          placeholderSearch={'Tìm kiếm thể loại'}
          title={'Quản lý thể loại'}
          icon={<TbCategoryPlus />}
          onCreate={handleCreate}
          onDelete={handleDelete}
          onSearch={handleSearch}
          number={trash.data?.data.count}
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
          className="flex flex-col justify-start"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          loading={category.isLoading}
        />
      </Flex>
      <ModalCreate
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        title={option === 1 ? 'Thêm mới thể loại' : 'Cập nhật thể loại'}
        isModalOpen={isModalOpen}
        formId={'createCategory'}
        btnText={option === 1 ? 'Thêm mới' : 'Cập nhật'}
        loading={createCategory.isPending || updateCategory.isPending}
      >
        <Form
          form={form}
          onFinish={onFinish}
          id="createCategory"
          labelCol={{
            span: 5,
          }}
          initialValues={item}
        >
          <Form.Item label="Tên thể loại" name="name" rules={[{ required: true, message: 'Hãy nhập tên thể loại' }]}>
            <Input type="text" placeholder="Tên thể loại" />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <input type="file" id="file" ref={inputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
            <div className="flex flex-col gap-[8px]">
              <Button icon={<UploadOutlined />} onClick={() => inputRef.current.click()}>
                Click to Upload
              </Button>
              {checkImage && <p className="text-text-err">Hãy chọn hình ảnh cho thể loại</p>}
              {imgUpload && <Image src={imgUpload} alt="" height={90} className="w-[40%] object-cover block" />}
            </div>
          </Form.Item>
        </Form>
      </ModalCreate>
    </>
  );
}

export default AdminCategory;
