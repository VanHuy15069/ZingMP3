import {
  ExportOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faAngleRight, faBrush, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SettingBox() {
  return (
    <div className="bg-[#34224f] p-[6px] rounded-[8px] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] w-[300px] z-10">
      <div className="rounded-[4px] text-[#dadada] h-[44px] leading-normal text-[14px] py-[12px] px-[10px] flex items-center justify-between hover:bg-[#493961]">
        <div className="flex items-center">
          <span className="mr-[12px] text-[20px]">
            <PlayCircleOutlined />
          </span>
          <p>Trình phát nhạc</p>
        </div>
        <span>
          <FontAwesomeIcon icon={faAngleRight} />
        </span>
      </div>

      <div className="rounded-[4px] text-[#dadada] h-[44px] leading-normal text-[14px] py-[12px] px-[10px] flex items-center justify-between hover:bg-[#493961]">
        <div className="flex items-center">
          <span className="mr-[12px] text-[20px]">
            <FontAwesomeIcon icon={faBrush} />
          </span>
          <p>Giao diện</p>
        </div>
        <span>
          <FontAwesomeIcon icon={faAngleRight} />
        </span>
      </div>
      <div className="w-full bg-border-primary h-[1px]"></div>

      <div className="rounded-[4px] text-[#dadada] h-[44px] leading-normal text-[14px] py-[12px] px-[10px] flex items-center justify-between hover:bg-[#493961]">
        <div className="flex items-center">
          <span className="mr-[12px] text-[20px]">
            <InfoCircleOutlined />
          </span>
          <p>Giới thiệu</p>
        </div>
        <span>
          <ExportOutlined />
        </span>
      </div>

      <div className="rounded-[4px] text-[#dadada] h-[44px] leading-normal text-[14px] py-[12px] px-[10px] flex items-center justify-between hover:bg-[#493961]">
        <div className="flex items-center">
          <span className="mr-[12px] text-[20px]">
            <FileTextOutlined />
          </span>
          <p>Thỏa thuận sử dụng</p>
        </div>
        <span>
          <ExportOutlined />
        </span>
      </div>

      <div className="rounded-[4px] text-[#dadada] h-[44px] leading-normal text-[14px] py-[12px] px-[10px] flex items-center justify-between hover:bg-[#493961]">
        <div className="flex items-center">
          <span className="mr-[12px] text-[20px]">
            <FontAwesomeIcon icon={faShieldHalved} />
          </span>
          <p>Chính sách bảo mật</p>
        </div>
        <span>
          <ExportOutlined />
        </span>
      </div>

      <div className="rounded-[4px] text-[#dadada] h-[44px] leading-normal text-[14px] py-[12px] px-[10px] flex items-center justify-between hover:bg-[#493961]">
        <div className="flex items-center">
          <span className="mr-[12px] text-[20px]">
            <FontAwesomeIcon icon={faFlag} />
          </span>
          <p>Báo cáo vi phạm bản quyền</p>
        </div>
        <span>
          <ExportOutlined />
        </span>
      </div>

      <div className="rounded-[4px] text-[#dadada] h-[44px] leading-normal text-[14px] py-[12px] px-[10px] flex items-center justify-between hover:bg-[#493961]">
        <div className="flex items-center">
          <span className="mr-[12px] text-[20px]">
            <PhoneOutlined />
          </span>
          <p>Liên hệ</p>
        </div>
        <span>
          <ExportOutlined />
        </span>
      </div>
    </div>
  );
}
export default SettingBox;
