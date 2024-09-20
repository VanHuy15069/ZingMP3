import { Tooltip } from 'antd';
import { PiDownload } from 'react-icons/pi';

function DownLoadIcon({ overlay = false }) {
  return (
    <Tooltip title={<p className="text-[12px]">Tải xuống</p>}>
      <div
        className={`cursor-pointer ${
          overlay && 'bg-border-primary'
        } hover:bg-border-primary p-[5px]  text-[16px] rounded-full h-[32px] w-[32px] flex items-center justify-center mx-[2px]`}
      >
        <span className="flex items-center justify-center">
          <PiDownload />
        </span>
      </div>
    </Tooltip>
  );
}
export default DownLoadIcon;
