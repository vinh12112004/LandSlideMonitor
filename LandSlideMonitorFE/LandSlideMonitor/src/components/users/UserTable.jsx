import DataTable from "../ui/DataTable";

export default function UserTable({ users, onEdit, getProvinceName, loading }) {
    const columns = [
        {
            key: "username",
            label: "Người dùng",
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-on-primary-container">
                            {value.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="font-semibold text-on-surface text-sm">
                            {value}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                            ID: {row.id}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "role",
            label: "Vai trò",
            render: (value) => (
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        value === "Admin"
                            ? "bg-primary-container text-on-primary-container"
                            : "bg-secondary-container text-on-secondary-container"
                    }`}
                >
                    {value}
                </span>
            ),
        },
        {
            key: "provinceIds",
            label: "Tỉnh / Thành phố quản lý",
            render: (value) => {
                if (!value || value.length === 0) {
                    return (
                        <span className="text-on-surface-variant/50 italic text-xs">
                            Không có
                        </span>
                    );
                }
                return (
                    <div className="flex flex-wrap gap-1">
                        {value.map((id) => (
                            <span
                                key={id}
                                className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-xs rounded-md"
                            >
                                {getProvinceName(id)}
                            </span>
                        ))}
                    </div>
                );
            },
        },
        {
            key: "_actions",
            label: "",
            align: "right",
            render: (_, row) => (
                <button
                    onClick={() => onEdit(row)}
                    className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                    title="Chỉnh sửa"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        edit
                    </span>
                </button>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={users}
            rowKey="id"
            loading={loading}
            emptyIcon="group"
            emptyText="Không tìm thấy người dùng nào."
        />
    );
}
