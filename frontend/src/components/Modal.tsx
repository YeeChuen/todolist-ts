import React, { ReactElement } from "react";

type ModalProps = {
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
};

const Modal = ({ title, onClose, children }: ModalProps) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="modal-title">{title}</span>
        <span className="modal-close" onClick={() => onClose()}>
          &times;
        </span>
        <div className="modal-container">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
