import SingerItem from '../../components/singerItem';
import { useGetAllSingerFollow } from '../../hook';
import { useUserStore } from '../../store';

function LibrarySingerPage() {
  const user = useUserStore((state) => state.user);
  const singers = useGetAllSingerFollow(user.id, null, user.accessToken);
  return (
    <>
      <div className="-mx-[59px] mb-[28px] border-b border-b-border-primary flex items-center select-none">
        <div className="px-[59px] text-[24px] font-bold pr-[20px] border-r border-r-border-primary">Nghệ sĩ</div>
        <p className="uppercase py-[15px] mx-[20px]">Tất cả</p>
      </div>
      <div className="flex flex-wrap -mx-[14px]">
        {singers.data?.data.map((item) => {
          return (
            <div key={item.singerId} className="px-[14px] mb-[30px] w-1/5 tablet:max-laptop:w-1/4">
              <SingerItem singerId={item.singerId} />
            </div>
          );
        })}
      </div>
    </>
  );
}
export default LibrarySingerPage;
