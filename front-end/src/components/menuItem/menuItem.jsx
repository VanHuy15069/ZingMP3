import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function MenuItem({ icon, text, onClick, isHeart = false }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer px-[15px] py-[10px] flex items-center text-[14px] w-full text-[#dadada] hover:bg-border-primary leading-none"
    >
      <span className={`text-[16px] mr-[15px] ${isHeart && 'text-purple-primary'}`}>
        <FontAwesomeIcon icon={icon} />
      </span>
      <p className="font-normal">{text}</p>
    </div>
  );
}
export default MenuItem;
