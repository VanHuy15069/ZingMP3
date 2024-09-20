function IconBasic({ premium = false, large = false }) {
  return (
    <div
      className={`${premium ? 'bg-[#e5ac1a]' : 'bg-[#a1a1a1]'} rounded-[3px] ${
        large ? 'text-[11px] h-[16px] leading-[16px] w-[60px]' : 'text-[8px] h-[14px] leading-[14px] w-[50px]'
      } font-bold text-center `}
    >
      {premium ? 'PREMIUM' : 'BASIC'}
    </div>
  );
}

export default IconBasic;
