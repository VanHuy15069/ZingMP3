import { Button, Flex, Image, Table } from 'antd';
import { MdOutlineReplay } from 'react-icons/md';
import { useUserStore } from '../../store';
import TitleAdmin from '../../components/titleAdmin';
import { useEffect, useState } from 'react';
import { useGetAllSongs } from '../../hook';
import { GoTrash } from 'react-icons/go';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useDeleteSong, useUpdateTrashSong } from '../../mutationHook/song';
import { LuListMusic } from 'react-icons/lu';

function SongTrash() {
  const user = useUserStore((state) => state.user);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const songs = useGetAllSongs(5, currentPage - 1, null, 'createdAt', 'DESC', 1);
  const updateTrashSong = useUpdateTrashSong();
  const deleteSong = useDeleteSong();
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
  const handleRestore = (song) => {
    Swal.fire({
      title: `Xác nhận khôi phục bài hát ${song.name}!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashSong.mutate({ songIds: song.id.toString(), accessToken: user.accessToken, trash: false });
      }
    });
  };
  const handleRestoreMany = () => {
    Swal.fire({
      title: `Xác nhận khôi phục lại ${selectedRowKeys.length} bài hát!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        updateTrashSong.mutate({ songIds: selectedRowKeys.join(','), accessToken: user.accessToken, trash: false });
      }
    });
  };
  const handleDelete = (song) => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn bài hát ${song.name}!`,
      text: 'Điều này có thể sẽ xóa đi các dữ liệu liên quan đến bài hát này.',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSong.mutate({ songIds: song.id.toString(), accessToken: user.accessToken });
      }
    });
  };
  const handleDeleteMany = () => {
    Swal.fire({
      title: `Xác nhận xóa vĩnh viễn ${selectedRowKeys.length} bài hát!`,
      text: 'Điều này có thể sẽ xóa đi các dữ liệu liên quan đến bài hát này.',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSong.mutate({
          songIds: selectedRowKeys.join(','),
          accessToken: user.accessToken,
        });
      }
    });
  };
  useEffect(() => {
    if (updateTrashSong.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`bài hát đã được khôi phục!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [updateTrashSong.isSuccess]);
  useEffect(() => {
    if (deleteSong.isSuccess) {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      toast.success(`Đã xóa thành công!`, {
        toastId: 2,
        draggable: true,
        transition: Bounce,
      });
    }
  }, [deleteSong.isSuccess]);
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
        title={'Quản lý bài hát (Thùng rác)'}
        icon={<LuListMusic />}
        onCreate={handleRestoreMany}
        onDelete={handleDeleteMany}
      />
      <Table
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
  );
}
export default SongTrash;
