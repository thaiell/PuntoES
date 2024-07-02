interface ToastOptions {
  position: "tl" | "t" | "tr" | "bl" | "b" | "br";
  duration?: 250 | 500 | 750 | 1000 | 2000 | 3000;
  children?: React.ReactNode;
}

interface ToastMessage {
  message: string;
  type: "default" | "success" | "error";
  options?: ToastOptions;
}

const createToastEvent = (message: string, type: "default" | "success" | "error", options?: ToastOptions) => {
  
  const event = new CustomEvent<ToastMessage>("add-toast", {
    detail: { message, type, options }
  });
  window.dispatchEvent(event);
};

const toast = {
  default: (message: string, options?: ToastOptions) => createToastEvent(message, "default", options),
  success: (message: string, options?: ToastOptions) => createToastEvent(message, "success", options),
  error: (message: string, options?: ToastOptions) => createToastEvent(message, "error", options),
};

export default toast;
