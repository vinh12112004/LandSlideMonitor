import DeviceRow from "./DeviceRow";

export default function DeviceTable({ devices, onDelete, onEdit, deletingId }) {
    return (
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl p-4 shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-outline-variant/30">
                            <th className="px-6 py-4">Tên thiết bị</th>
                            <th className="px-6 py-4">Mã thiết bị</th>
                            <th className="px-6 py-4">Tỉnh / Thành phố</th>
                            <th className="px-6 py-4 text-center">
                                Trạng thái
                            </th>
                            <th className="px-6 py-4">Lần cuối hoạt động</th>
                            <th className="px-6 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {devices.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-10 text-center text-on-surface-variant text-sm"
                                >
                                    Không tìm thấy thiết bị nào.
                                </td>
                            </tr>
                        ) : (
                            devices.map((device) => (
                                <DeviceRow
                                    key={device.deviceId}
                                    device={device}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                    deletingId={deletingId}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
