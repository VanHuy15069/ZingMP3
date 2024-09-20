import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './cart.module.scss';
const cx = classNames.bind(styles);
function Card({ link, image, content }) {
  return (
    <Link to={link} className="block rounded-[8px] overflow-hidden cursor-pointer">
      <div className={cx('item')}>
        <img src={image} alt="" />
        <div className="w-full text-[26px] font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          {content}
        </div>
      </div>
    </Link>
  );
}
export default Card;
