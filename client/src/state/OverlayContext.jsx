import { createContext, useCallback, useContext, useRef, useState } from "react";
import AppOverlay from "../components/AppOverlay.jsx";

const OverlayContext = createContext(null);

export function OverlayProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);
  const [bookDetail, setBookDetail] = useState(null);
  const dialogResolveRef = useRef(null);

  const closeDialog = useCallback((value) => {
    dialogResolveRef.current?.(value);
    dialogResolveRef.current = null;
    setDialog(null);
  }, []);

  const showToast = useCallback((message, type = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 2800);
  }, []);

  const showAlert = useCallback(({ title = "提示", message, confirmText = "知道了", tone = "info" }) => {
    return new Promise((resolve) => {
      dialogResolveRef.current = resolve;
      setDialog({ kind: "alert", title, message, confirmText, tone });
    });
  }, []);

  const showConfirm = useCallback(({ title = "确认操作", message, confirmText = "确认", cancelText = "取消", tone = "warning" }) => {
    return new Promise((resolve) => {
      dialogResolveRef.current = resolve;
      setDialog({ kind: "confirm", title, message, confirmText, cancelText, tone });
    });
  }, []);

  const showPrompt = useCallback(({ title = "请输入", message, defaultValue = "", confirmText = "确认", cancelText = "取消", placeholder = "" }) => {
    return new Promise((resolve) => {
      dialogResolveRef.current = resolve;
      setDialog({ kind: "prompt", title, message, defaultValue, confirmText, cancelText, placeholder });
    });
  }, []);

  const showBookDetail = useCallback((book) => {
    setBookDetail(book);
  }, []);

  const closeBookDetail = useCallback(() => {
    setBookDetail(null);
  }, []);

  return (
    <OverlayContext.Provider value={{ showToast, showAlert, showConfirm, showPrompt, showBookDetail }}>
      {children}
      <AppOverlay
        toasts={toasts}
        dialog={dialog}
        bookDetail={bookDetail}
        onDialogClose={closeDialog}
        onBookDetailClose={closeBookDetail}
      />
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used within OverlayProvider");
  }
  return context;
}
