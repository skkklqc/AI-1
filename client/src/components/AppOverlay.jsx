import { useEffect, useState } from "react";

const toneIcons = {
  success: "✓",
  info: "i",
  warning: "!",
  error: "×"
};

function ToastStack({ toasts }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`app-toast app-toast-${toast.type}`}>
          <span className="app-toast-icon">{toneIcons[toast.type] || toneIcons.info}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

function AppDialog({ dialog, onClose }) {
  const [inputValue, setInputValue] = useState(dialog?.defaultValue || "");

  useEffect(() => {
    setInputValue(dialog?.defaultValue || "");
  }, [dialog]);

  if (!dialog) return null;

  function handleConfirm() {
    if (dialog.kind === "prompt") {
      onClose(inputValue.trim() || dialog.defaultValue || "");
      return;
    }
    onClose(dialog.kind === "confirm" ? true : undefined);
  }

  function handleCancel() {
    onClose(dialog.kind === "prompt" ? null : false);
  }

  function handleBackdropClick() {
    if (dialog.kind === "alert") {
      onClose(undefined);
      return;
    }
    handleCancel();
  }

  return (
    <div className="overlay-backdrop" onClick={handleBackdropClick}>
      <div
        className={`app-dialog app-dialog-${dialog.tone || "info"}`}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`app-dialog-icon app-dialog-icon-${dialog.tone || "info"}`}>
          {toneIcons[dialog.tone] || toneIcons.info}
        </div>
        <h3>{dialog.title}</h3>
        {dialog.message && <p className="app-dialog-message">{dialog.message}</p>}
        {dialog.kind === "prompt" && (
          <input
            autoFocus
            value={inputValue}
            placeholder={dialog.placeholder}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleConfirm();
            }}
          />
        )}
        <div className="app-dialog-actions">
          {dialog.kind !== "alert" && (
            <button type="button" className="ghost" onClick={handleCancel}>
              {dialog.cancelText || "取消"}
            </button>
          )}
          <button type="button" onClick={handleConfirm}>
            {dialog.confirmText || "确认"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BookDetailSheet({ book, onClose }) {
  if (!book) return null;

  return (
    <div className="overlay-backdrop overlay-backdrop-sheet" onClick={onClose}>
      <section className="book-detail-sheet" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="sheet-close ghost" onClick={onClose} aria-label="关闭">
          ×
        </button>
        {book.imageUrls?.[0] && (
          <img className="book-detail-image" src={book.imageUrls[0]} alt={book.title} />
        )}
        <div className="book-detail-body">
          <div className="book-detail-head">
            <h2>{book.title}</h2>
            <span className="price">¥{book.price}</span>
          </div>
          <p>{book.author || "未知作者"} · {book.courseName || "未绑定课程"} · {book.condition}</p>
          <p className="muted">{book.description}</p>
          {!!book.tags?.length && (
            <div className="tags">
              {book.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
          <div className="book-detail-meta">
            <div>
              <span className="meta-label">联系方式</span>
              <strong>{book.contactMethod || "未填写"}</strong>
            </div>
            <div>
              <span className="meta-label">交易备注</span>
              <strong>{book.tradeNote || "无"}</strong>
            </div>
            {book.owner && (
              <div>
                <span className="meta-label">卖家</span>
                <strong>{book.owner.nickname}{book.owner.campus ? ` · ${book.owner.campus}` : ""}</strong>
              </div>
            )}
          </div>
          <button type="button" className="sheet-primary" onClick={onClose}>
            知道了
          </button>
        </div>
      </section>
    </div>
  );
}

export default function AppOverlay({ toasts, dialog, bookDetail, onDialogClose, onBookDetailClose }) {
  useEffect(() => {
    if (!dialog && !bookDetail) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event) {
      if (event.key === "Escape") {
        if (dialog) onDialogClose(dialog.kind === "confirm" ? false : null);
        else onBookDetailClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dialog, bookDetail, onDialogClose, onBookDetailClose]);

  return (
    <>
      <ToastStack toasts={toasts} />
      <AppDialog dialog={dialog} onClose={onDialogClose} />
      <BookDetailSheet book={bookDetail} onClose={onBookDetailClose} />
    </>
  );
}
