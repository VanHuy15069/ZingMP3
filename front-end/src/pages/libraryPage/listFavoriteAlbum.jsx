import AlbumItem from '../../components/albumItem';

function ListFavoriteAlbum({ listAlbums }) {
  return (
    <div className="-mx-[14px] flex items-center flex-wrap">
      {listAlbums?.map((item) => {
        return (
          <div key={item?.id} className="w-1/5 px-[14px]">
            <AlbumItem album={item} />
          </div>
        );
      })}
    </div>
  );
}
export default ListFavoriteAlbum;
