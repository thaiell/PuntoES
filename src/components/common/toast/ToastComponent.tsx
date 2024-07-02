interface ToastProps { // Toast Props
    message: string;
    type: "default" | "success" | "error";
    duration?: 250 | 500 | 750 | 1000 | 2000 | 3000;
    children?: React.ReactNode;
    onClose: () => void;
  }

const ToastComponent: React.FC<ToastProps> = ({ message, type, children, onClose }) => {
    const getTypeClass = () => { /* Toast Type Handler */
      switch (type) {
        case "default":
          return "bg-gray-200 text-black border-l-4 border-gray-400";
        case "success":
          return "bg-green-50 text-green-500 border-l-4 border-green-400";
        case "error":
          return "bg-red-50 text-red-500 border-l-4 border-red-500";
        default:
          return "bg-slate-200 text-white border-l-4 border-gray-400";
      }
    };
  

    const getIcon = () => {
      switch(type) {
        case "default":
          return <div className="w-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/>
          </svg>
        </div>
        case "error":
          return <div className="w-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m5.793-4.207a1 1 0 0 1 1.414 0L12 10.586l2.793-2.793a1 1 0 1 1 1.414 1.414L13.414 12l2.793 2.793a1 1 0 0 1-1.414 1.414L12 13.414l-2.793 2.793a1 1 0 0 1-1.414-1.414L10.586 12L7.793 9.207a1 1 0 0 1 0-1.414"/>
          </svg>
        </div>
        case "success":
          return <div className="w-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z"/>
          </svg>
        </div>
        default:
          return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/>
            </svg>
      } 
    }

    return (
      <div className={`relative flex items-center gap-2 ${getTypeClass()} max-w-96 py-2 px-12 rounded-md shadow-md`}>

        {getIcon()}

        <p>
          {message}
        </p>

        {children && ( 
            <div>
                {children}
            </div>
        )}
        <button onClick={onClose} className="absolute right-3 bottom-1/2 translate-y-1/2">
        <svg className="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="gray" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
        </button>
      </div>
    );
  };

  export default ToastComponent