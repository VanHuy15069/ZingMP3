import AdminAlbum from '../pages/AdminAlbum';
import AlbumTrash from '../pages/AdminAlbum/albumTrash';
import AdminCategory from '../pages/AdminCategory';
import CategoryTrash from '../pages/AdminCategory/categoryTrash';
import AdminNation from '../pages/adminNation';
import NationTrash from '../pages/adminNation/nationTrash';
import AdminPage from '../pages/AdminPage';
import AdminSinger from '../pages/AdminSinger';
import SingerTrash from '../pages/AdminSinger/singerTrash';
import AdminSlider from '../pages/AdminSlider';
import SliderTrash from '../pages/AdminSlider/sliderTrash';
import AdminSong from '../pages/AdminSong';
import SongTrash from '../pages/AdminSong/songTrash';
import AdminTopic from '../pages/AdminTopic';
import TopicTrash from '../pages/AdminTopic/topicTrash';
import CategoryPage from '../pages/categoryPage';
import DetailAlbumPage from '../pages/detailAlbumPage';
import DetailPlaylistPage from '../pages/detailPlaylistPage';
import DetailSongPage from '../pages/DetailSongPage';
import HomePage from '../pages/homePage';
import HubPage from '../pages/hubPage';
import LibraryPage from '../pages/libraryPage';
import LibraryPlaylistPage from '../pages/libraryPlaylistPage';
import LibrarySingerPage from '../pages/librarySingerPage';
import LoginPage from '../pages/loginPage';
import NationPage from '../pages/nationPage';
import NewReleasePage from '../pages/newReleasePage';
import NewSongPage from '../pages/newSongPage';
import ProfilePage from '../pages/ProfilePage';
import RegisterPage from '../pages/RegisterPage';
import SearchPage from '../pages/searchPage';
import SingerPage from '../pages/singerPage';
import TopicPage from '../pages/topicPage';

export const publicRouter = [
  { path: '/', component: HomePage },
  { path: '/register', component: RegisterPage, layout: null },
  { path: '/login', component: LoginPage, layout: null },
  { path: '/singer/:id', component: SingerPage },
  { path: '/new-songs', component: NewSongPage },
  { path: '/new-release', component: NewReleasePage },
  { path: '/song/:id', component: DetailSongPage },
  { path: '/album/:id', component: DetailAlbumPage },
  { path: '/search', component: SearchPage },
  { path: '/hub', component: HubPage },
  { path: '/nation/:id', component: NationPage },
  { path: '/topic/:id', component: TopicPage },
  { path: '/category/:id', component: CategoryPage },
];

export const userRouter = [
  { path: '/my-music', component: LibraryPage },
  { path: '/my-music/singers', component: LibrarySingerPage },
  { path: '/my-music/playlists', component: LibraryPlaylistPage },
  { path: '/playlist/:id', component: DetailPlaylistPage },
  { path: '/account', component: ProfilePage },
];

export const adminRouter = [
  { path: '/dashboard', component: AdminPage },
  { path: '/dashboard/category', component: AdminCategory },
  { path: '/dashboard/category/trash', component: CategoryTrash },
  { path: '/dashboard/topic', component: AdminTopic },
  { path: '/dashboard/topic/trash', component: TopicTrash },
  { path: '/dashboard/nation', component: AdminNation },
  { path: '/dashboard/nation/trash', component: NationTrash },
  { path: '/dashboard/singer', component: AdminSinger },
  { path: '/dashboard/singer/trash', component: SingerTrash },
  { path: '/dashboard/song', component: AdminSong },
  { path: '/dashboard/song/trash', component: SongTrash },
  { path: '/dashboard/album', component: AdminAlbum },
  { path: '/dashboard/album/trash', component: AlbumTrash },
  { path: '/dashboard/slide', component: AdminSlider },
  { path: '/dashboard/slider/trash', component: SliderTrash },
];
