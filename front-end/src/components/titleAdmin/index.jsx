import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { GoTrash } from 'react-icons/go';
import { MdOutlineReplay } from 'react-icons/md';

function TitleAdmin({ icon, title, onCreate, onDelete, number, trash = false, disabled = false }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 text-[26px] font-bold text-[#333]">
        <span>{icon}</span>
        <h3>{title}</h3>
      </div>
      <Flex gap="small">
        <Button
          disabled={disabled}
          type="primary"
          size="large"
          icon={trash ? <MdOutlineReplay /> : <PlusOutlined />}
          onClick={onCreate}
        >
          {trash ? 'Khôi phục' : 'Thêm mới'}
        </Button>
        <Button disabled={disabled} type="primary" size="large" danger icon={<GoTrash />} onClick={onDelete}>
          {`${trash ? 'Xóa' : 'Thùng rác'} ${number && number > 0 ? `(${number})` : ''}`}
        </Button>
      </Flex>
    </div>
  );
}

export default TitleAdmin;
