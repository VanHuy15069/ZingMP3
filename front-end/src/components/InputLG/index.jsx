import { forwardRef } from 'react';
import classNames from 'classnames/bind';
import styles from './inputLG.module.scss';
const cx = classNames.bind(styles);

const InputLG = forwardRef(({ tyle, placeholder, ...prop }, ref) => {
  return (
    <div className="relative">
      <input className={cx('input')} autoComplete="off" type={tyle} placeholder={placeholder} {...prop} ref={ref} />
      <div className={cx('line')}></div>
    </div>
  );
});

export default InputLG;
