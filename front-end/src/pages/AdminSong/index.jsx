import { Button, Flex, Form, Image, Input, Select, Space, Switch, Table } from 'antd';
import TitleAdmin from '../../components/titleAdmin';
import { LuListMusic } from 'react-icons/lu';
import {
  useGetAlbumsBySinger,
  useGetAllCategory,
  useGetAllNation,
  useGetAllSingers,
  useGetAllSongs,
  useGetAllTopic,
} from '../../hook';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import { GoTrash } from 'react-icons/go';
import { useEffect, useRef, useState } from 'react';
import ModalCreate from '../../components/Modal/modalCreate';
import { useUserStore } from '../../store';
import IconBasic from '../../components/IconBasic/IconBasic';
import { useCreateSong, useUpdateSong, useUpdateTrashSong } from '../../mutationHook/song';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function AdminSong() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = useUserStore((state) => state.user);
  const [imgUpload, setImgUpload] = useState();
  const inputRef = useRef(null);
  const songRef = useRef(null);
  const [image, setImage] = useState();
  const [songName, setSongName] = useState();
  const [link, setLink] = useState();
  const [checkImage, setCheckImage] = useState(false);
  const [checkSongName, setCheckSongName] = useState(false);
  const [item, setItem] = useState({});
  const [vip, setVip] = useState(false);
  const [singerIds, setSingerIds] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [option, setOption] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nations = useGetAllNation(null, null, false);
  const categories = useGetAllCategory(null, null, false);
  const topics = useGetAllTopic(null, null, false);
  const singers = useGetAllSingers(null, null, false, null);
  const trash = useGetAllSongs(null, null, null, 'createdAt', 'DESC', 1);
  const albums = useGetAlbumsBySinger(singerIds.join(','), null, null);
  const songs = useGetAllSongs(5, currentPage - 1, null, 'createdAt', 'DESC', false);
  const createSong = useCreateSong();
  const updateSong = useUpdateSong();
  const updateTrashSong = useUpdateTrashSong();
  const optionNations = nations.data?.data.rows.map((nation) => {
    return {
      value: nation.id,
      label: nation.name,
    };
  });
  const optionCategories = categories.data?.data.rows.map((category) => {
    return {
      value: category.id,
      label: category.name,
    };
  });
  const optionTopics = topics.data?.data.rows.map((topic) => {
    return {
      value: topic.id,
      label: topic.name,
    };
  });
  const optionSingers = singers.data?.data.map((singer) => {
    return {
      value: singer.id,
      label: singer.name,
    };
  });
  const optionAlbum = albums.data?.data.map((album) => {
    return {
      value: album.id,
      label: album.name,
    };
  });
  const columns = [
    {
      title: 'Tên bài hát',
      dataIndex: 'name',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      align: 'center',
    },
    {
      title: 'Quốc gia',
      dataIndex: 'nation',
      render: (nation) => `${nation.name}`,
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      render: (category) => `${category.name}`,
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topic',
      render: (topic) => `${topic.name}`,
    },
    {
      title: 'Ca sĩ',
      dataIndex: 'singer',
      render: (singers) => {
        return (
          <div className="flex items-center flex-wrap">
            {singers?.map((item, index) => {
              let isNotLastElement = true;
              if (index === singers.length - 1) isNotLastElement = false;
              return (
                <div key={item.id} className="flex">
                  <p>{item.name}</p>
                  {isNotLastElement && (
                    <p className="tracking-normal ml-[1px]" style={{ wordSpacing: '0.1px' }}>
                      ,&ensp;
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: 'Album',
      dataIndex: 'album',
      render: (album) => `${album ? album.name : ''}`,
    },
    {
      title: 'Lượt nghe',
      dataIndex: 'views',
      align: 'center',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: '1%',
    },
  ];
  const dataSource = songs.data?.data.map((item) => {
    return {
      key: item.id,
      name: <p className={item.vip ? 'text-yellow-500 font-bold' : ''}>{item.name}</p>,
      image: (
        <Image
          height={64}
          width={64}
          className="rounded-[4px] object-cover overflow-hidden"
          src={`${import.meta.env.VITE_API_FILE_URL}/${item.image}`}
        />
      ),
      nation: item.nationInfo,
      topic: item.topicInfo,
      category: item.categoryInfo,
      views: item.views,
      singer: item.singerInfo,
      album: item.albumInfo,
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
  useEffect(() => {
    if (singerIds.length === 0) form.setFieldValue('albumId', null);
  }, [singerIds.length]);
  const handleChangeSinger = (singer) => {
    setSingerIds(singer);
  };
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImgUpload(URL.createObjectURL(file));
      setCheckImage(false);
    }
  };
  const handleSongSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSongName(file.name);
      setLink(file);
      setCheckSongName(false);
    }
  };
  const handleCreate = () => {
    setIsModalOpen(true);
    setImgUpload();
    setImage();
    setLink();
    setSongName();
    setSingerIds([]);
    setOption(1);
    setItem({});
  };
  const handleOpenUpdate = (song) => {
    setItem(song);
    setOption(2);
    setIsModalOpen(true);
    setSingerIds(song?.singerInfo?.map((singer) => singer.id));
    setImgUpload(`${import.meta.env.VITE_API_FILE_URL}/${song.image}`);
    setSongName(song.link);
    setVip(song.vip);
    setImage();
    setLink();
  };
  const handleTrash = (song) => {
    Swal.fire({
      title: `Chuyển bài hát ${song.name} vào thùng rác!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashSong.mutate({ songIds: song.id.toString(), accessToken: user.accessToken, trash: true });
      }
    });
  };
  const handleTrashMany = () => {
    if (selectedRowKeys.length > 0) {
      Swal.fire({
        title: `Chuyển ${selectedRowKeys.length} bài hát vào thùng rác!`,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
        customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
      }).then((result) => {
        if (result.isConfirmed) {
          updateTrashSong.mutate({ songIds: selectedRowKeys.join(','), accessToken: user.accessToken, trash: true });
        }
      });
    } else navigate('/dashboard/song/trash');
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
  useEffect(() => {
    return () => URL.revokeObjectURL(imgUpload);
  }, [imgUpload]);
  useEffect(() => {
    form.setFieldValue('name', item?.name);
    form.setFieldValue('topicId', item?.topicId);
    form.setFieldValue('categoryId', item?.categoryId);
    form.setFieldValue('nationId', item?.nationId);
    form.setFieldValue('albumId', item?.albumId);
    form.setFieldValue('singerIds', singerIds);
  }, [item]);
  useEffect(() => {
    if (createSong.isSuccess) {
      if (createSong.data?.status === 'SUCCESS') {
        setIsModalOpen(false);
        form.resetFields();
        setImgUpload();
        setSongName();
        toast.success(`Thêm mới bài hát thành công!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      } else {
        setIsModalOpen(false);
        toast.error(`Bài hát đã tồn tại trên hệ thống!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      }
    }
  }, [createSong.isSuccess]);
  useEffect(() => {
    if (updateSong.isSuccess) {
      if (updateSong.data?.status === 'SUCCESS') {
        setIsModalOpen(false);
        form.resetFields();
        setImgUpload();
        setSongName();
        setVip(false);
        toast.success(`Cập nhật bài hát thành công!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      } else {
        setIsModalOpen(false);
        form.resetFields();
        setImgUpload();
        setSongName();
        setVip(false);
        toast.error(`Cập nhật bài hát không thành công!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      }
    }
  }, [updateSong.isSuccess]);
  useEffect(() => {
    if (updateTrashSong.isSuccess) {
      if (updateTrashSong.data?.status === 'SUCCESS') {
        setCurrentPage(1);
        setSelectedRowKeys([]);
        toast.success(`Đã chuyển vào thùng rác!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      } else {
        setSelectedRowKeys([]);
        toast.error(`Chuyển vào thùng rác thất bại!`, {
          toastId: 2,
          draggable: true,
          transition: Bounce,
        });
      }
    }
  }, [updateTrashSong.isSuccess]);
  const onFinish = (data) => {
    if (option === 1) {
      if (!image) setCheckImage(true);
      if (!songName) setCheckSongName(true);
      if (songName && image) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('nationId', data.nationId);
        formData.append('categoryId', data.categoryId);
        formData.append('topicId', data.topicId);
        formData.append('singerIds', data.singerIds.join(','));
        formData.append('vip', vip);
        formData.append('image', image);
        formData.append('link', link);
        formData.append('accessToken', user.accessToken);
        if (data.albumId) formData.append('albumId', data.albumId);
        createSong.mutate(formData);
      }
    } else if (option === 2) {
      const formData = new FormData();
      if (image) formData.append('image', image);
      if (link) formData.append('link', link);
      formData.append('albumId', data.albumId ?? null);
      formData.append('name', data.name);
      formData.append('nationId', data.nationId);
      formData.append('categoryId', data.categoryId);
      formData.append('topicId', data.topicId);
      formData.append('singerIds', data.singerIds.join(','));
      formData.append('vip', vip);
      formData.append('accessToken', user.accessToken);
      formData.append('id', item.id);
      updateSong.mutate(formData);
    }
  };
  return (
    <>
      <Flex gap="middle" vertical>
        <TitleAdmin
          title={'Quản lý bài hát'}
          icon={<LuListMusic />}
          onCreate={handleCreate}
          onDelete={handleTrashMany}
          number={trash.data?.count}
        />
        <Table
          scroll={{ x: true }}
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: songs.data?.count,
            onChange,
          }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
        />
      </Flex>
      <ModalCreate
        title={option === 1 ? 'Thêm mới bài hát' : 'Cập nhật bài hát'}
        isModalOpen={isModalOpen}
        formId={'song'}
        onCancel={() => {
          setIsModalOpen(false);
          // form.resetFields();
        }}
        btnText={option === 1 ? 'Thêm mới' : 'Cập nhật'}
      >
        <Form
          labelCol={{
            span: 5,
          }}
          onFinish={onFinish}
          id="song"
          form={form}
          initialValues={item}
        >
          <Form.Item label="Tên bài hát" name="name" rules={[{ required: true, message: 'Hãy nhập tên bài hát' }]}>
            <Input type="text" placeholder="Tên bài hát" />
          </Form.Item>
          <Form.Item
            label="Tên quốc gia"
            name="nationId"
            rules={[{ required: true, message: 'Hãy nhập tên quốc gia' }]}
          >
            <Select
              showSearch
              placeholder="Tên quốc gia"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={optionNations}
            />
          </Form.Item>
          <Form.Item
            label="Tên thể loại"
            name="categoryId"
            rules={[{ required: true, message: 'Hãy nhập tên thể loại' }]}
          >
            <Select
              showSearch
              placeholder="Tên thể loại"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={optionCategories}
            />
          </Form.Item>
          <Form.Item label="Tên chủ đề" name="topicId" rules={[{ required: true, message: 'Hãy nhập tên chủ đề' }]}>
            <Select
              showSearch
              placeholder="Tên chủ đề"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={optionTopics}
            />
          </Form.Item>
          <Form.Item label="Tên ca sĩ" name="singerIds" rules={[{ required: true, message: 'Hãy nhập tên ca sĩ' }]}>
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Tên ca sĩ"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={optionSingers}
              onChange={handleChangeSinger}
            />
          </Form.Item>
          <Form.Item label="Tên album" name="albumId">
            <Select
              allowClear
              showSearch
              disabled={singerIds.length === 0}
              placeholder={singerIds.length === 0 ? 'Chọn ca sĩ trước' : 'Tên album'}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={optionAlbum}
            />
          </Form.Item>
          <Form.Item label="Premium" name="vip">
            <div className="flex items-center gap-6">
              <Switch checked={vip} onChange={(value) => setVip(value)} /> <IconBasic premium={vip} />
            </div>
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <input type="file" id="file" ref={inputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
            <div className="flex flex-col gap-[8px]">
              <Button icon={<UploadOutlined />} onClick={() => inputRef.current.click()}>
                Click to Upload
              </Button>
              {checkImage && <p className="text-text-err">Hãy chọn hình ảnh cho bài hát</p>}
              {imgUpload && <Image src={imgUpload} alt="" height={90} className="w-[40%] object-cover block" />}
            </div>
          </Form.Item>
          <Form.Item label="Bài hát">
            <input type="file" id="fsong" ref={songRef} style={{ display: 'none' }} onChange={handleSongSelect} />
            <div className="flex flex-col gap-[8px]">
              <Button icon={<UploadOutlined />} onClick={() => songRef.current.click()}>
                Click to Upload
              </Button>
              {checkSongName && <p className="text-text-err">Hãy chọn bài hát</p>}
              {songName && <p>{songName}</p>}
            </div>
          </Form.Item>
        </Form>
      </ModalCreate>
    </>
  );
}

export default AdminSong;
