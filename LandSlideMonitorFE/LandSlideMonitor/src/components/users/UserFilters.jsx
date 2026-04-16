import React from "react";

const ROLE_OPTIONS = [
    { value: "all", label: "Tất cả vai trò" },
    { value: "Admin", label: "Admin" },
    { value: "Manager", label: "Manager" },
];

export default function UserFilters({ filters, onFilterChange, provinces }) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    return (
        <div className="mb-6 p-4 bg-surface-container-low rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search by Username */}
                <div>
                    <label
                        htmlFor="username-search"
                        className="block text-sm font-medium text-on-surface-variant mb-1"
                    >
                        Tìm theo tên người dùng
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                            search
                        </span>
                        <input
                            id="username-search"
                            name="username"
                            className="w-full p-2.5 pl-10 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="Nhập tên người dùng..."
                            type="text"
                            value={filters.username}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Filter by Province */}
                <div>
                    <label
                        htmlFor="province-filter"
                        className="block text-sm font-medium text-on-surface-variant mb-1"
                    >
                        Tỉnh/Thành phố
                    </label>
                    <select
                        id="province-filter"
                        name="provinceId"
                        value={filters.provinceId}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <option value="all">Tất cả tỉnh thành</option>
                        {provinces.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filter by Role */}
                <div>
                    <label
                        htmlFor="role-filter"
                        className="block text-sm font-medium text-on-surface-variant mb-1"
                    >
                        Vai trò
                    </label>
                    <select
                        id="role-filter"
                        name="role"
                        value={filters.role}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
