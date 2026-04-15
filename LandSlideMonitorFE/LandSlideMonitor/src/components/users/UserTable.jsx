export default function UserTable({
    users,
    onEdit,
    // onDelete,
    getProvinceName,
}) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-outline-variant/30">
                <thead className="bg-surface-container">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant tracking-wider"
                        >
                            Người dùng
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
                        >
                            Vai trò
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
                        >
                            Tỉnh / Thành phố quản lý
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Hành động</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 bg-surface-container-lowest">
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-on-surface">
                                    {user.username}
                                </div>
                                <div className="text-xs text-on-surface-variant">
                                    ID: {user.id}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.role === "Admin"
                                            ? "bg-primary-container text-on-primary-container"
                                            : "bg-secondary-container text-on-secondary-container"
                                    }`}
                                >
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                                {user.provinceIds && user.provinceIds.length > 0
                                    ? user.provinceIds
                                          .map((id) => getProvinceName(id))
                                          .join(", ")
                                    : "Không có"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(user)}
                                    className="text-primary hover:text-primary/80 transition-colors"
                                >
                                    Sửa
                                </button>
                                {/* Add delete button when API is ready */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
