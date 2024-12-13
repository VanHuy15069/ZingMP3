import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Select } from 'antd';
import { useState } from 'react';
import { GoTrash } from 'react-icons/go';
import { MdOutlineReplay } from 'react-icons/md';

function TitleAdmin({
  icon,
  title,
  onCreate,
  onDelete,
  number,
  trash = false,
  disabled = false,
  search = false,
  onSearch,
  placeholderSearch,
  select = false,
  optionName,
  optionValue,
  onChange,
  onChangeValue,
  disabledSelect = false,
  placeholderSelect = false,
  value,
}) {
  const { Search } = Input;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 text-[26px] font-bold text-[#333]">
        <span>{icon}</span>
        <h3>{title}</h3>
      </div>
      <Flex gap="small" wrap justify="flex-end">
        {select && (
          <Select
            onChange={onChange}
            size="large"
            style={{ minWidth: 180 }}
            allowClear
            options={optionName}
            placeholder="Chọn điều kiện lọc"
          />
        )}
        {select && (
          <Select
            disabled={disabledSelect}
            onChange={onChangeValue}
            size="large"
            style={{ minWidth: 210 }}
            allowClear
            options={optionValue}
            value={value}
            placeholder={placeholderSelect}
          />
        )}
        {search && (
          <Search size="large" style={{ width: 210 }} placeholder={placeholderSearch} onSearch={onSearch} enterButton />
        )}
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
