import { Button, Form, Input, Select } from 'antd';
import imgGroup from '../../Image/group-279.svg';
import { useCreateContact } from '../../mutationHook/contact';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

function ContactPage() {
  const [form] = Form.useForm();
  const createContact = useCreateContact();
  const option = [
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
  const handleSubmit = (data) => {
    createContact.mutate(data);
  };
  useEffect(() => {
    if (createContact.isSuccess) {
      Swal.fire({
        title: 'SUCCESS!',
        text: 'Yêu cầu của bạn đã được gửi đến hệ thống, chúng tôi sẽ phản hồi cho bạn sớm nhất có thể!',
        icon: 'success',
        customClass: 'min-h-[30vh] w-[30vw] text-[14px]',
      }).then((result) => {
        if (result.isConfirmed) form.resetFields();
      });
    }
  }, [createContact.isSuccess]);
  return (
    <div className="bg-[#f2f2f2] min-h-screen">
      <div className="bg-white w-[1000px] min-h-screen m-auto px-[15px] pt-[30px] pb-[140px] flex">
        <div className="m-auto w-[500px]">
          <img className="mt-[51px] mb-[30px]" src={imgGroup} alt="" />
          <div className="mb-[25px] text-black">
            <h4 className="font-semibold mb-[20px]">LIÊN HỆ VỚI CHÚNG TÔI</h4>
            <p className="text-[14px]">
              Chúng tôi luôn ghi nhận các đóng góp ý kiến của bạn để cải tiến và nâng cấp sản phẩm Music Studio ngày một
              hoàn thiện và hữu ích hơn. Đừng ngại chia sẻ ý tưởng cho chúng tôi.
            </p>
          </div>
          <div className="text-[15px]">
            <Form form={form} name="contact" layout="vertical" size="large" onFinish={handleSubmit}>
              <Form.Item
                name="problem"
                label={<p className="font-bold">Chọn vấn đề bạn đang cần hỗ trợ</p>}
                rules={[
                  {
                    required: true,
                    message: 'Hãy chọn vấn đề bạn đang gặp phải',
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Chọn vấn đề cần liên hệ"
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  options={option}
                />
              </Form.Item>
              <Form.Item
                name="content"
                label={<p className="font-bold">Nội dung</p>}
                rules={[
                  {
                    required: true,
                    message: 'Bạn cần cung cấp nội dung liên hệ',
                  },
                ]}
              >
                <Input.TextArea rows={6} placeholder="Nhập nội dung cần giúp đỡ" />
              </Form.Item>
              <Form.Item
                name="fullName"
                label={<p className="font-bold">Họ tên</p>}
                rules={[
                  {
                    required: true,
                    message: 'Bạn cần cung cấp họ tên',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label={<p className="font-bold">Email</p>}
                rules={[
                  {
                    required: true,
                    message: 'Bạn cần cung cấp email',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                label={<p className="font-bold">Số điện thoại</p>}
                rules={[
                  {
                    required: true,
                    message: 'Bạn cần cung cấp số điện thoại',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label={null}>
                <Button type="primary" htmlType="submit" size="large" style={{ width: '210px' }}>
                  Gửi
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
