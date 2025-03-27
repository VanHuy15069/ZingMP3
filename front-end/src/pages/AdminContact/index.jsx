import { Button, DatePicker, Flex, Form, Input, Modal, Select, Table, Tag } from 'antd';
import { GoTrash } from 'react-icons/go';
import { VscFeedback } from 'react-icons/vsc';
import { useGetAllContact } from '../../hook';
import { useUserStore } from '../../store';
import { MdOutlineFeedback } from 'react-icons/md';
import { useEffect, useState } from 'react';
import ModalCreate from '../../components/Modal/modalCreate';
import { useDeleteContacts, useFeedbackContact } from '../../mutationHook/contact';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
function AdminContact() {
  const [form] = Form.useForm();
  // const { RangePicker } = DatePicker;
  const user = useUserStore((state) => state.user);
  const [problem, setProblem] = useState();
  const [status, setStatus] = useState();
  const contacts = useGetAllContact(10, 0, status, problem, user.accessToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showFullText, setShowFullText] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [contact, setContact] = useState({});
  const feedback = useFeedbackContact();
  const deleteContacts = useDeleteContacts();
  const problems = [
    {
      value: 'Báo lỗi',
      label: 'Báo lỗi',
    },
    {
      value: 'Góp ý sản phẩm',
      label: 'Góp ý sản phẩm',
    },
    {
      value: 'Nâng cấp tài khoản premium',
      label: 'Nâng cấp tài khoản premium',
    },
    {
      value: 'Phát hành nội dung',
      label: 'Phát hành nội dung',
    },
    {
      value: 'Hợp tác nội dung',
      label: 'Hợp tác nội dung',
    },
    {
      value: 'Tài khoản người dùng',
      label: 'Tài khoản người dùng',
    },
    {
      value: 'Vấn đề khác',
      label: 'Vấn đề khác',
    },
  ];
  const options = [
    {
      value: 1,
      label: 'Đã phản hồi',
    },
    {
      value: false,
      label: 'Chưa phản hồi',
    },
  ];
  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
    {
      title: 'email',
      dataIndex: 'email',
      width: 220,
    },
    {
      title: 'Vấn đề',
      dataIndex: 'problem',
      width: 220,
    },
    {
      title: 'Thời gian',
      dataIndex: 'date',
      align: 'center',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      width: 280,
      render: (item) => {
        let lessText = item.content;
        let over = false;
        if (item.content.length > 70) {
          lessText = item.content.substring(0, 30);
          over = true;
        }
        return (
          <div>
            <p className="text-ellipsis overflow-hidden line-clamp-2">
              {lessText}
              {over && '...'}
              {over && (
                <span onClick={() => setShowFullText(item.id)} className="text-blue-500 cursor-pointer">
                  xem thêm
                </span>
              )}
            </p>
            <Modal
              centered
              footer={null}
              title={`Khách hàng: ${item.name}`}
              open={showFullText === Number(item.id)}
              onCancel={() => setShowFullText(0)}
            >
              {item.content}
            </Modal>
          </div>
        );
      },
    },
    {
      title: 'Ngày phản hồi',
      dataIndex: 'feedbackDate',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center',
      render: (status) =>
        status ? (
          <Tag
            bordered={true}
            style={{ padding: '2px 12px', margin: 'auto', minWidth: '100px', textAlign: 'center' }}
            color="success"
          >
            Đã phản hồi
          </Tag>
        ) : (
          <Tag
            bordered={true}
            style={{ padding: '2px 12px', margin: 'auto', minWidth: '100px', textAlign: 'center' }}
            color="error"
          >
            Chưa phản hồi
          </Tag>
        ),
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      align: 'center',
      width: 240,
      fixed: 'right',
    },
  ];
  const dataSource = contacts.data?.data.rows.map((item) => {
    return {
      key: item.id,
      name: item.fullName,
      phone: item.phone,
      email: item.email,
      date: dayjs(item.createdAt).format('DD/MM/YYYY'),
      feedbackDate: item.status ? dayjs(item.updatedAt).format('DD/MM/YYYY') : '',
      problem: item.problem,
      content: { content: item.content, id: item.id, name: item.fullName },
      status: item.status,
      action: (
        <Flex gap="small">
          <Button
            disabled={item.status}
            type="primary"
            size="large"
            icon={<MdOutlineFeedback />}
            onClick={() => handleOpenFeedback(item)}
          >
            Phản hồi
          </Button>
          <Button
            disabled={!item.status}
            type="primary"
            danger
            size="large"
            icon={<GoTrash />}
            onClick={() => handleDelete(item)}
          >
            Xóa
          </Button>
        </Flex>
      ),
    };
  });
  const onChange = (currentPage) => {
    setCurrentPage(currentPage);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleOpenFeedback = (contact) => {
    setShowModal(true);
    setContact(contact);
  };
  // const handleChangeDate = (date, dateString) => {
  //   console.log(new Date(dateString[0]));
  // };
  const handFeedback = (data) => {
    feedback.mutate({ id: contact.id, feedback: data.feedback, accessToken: user.accessToken });
  };
  const onOptionProblemChange = (value) => {
    setCurrentPage(1);
    setProblem(value);
  };
  const onOptionChange = (value) => {
    setCurrentPage(1);
    setStatus(value);
  };
  const handleDelete = (data) => {
    Swal.fire({
      title: `Xác nhận xóa nội dụng liên hệ của ${data.fullName}!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteContacts.mutate({ contactIds: data.id.toString(), accessToken: user.accessToken });
      }
    });
  };
  const handleDeleteMany = () => {
    Swal.fire({
      title: `Xác nhận xóa nội dụng liên hệ của ${selectedRowKeys.length} khách hàng!`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteContacts.mutate({
          contactIds: selectedRowKeys.join(','),
          accessToken: user.accessToken,
        });
      }
    });
  };
  useEffect(() => {
    if (contacts.isError || feedback.isError || deleteContacts.isError) {
      toast.error(`505! Server Error!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [contacts.isError, feedback.isError, deleteContacts.isError]);
  useEffect(() => {
    if (feedback.isSuccess) {
      setContact({});
      setShowModal(false);
      form.resetFields();
      toast.success(`Phản hồi khách hàng thành công!`, {
        draggable: true,
        transition: Bounce,
      });
    }
  }, [feedback.isSuccess]);
  useEffect(() => {
    if (deleteContacts.isSuccess) {
      if (deleteContacts.data?.status === 'SUCCESS') {
        toast.success(`Xóa liên hệ thành công!`, {
          draggable: true,
          transition: Bounce,
        });
        setSelectedRowKeys([]);
      } else if (deleteContacts.data?.status === 'WANRING') {
        Swal.fire({
          title: 'WARNING!',
          text: deleteContacts.data?.msg,
          icon: 'warning',
          customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
        });
      }
    }
  }, [deleteContacts.isSuccess]);
  return (
    <div>
      <Flex gap="middle" vertical>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[26px] font-bold text-[#333]">
            <span>
              <VscFeedback />
            </span>
            <h3>Phản hồi khách hàng</h3>
          </div>
          <div className="flex items-center gap-6">
            {/* <RangePicker size="large" onChange={handleChangeDate} /> */}
            <Select
              size="large"
              style={{ width: 250 }}
              placeholder="Vấn đề"
              options={problems}
              onChange={onOptionProblemChange}
              allowClear
            />
            <Select
              size="large"
              style={{ width: 180 }}
              placeholder="Trạng thái"
              options={options}
              onChange={onOptionChange}
              allowClear
            />
            <Button
              onClick={handleDeleteMany}
              disabled={selectedRowKeys.length === 0}
              type="primary"
              size="large"
              danger
              icon={<GoTrash />}
            >
              Xóa
            </Button>
          </div>
        </div>
        <Table
          scroll={{
            x: 1600,
            y: contacts.data?.data.count > 6 ? 'calc(100vh - 270px)' : null,
          }}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: contacts.data?.data.count,
            onChange,
          }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          loading={contacts.isLoading}
        />
      </Flex>
      <ModalCreate
        onCancel={() => {
          setShowModal(false);
          setContact({});
          form.resetFields();
        }}
        loading={feedback.isPending}
        title={`Phản hồi khách hàng: ${contact.fullName}`}
        isModalOpen={showModal}
        formId={'feedback'}
        btnText={'Phản hồi'}
      >
        <Form form={form} onFinish={handFeedback} id="feedback" layout="vertical">
          <Form.Item
            label="Nội dung phản hồi"
            name="feedback"
            rules={[{ required: true, message: 'Hãy nhập nội dung phản hồi' }]}
          >
            <Input.TextArea rows={6} type="text" placeholder="Nội dung phản hồi" />
          </Form.Item>
        </Form>
      </ModalCreate>
    </div>
  );
}

export default AdminContact;
