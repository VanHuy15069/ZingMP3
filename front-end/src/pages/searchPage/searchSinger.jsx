import { Empty } from 'antd';
import emptyImg from '../../Image/empty-dark.png';
import { useGetAllSingers } from '../../hook';
import SingerItem from '../../components/singerItem';

function SearchSinger({ searchValue }) {
  const singers = useGetAllSingers(null, null, false, searchValue);
  return (
    <>
      {singers.data?.count > 0 ? (
        <div className="mt-[12px]">
          <div className="mb-[20px] capitalize text-[20px] font-bold">Nghệ sĩ</div>
          <div className="flex items-center flex-wrap -mx-[14px]">
            {singers.data?.data.map((item) => {
              return (
                <div key={item.id} className="px-[14px] w-1/5">
                  <SingerItem singerId={item.id} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Empty
          className="flex flex-col items-center justify-center"
          description={<p className="text-second-text text-[16px] font-semibold">Không có kết quả tìm kiếm phù hợp</p>}
          image={emptyImg}
        />
      )}
    </>
  );
}

export default SearchSinger;
