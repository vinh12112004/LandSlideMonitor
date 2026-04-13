import DeviceRow from "./DeviceRow";

export default function DeviceTable({ devices, onDelete, onEdit, deletingId }) {
    return (
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl p-4 shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Device ID</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4">Last Seen</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {devices.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6} // Updated colspan
                                    className="px-6 py-10 text-center text-on-surface-variant text-sm"
                                >
                                    No devices found.
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
