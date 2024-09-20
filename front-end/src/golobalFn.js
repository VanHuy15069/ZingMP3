export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

export const handleAddSongsPlaylist = (song, listSongs, user, updateSongId, updateAlbumId) => {
  const newList = [...listSongs];
  if (user?.id) {
    if (song.vip) {
      if (user.vip) {
        const index = newList.indexOf(song);
        const afterList = newList.slice(index);
        newList.splice(index, newList.length - index);
        const listMusic = afterList.concat(newList);
        localStorage.setItem('listMusic', JSON.stringify(listMusic));
        updateSongId(song.id);
        if (song.albumId) updateAlbumId(song.albumId);
      } else {
        alert('Loi');
      }
    } else {
      if (user.vip) {
        const index = newList.indexOf(song);
        const afterList = newList.slice(index);
        newList.splice(index, newList.length - index);
        const listMusic = afterList.concat(newList);
        localStorage.setItem('listMusic', JSON.stringify(listMusic));
        updateSongId(song.id);
        if (song.albumId) updateAlbumId(song.albumId);
      } else {
        const musicNotVip = newList.filter((song) => song.vip === false);
        const index = musicNotVip.indexOf(song);
        const afterList = musicNotVip.slice(index);
        musicNotVip.splice(index, musicNotVip.length - index);
        const listMusic = afterList.concat(musicNotVip);
        localStorage.setItem('listMusic', JSON.stringify(listMusic));
        updateSongId(song.id);
        if (song.albumId) updateAlbumId(song.albumId);
      }
    }
  } else {
    if (song.vip) {
      alert('Loi');
    } else {
      const musicNotVip = newList.filter((song) => song.vip === false);
      const index = musicNotVip.indexOf(song);
      const afterList = musicNotVip.slice(index);
      musicNotVip.splice(index, musicNotVip.length - index);
      const listMusic = afterList.concat(musicNotVip);
      localStorage.setItem('listMusic', JSON.stringify(listMusic));
      updateSongId(song.id);
      if (song.albumId) updateAlbumId(song.albumId);
    }
  }
};

export const handleAddSongs = (song, listSongs, user, updateSongId, updateAlbumId) => {
  const newList = [...listSongs];
  if (user?.id) {
    if (song.vip) {
      if (user.vip) {
        const index = newList.indexOf(song);
        const afterList = newList.slice(index);
        newList.splice(index, newList.length - index);
        const listMusic = afterList.concat(newList);
        localStorage.setItem('listMusic', JSON.stringify(listMusic));
        updateSongId(song.id);
        if (song.albumId) updateAlbumId(song.albumId);
        else updateAlbumId(undefined);
        localStorage.removeItem('playlistId');
      } else {
        alert('Loi');
      }
    } else {
      if (user.vip) {
        const index = newList.indexOf(song);
        const afterList = newList.slice(index);
        newList.splice(index, newList.length - index);
        const listMusic = afterList.concat(newList);
        localStorage.setItem('listMusic', JSON.stringify(listMusic));
        updateSongId(song.id);
        if (song.albumId) updateAlbumId(song.albumId);
        else updateAlbumId(undefined);
        localStorage.removeItem('playlistId');
      } else {
        const musicNotVip = newList.filter((song) => song.vip === false);
        const index = musicNotVip.indexOf(song);
        const afterList = musicNotVip.slice(index);
        musicNotVip.splice(index, musicNotVip.length - index);
        const listMusic = afterList.concat(musicNotVip);
        localStorage.setItem('listMusic', JSON.stringify(listMusic));
        updateSongId(song.id);
        if (song.albumId) updateAlbumId(song.albumId);
        else updateAlbumId(undefined);
        localStorage.removeItem('playlistId');
      }
    }
  } else {
    if (song.vip) {
      alert('Loi');
    } else {
      const musicNotVip = newList.filter((song) => song.vip === false);
      const index = musicNotVip.indexOf(song);
      const afterList = musicNotVip.slice(index);
      musicNotVip.splice(index, musicNotVip.length - index);
      const listMusic = afterList.concat(musicNotVip);
      localStorage.setItem('listMusic', JSON.stringify(listMusic));
      updateSongId(song.id);
      if (song.albumId) updateAlbumId(song.albumId);
      else updateAlbumId(undefined);
      localStorage.removeItem('playlistId');
    }
  }
};
