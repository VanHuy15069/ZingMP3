function Button({
  bgColor,
  txColor,
  fontSize,
  fontWeight,
  large,
  medium,
  small,
  children,
  onClick,
  border = 'border',
  borderColor = 'bg-boder-primary',
  py,
  px,
  className,
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[100px] ${border} ${borderColor} ${py} ${px} border-solid ${bgColor} ${fontWeight} ${txColor} ${fontSize} ${
        large && 'py-[10px] px-[20px]'
      } ${medium && 'py-[6px] px-[19px]'} ${small && 'py-[4px] px-[24px]'} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
