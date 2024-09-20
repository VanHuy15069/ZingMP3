import { useNavigate } from 'react-router-dom';
import avatar from '../../Image/avatar.png';

function SearchSingerItem({ singer }) {
  const navigate = useNavigate();
  let image = avatar;
  if (singer.image) image = `${import.meta.env.VITE_API_FILE_URL}/${singer.image}`;
  return (
    <div
      onClick={() => navigate(`/singer/${singer.id}`)}
      className="flex items-center py-[8px] px-[10px] rounded-[4px] cursor-pointer hover:bg-border-primary"
    >
      <img className="h-[52px] w-[52px] object-cover rounded-full mr-[10px]" src={image} alt="" />
      <div className="flex-1 text-[14px] font-medium">
        <p>{singer.name}</p>
        <div className="flex text-[12px] text-alpha mt-[3px]">
          <p>Nghệ sĩ</p>
          <p>&ensp;•&ensp;</p>
          <p>{singer.follows} quan tâm</p>
        </div>
      </div>
    </div>
  );
}

export default SearchSingerItem;
