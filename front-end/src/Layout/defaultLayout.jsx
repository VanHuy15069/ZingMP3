import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Audio from '../components/audio';
import { useAudioStore } from '../store';
import { ToastContainer } from 'react-toastify';

function DefaultLayout({ children }) {
  const audio = useAudioStore((state) => state.audio);
  return (
    <div className="bg-bg-primary w-full">
      <div className="w-full max-w-[2000px]">
        <div
          className={`fixed top-0 left-0 w-[240px] h-screen ${
            audio.songId && 'pb-[90px]'
          } overflow-hidden bg-[#221a2d]`}
        >
          <Sidebar />
        </div>
        <div className="px-[59px] ml-[240px]">
          <div className="fixed top-0 right-0 left-[240px] min-w-[640px] z-30">
            <Header />
          </div>
          <div
            className={`block pt-[70px] ${
              audio.songId ? 'mb-[120px]' : 'mb-[30px]'
            } bg-bg-primary min-h-[calc(100vh - 90px)]`}
          >
            {children}
          </div>
        </div>
      </div>
      {audio.songId && (
        <div className="fixed inset-x-0 bottom-0 h-[90px] px-[20px] bg-[#130c1c] z-40 border-t border-t-border-primary">
          <Audio />
        </div>
      )}
      <ToastContainer
        position="bottom-right"
        containerId={1}
        toastStyle={{ backgroundColor: '#34224f', color: 'white', fontSize: '14px' }}
        theme="custom"
        hideProgressBar
        autoClose={3000}
        draggable
      />
    </div>
  );
}

export default DefaultLayout;
