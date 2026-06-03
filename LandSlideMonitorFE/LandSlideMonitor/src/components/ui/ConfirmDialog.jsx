import Button from "./Button";
import Modal from "./Modal";

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Xác nhận",
    cancelLabel = "Hủy",
    variant = "danger",
    isLoading = false,
    onConfirm,
    onClose,
}) {
    return (
        <Modal
            open={open}
            title={title}
            description={description}
            onClose={onClose}
            size="sm"
            footer={
                <>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            <div className="flex items-center gap-3 rounded-lg bg-error-container/20 p-4 text-sm text-on-surface-variant">
                <span
                    className="material-symbols-outlined text-error"
                    aria-hidden="true"
                >
                    warning
                </span>
                <p>Hành động này sẽ được áp dụng ngay sau khi xác nhận.</p>
            </div>
        </Modal>
    );
}
