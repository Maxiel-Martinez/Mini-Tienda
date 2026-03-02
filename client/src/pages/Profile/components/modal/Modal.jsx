import "./Modal.css"
export const Modal = ({
  isOpen,
  title,
  onClose,
  children,
  footer,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onConfirm,
  formId,
  confirmType,
  showFooter = true,
}) => {
  if (!isOpen) return null;

  const finalConfirmType = confirmType || (formId ? "submit" : "button");

  return (
    <div id="modal-overlay" className="modal-overlay">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            id="btn-close"
            className="btn-close"
            type="button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {showFooter && (
          <div className="modal-footer">
            {footer ? (
              footer
            ) : (
              <>
                <button
                  id="btn-cancel"
                  className="btn-cancelar"
                  type="button"
                  onClick={onClose}
                >
                  {cancelText}
                </button>

                <button
                  className="btn-aceptar"
                  type={finalConfirmType}
                  form={formId}
                  onClick={!formId ? onConfirm : undefined}
                >
                  {confirmText}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
