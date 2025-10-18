import React from "react";
import { Modal as AntModal } from "antd";

const Modal = ({ isModelOpen, setIsModelOpen, children }) => {
  return (
    <AntModal
      open={isModelOpen}
      onCancel={() => setIsModelOpen(false)}
      footer={null}
      centered
      width={450}
      maskClosable={true}
      destroyOnClose={true}
    >
      {children}
    </AntModal>
  );
};

export default Modal;
