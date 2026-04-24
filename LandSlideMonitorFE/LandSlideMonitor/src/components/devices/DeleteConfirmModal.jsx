const DeleteConfirmModal = ({ sensor, onClose, onConfirm, submitting }) => {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "var(--color-background-primary)",
                    borderRadius: 16,
                    border: "0.5px solid var(--color-border-tertiary)",
                    padding: "28px 32px",
                    width: 400,
                    boxSizing: "border-box",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <span
                        className="material-symbols-outlined"
                        style={{
                            fontSize: 40,
                            color: "#E24B4A",
                            display: "block",
                            marginBottom: 12,
                        }}
                    >
                        delete_forever
                    </span>
                    <h2
                        style={{
                            margin: "0 0 8px",
                            fontSize: 18,
                            fontWeight: 500,
                        }}
                    >
                        Xóa sensor?
                    </h2>
                    <p
                        style={{
                            margin: 0,
                            fontSize: 14,
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        Bạn có chắc muốn xóa <strong>{sensor?.name}</strong> (
                        {sensor?.sensorCode})? Hành động này không thể hoàn tác.
                    </p>
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        justifyContent: "center",
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{ padding: "8px 24px" }}
                        disabled={submitting}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => onConfirm(sensor.id)}
                        style={{
                            padding: "8px 24px",
                            background: "#E24B4A",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: 500,
                        }}
                        disabled={submitting}
                    >
                        {submitting ? "Đang xóa..." : "Xóa"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
