import React, { useState, useEffect } from "react";
import ToastComponent from "./ToastComponent";

interface ToastOptions {
  position?: "tl" | "t" | "tr" | "bl" | "b" | "br";
  duration?: 250 | 500 | 750 | 1000 | 2000 | 3000;
  children?: React.ReactNode;
}

interface ToastMessage {
  id: number;
  message: string;
  type: "default" | "success" | "error";
  options?: ToastOptions;
}

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastIdRef = React.useRef(0);
  const timeoutRefs = React.useRef<{ [key: number]: ReturnType<typeof setTimeout> }>({});

  useEffect(() => {
    const handleAddToast = (event: CustomEvent<ToastMessage>) => {
      const id = toastIdRef.current++;
      const { message, type, options = {} } = event.detail;
      const duration = options.duration || 3000;
      const newToast = { id, message, type, options };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      timeoutRefs.current[id] = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
        delete timeoutRefs.current[id];
      }, duration);
    };

    window.addEventListener("add-toast", handleAddToast as EventListener);

    return () => {
      window.removeEventListener("add-toast", handleAddToast as EventListener);
      Object.values(timeoutRefs.current).forEach(clearTimeout);
    };
  }, []);

  const handleRemoveToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
  };

  const getPositionClass = (position: "tl" | "t" | "tr" | "bl" | "b" | "br") => {
    switch (position) {
      case "tl":
        return "top-5 left-5 flex flex-col space-y-2";
      case "t":
        return "top-5 left-1/2 transform -translate-x-1/2 flex flex-col space-y-2";
      case "tr":
        return "top-5 right-5 flex flex-col space-y-2";
      case "bl":
        return "bottom-5 left-5 flex flex-col space-y-2";
      case "b":
        return "bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col space-y-2";
      case "br":
        return "bottom-5 right-5 flex flex-col space-y-2";
      default:
        return "top-5 right-5 flex flex-col space-y-2";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {["tl", "t", "tr", "bl", "b", "br"].map((position) => (
        <div key={position} className={`absolute ${getPositionClass(position as any)}`}>
          {toasts
            .filter((toast) => toast.options?.position === position)
            .map((toast) => (
              <ToastComponent
                key={toast.id}
                type={toast.type}
                message={toast.message}
                children={toast.options?.children}
                onClose={() => handleRemoveToast(toast.id)}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
