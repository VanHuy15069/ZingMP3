import { Avatar, Button, Flex, Form, Image, Input, Table } from 'antd';
import TitleAdmin from '../../components/titleAdmin';
import { GoTrash } from 'react-icons/go';
import { EditOutlined, FileImageOutlined, UploadOutlined } from '@ant-design/icons';
import { useGetAllAlbumBySingerId } from '../../hook';
import { useEffect, useRef, useState } from 'react';
import ModalCreate from '../../components/Modal/modalCreate';
import { useUserStore } from '../../store';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useCreateAlbum, useUpdateAlbum, useUpdateTrashAlbum } from '../../mutationHook/album';
import { BsJournalAlbum } from 'react-icons/bs';

function SingerAlbum() {
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
  const [searchValue, setSearchValue] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const albums = useGetAllAlbumBySingerId(user.id, 10, currentPage - 1, searchValue, false, user.accessToken);
  const createAlbum = useCreateAlbum();
  const updateAlbum = useUpdateAlbum();
  const updateTrashAlbum = useUpdateTrashAlbum();
  const trashAlbum = useGetAllAlbumBySingerId(user.id, null, null, null, 1, user.accessToken);
  const columns = [
    {
      title: 'Tên album',
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
  const handleOpenUpdate = (album) => {
    setItem(album);
    setImage();
    setOption(2);
    setIsModalOpen(true);
    setImgUpload(`${import.meta.env.VITE_API_FILE_URL}/${album.image}`);
  };
  const handleTrash = (album) => {
    Swal.fire({
      title: `Chuyển album ${album.name} vào thùng rác!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashAlbum.mutate({ albumIds: album.id.toString(), accessToken: user.accessToken, trash: true });
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
        title: `Chuyển ${selectedRowKeys.length} album vào thùng rác!`,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
        customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
      }).then((result) => {
        if (result.isConfirmed) {
          updateTrashAlbum.mutate({ albumIds: selectedRowKeys.join(','), accessToken: user.accessToken, trash: true });
        }
      });
    } else navigate('/dashboard/singer/album/trash');
  };
  const handleSearch = (value) => {
    setSearchValue(value);
  };
  useEffect(() => {
    if (albums.isError || createAlbum.isError || updateAlbum.isError || updateTrashAlbum.isError) {
      toast.error(`505! Server Error!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [albums.isError, createAlbum.isError, updateAlbum.isError, updateTrashAlbum.isError]);
  useEffect(() => {
    if (createAlbum.isSuccess) {
      if (createAlbum.data?.status === 'SUCCESS') {
        setIsModalOpen(false);
        form.resetFields();
        setImgUpload();
        toast.success(`Thêm mới album thành công!`, {
          draggable: true,
          transition: Bounce,
        });
      } else {
        setIsModalOpen(false);
        toast.error(`album đã tồn tại trên hệ thống!`, {
          draggable: true,
          transition: Bounce,
        });
      }
    }
  }, [createAlbum.isSuccess]);
  useEffect(() => {
    if (updateAlbum.isSuccess) {
      setIsModalOpen(false);
      form.resetFields();
      setImgUpload();
      toast.success(`Cập nhật album thành công!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateAlbum.isSuccess]);
  useEffect(() => {
    if (updateTrashAlbum.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã chuyển vào thùng rác!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTrashAlbum.isSuccess]);
  const onFinish = (data) => {
    if (option === 1) {
      if (image) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('image', image);
        formData.append('singerId', user.id);
        formData.append('accessToken', user.accessToken);
        createAlbum.mutate(formData);
      } else setCheckImage(true);
    } else if (option === 2) {
      const formData = new FormData();
      formData.append('id', item.id);
      formData.append('name', data.name);
      formData.append('singerId', user.id);
      if (image) formData.append('image', image);
      formData.append('accessToken', user.accessToken);
      updateAlbum.mutate(formData);
    }
  };
  useEffect(() => {
    form.setFieldValue('name', item?.name);
    form.setFieldValue('singerId', item?.singerId);
  }, [item]);
  useEffect(() => {
    return () => URL.revokeObjectURL(imgUpload);
  }, [imgUpload]);
  return (
    <>
      <Flex gap="middle" vertical>
        <TitleAdmin
          search
          placeholderSearch={'Tìm kiếm album'}
          title={'Quản lý album'}
          icon={<BsJournalAlbum />}
          onCreate={handleCreate}
          onDelete={handleTrashMany}
          onSearch={handleSearch}
          number={trashAlbum.data?.data.count}
        />
        <Table
          scroll={{
            y: albums.data?.data.count > 5 ? 'calc(100vh - 270px)' : null,
          }}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: albums.data?.data.count,
            onChange,
          }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          loading={albums.isLoading}
        />
      </Flex>
      <ModalCreate
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        title={option === 1 ? 'Thêm mới album' : 'Cập nhật album'}
        isModalOpen={isModalOpen}
        formId={'album'}
        btnText={option === 1 ? 'Thêm mới' : 'Cập nhật'}
        loading={createAlbum.isPending || updateAlbum.isPending}
      >
        <Form
          form={form}
          onFinish={onFinish}
          id="album"
          labelCol={{
            span: 5,
          }}
          initialValues={item}
        >
          <Form.Item label="Tên album" name="name" rules={[{ required: true, message: 'Hãy nhập tên album' }]}>
            <Input type="text" placeholder="Tên album" />
          </Form.Item>
          <Form.Item label="Hình ảnh" className="form-image">
            <input type="file" id="file" ref={inputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
            <div className="flex items-center gap-[18px]">
              <Button icon={<UploadOutlined />} className="w-1/2" onClick={() => inputRef.current.click()}>
                Click to Upload
              </Button>
              {checkImage && <p className="text-text-err">Hãy chọn hình ảnh cho album</p>}
              {imgUpload ? (
                <Image src={imgUpload} alt="" height={90} width={90} className="object-cover block rounded-[8px]" />
              ) : (
                <Avatar shape="square" size={90} icon={<FileImageOutlined />} />
              )}
            </div>
          </Form.Item>
        </Form>
      </ModalCreate>
    </>
  );
}
export default SingerAlbum;
