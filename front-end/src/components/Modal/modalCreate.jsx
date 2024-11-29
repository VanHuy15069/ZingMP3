import { Button, Modal } from 'antd';

function ModalCreate({ children, title, isModalOpen, formId, onCancel, btnText, loading = false }) {
  return (
    <Modal
      centered
      forceRender
      title={<h2 className="text-[20px]">{title}</h2>}
      open={isModalOpen}
      onCancel={onCancel}
      footer={[
        <Button loading={loading} key="submit" type="primary" htmlType="submit" form={formId}>
          {btnText}
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
}

export default ModalCreate;
