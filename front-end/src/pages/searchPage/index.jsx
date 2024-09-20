import { ConfigProvider, Tabs } from 'antd';
import { useSearchParams } from 'react-router-dom';
import SearchAll from './searchAll';
import SearchSongs from './searchSongs';
import SearchAlbum from './searchAlbum';
import { useState } from 'react';
import SearchSinger from './searchSinger';

function SearchPage() {
  const [searchParam] = useSearchParams();
  const [activeKey, setActiveKey] = useState('2');
  const searchValue = decodeURIComponent(searchParam.get('q'));
  const handleChange = (key) => {
    setActiveKey(key);
  };
  const items = [
    {
      key: '1',
      label: (
        <span className="text-[24px] pr-[20px] font-bold border-r border-r-border-primary capitalize">
          Kết quả tìm kiếm
        </span>
      ),
      children: <></>,
      disabled: true,
    },
    {
      key: '2',
      label: 'TẤT CẢ',
      children: (
        <SearchAll
          value={searchValue}
          navigateSongs={() => setActiveKey('3')}
          navigateAlbum={() => setActiveKey('4')}
          navigateSinger={() => setActiveKey('5')}
        />
      ),
    },
    {
      key: '3',
      label: 'BÀI HÁT',
      children: <SearchSongs searchValue={searchValue} />,
    },
    {
      key: '4',
      label: 'ALBUM',
      children: <SearchAlbum searchValue={searchValue} />,
    },
    {
      key: '5',
      label: 'NGHỆ SĨ',
      children: <SearchSinger searchValue={searchValue} />,
    },
  ];
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorBorderSecondary: 'hsla(0,0%,100%,0.1)',
            colorText: '#dadada',
            colorTextDisabled: '#fff',
          },
          components: {
            Tabs: {
              itemSelectedColor: '#9b4de0',
              inkBarColor: '#9b4de0',
              itemHoverColor: '#9b4de0',
              itemActiveColor: '#9b4de0',
              horizontalItemGutter: 40,
            },
          },
        }}
      >
        <Tabs
          onChange={handleChange}
          defaultActiveKey={2}
          activeKey={activeKey}
          items={items}
          className="text-white select-none"
        />
      </ConfigProvider>
    </div>
  );
}

export default SearchPage;
