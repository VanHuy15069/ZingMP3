import { Button, ConfigProvider, Modal } from 'antd';

function ModalPlaylist({
  isOpen,
  onOk,
  onCancel,
  children,
  disabled = true,
  title,
  isAddSong = false,
  isUpdate = false,
}) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            contentBg: '#34224f',
            headerBg: '#34224f',
            titleColor: '#fff',
            titleFontSize: '18px',
            colorText: '#fff',
            colorIcon: '#fff',
            colorIconHover: '#fff',
          },
        },
      }}
    >
      <Modal
        title={<p className="text-center">{title}</p>}
        width={330}
        onCancel={onCancel}
        open={isOpen}
        onOk={onOk}
        centered
        footer={
          isAddSong
            ? []
            : [
                <div key={0} className="text-center">
                  <Button
                    onClick={onOk}
                    disabled={disabled}
                    key="submit"
                    type="noThing"
                    className={`py-[8px] w-full rounded-[999px] border-none uppercase ${
                      disabled ? 'bg-[#683898] text-alpha' : 'bg-purple-primary text-white'
                    }`}
                  >
                    {isUpdate ? 'Lưu' : 'Tạo mới'}
                  </Button>
                </div>,
              ]
        }
      >
        {children}
      </Modal>
    </ConfigProvider>
  );
}
export default ModalPlaylist;
