import React, { useEffect, useState } from "react";
import "./style.css";

interface ToastMessage {
  type: "info" | "warning" | "error" | string;
  message: string;
}

interface ToastProps {
  message: ToastMessage;
  handleToastClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message: { type, message },
  handleToastClose,
}) => {
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    if (message) {
      setShowToast(true);
    }
  }, [message]);

  const handleClose = () => {
    setShowToast(false);
    handleToastClose();
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      handleToastClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    showToast && (
      <div className={`toastContainer `}>
        <div className={`toast toast-${type}`}>
          <div>{message}</div>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    )
  );
};

export default Toast;
