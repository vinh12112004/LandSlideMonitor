import ConfirmDialog from "../ui/ConfirmDialog";

const DeleteConfirmModal = ({ sensor, onClose, onConfirm, submitting }) => {
    return (
        <ConfirmDialog
            open
            title="Xóa sensor?"
            description={`Bạn có chắc muốn xóa ${sensor?.name ?? "sensor này"} (${sensor?.sensorCode ?? "N/A"})? Hành động này không thể hoàn tác.`}
            confirmLabel="Xóa"
            isLoading={submitting}
            onClose={onClose}
            onConfirm={() => onConfirm(sensor.id)}
        />
    );
};

export default DeleteConfirmModal;
