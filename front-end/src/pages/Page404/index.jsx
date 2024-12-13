import classNames from 'classnames/bind';
import styles from './page404.module.scss';
const cx = classNames.bind(styles);
function NotFound() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('err')}>
        <h1>404</h1>
        <p>Page Not Found</p>
      </div>
    </div>
  );
}
export default NotFound;
