import { DatePicker } from 'antd';
import dayjs from 'dayjs';

function DateRange({ getDate, defaultValue = [] }) {
  const { RangePicker } = DatePicker;
  const handleChangeDate = (date, dateString) => {
    getDate(dateString);
  };
  const rangePresets = [
    { label: 'Tuần này', value: [dayjs().startOf('week'), dayjs().endOf('week')] },
    { label: 'Tuần trước', value: [dayjs().subtract(1, 'week'), dayjs().startOf('week')] },
    { label: 'Tháng này', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
    { label: 'Tháng trước', value: [dayjs().subtract(1, 'month'), dayjs().startOf('month')] },
    { label: 'Nửa đầu năm', value: [dayjs().startOf('year'), dayjs().month(5).endOf('month')] },
    { label: 'Nửa cuối năm', value: [dayjs().month(6).startOf('month'), dayjs().endOf('year')] },
  ];
  return (
    <RangePicker
      placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
      defaultValue={defaultValue}
      format={'DD/MM/YYYY'}
      size="large"
      onChange={handleChangeDate}
      presets={rangePresets}
    />
  );
}

export default DateRange;
