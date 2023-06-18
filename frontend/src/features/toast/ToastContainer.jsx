import { useSelector, useDispatch } from "react-redux";
import { Toast } from "./Toast";
import { selectToasts, removeToast } from "./toastSlice";

export const ToastContainer = ({ children }) => {
  const toasts = useSelector(selectToasts);
  const dispatch = useDispatch();

  return (
    <div className="toast z-50 w-full md:toast-top md:w-[400px] overflow-clip items-center md:items-start">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          timeout={toast.timeout}
          autoDismiss={toast.autoDismiss}
          onDismiss={() => dispatch(removeToast(toast.id))}
        >
          {toast.message}
        </Toast>
      ))}
    </div>
  )
}