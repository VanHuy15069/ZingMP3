import SongItemSmall from '../../components/songItemSmall';

function ListFavoriteSong({ listSongs }) {
  return (
    <>
      <div className="p-[10px] flex items-center text-[12px] text-second-text font-medium uppercase border-b border-b-border-primary">
        <div className="w-1/2">Bài hát</div>
        <div className="flex-1">Album</div>
        <div className="text-right">Thời gian</div>
      </div>
      {listSongs?.map((item) => {
        return <SongItemSmall key={item.id} song={item} listSongs={listSongs} />;
      })}
    </>
  );
}

export default ListFavoriteSong;
