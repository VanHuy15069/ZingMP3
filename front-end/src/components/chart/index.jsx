import { Tooltip } from 'antd';
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, XAxis, YAxis } from 'recharts';

function Chart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={'bg-black p-[10px] rounded-[4px]'}>
          <div className={'flex items-center'}>
            <img
              className={'mr-[6px] h-[40px] w-[40px] object-cover rounded-[4px]'}
              src={`${import.meta.env.VITE_API_FILE_URL}/${payload[0].payload.image}`}
              alt=""
            />
            {/* <div>
              <p className={'text-[14px] font-semibold'}>{label}</p>
              <p className={'text-[12px]'}>{payload[0].payload.singer}</p>
            </div> */}
          </div>
          <div className={'flex items-center justify-start text-[14px]'}>
            <div style={{ marginRight: '4px' }}>Lượt nghe:</div>
            <div style={{ color: payload[0].fill }}>{payload[0].value}</div>
          </div>
          <div className={cx('item')}>
            <div style={{ marginRight: '4px' }}>Lượt thích:</div>
            <div style={{ color: payload[1].fill }}>{payload[1].value}</div>
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="songName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="views" fill="#3b82f6" activeBar={<Rectangle fill="#2573f1" stroke="#8884d8" />} />
        <Bar dataKey="favorite" fill="#e1499c" activeBar={<Rectangle fill="#eb2f96" stroke="#eb2f96" />} />
      </BarChart>
    </ResponsiveContainer>
  );
}
export default Chart;
