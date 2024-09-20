import classNames from 'classnames/bind';
import styles from './topicItem.module.scss';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);

function TopicItem({ topic }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/topic/${topic.id}`)} className={cx('topic-cart')}>
      <img className={cx('topic-img')} src={`${import.meta.env.VITE_API_FILE_URL}/${topic.image}`} alt="" />
      <div className={cx('detail')}>
        <h3>{topic.name}</h3>
        <div className={cx('image')}>
          {topic.songInfo.slice(0, 3).map((item, index) => {
            return (
              <div key={index} className={cx('img-music')}>
                <div className={cx('img')}>
                  <img src={`${import.meta.env.VITE_API_FILE_URL}/${item.image}`} alt="" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TopicItem;
