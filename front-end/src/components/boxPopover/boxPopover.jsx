import { HeartOutlined } from '@ant-design/icons';
import { faHeadphones } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGetSongById } from '../../hook';
import { useNavigate } from 'react-router-dom';

function BoxPopover({ children, songId }) {
  const navigate = useNavigate();
  const songDetail = useGetSongById(songId);
  return (
    <div className="bg-alpha-primary rounded-[8px] w-[280px] py-[15px]">
      {songId && (
        <div className="px-[15px] pb-[15px] flex items-center">
          <div className="overflow-hidden h-[40px] w-[40px] rounded-[4px] mr-[10px]">
            {songDetail.isSuccess && (
              <img
                className="w-full h-full object-cover"
                src={`${import.meta.env.VITE_API_FILE_URL}/${songDetail.data?.data.image}`}
                alt=""
              />
            )}
          </div>
          <div className="flex flex-col items-start">
            <p
              onClick={() => navigate(`/song/${songId}`)}
              className="cursor-pointer text-white font-medium text-ellipsis overflow-hidden line-clamp-1 hover:text-purple-hover"
            >
              {songDetail.data?.data.name}
            </p>
            <div className="flex items-center gap-[10px] text-[#a0a0a0] text-[12px]">
              <div className="flex items-center">
                <span className="mr-[2px]">
                  <HeartOutlined />
                </span>
                <p>{songDetail.data?.favorite}</p>
              </div>
              <div className="flex items-center">
                <span className="mr-[2px]">
                  <FontAwesomeIcon icon={faHeadphones} />
                </span>
                <p>{songDetail.data?.data.views}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
export default BoxPopover;
