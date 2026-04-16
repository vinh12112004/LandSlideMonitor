import React from "react";

const STATUS_OPTIONS = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "1", label: "Online" },
    { value: "0", label: "Offline" },
    { value: "2", label: "Pin yếu" },
    { value: "3", label: "Bảo trì" },
];

export default function DeviceFilters({
    filters,
    onFilterChange,
    provinces,
    searchQuery,
    onSearchChange,
    user,
}) {
    const isAdmin = user?.role === "Admin";
    return (
        <div className="mb-6 p-4 bg-surface-container-low rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div>
                    <label
                        htmlFor="search-input"
                        className="block text-sm font-medium text-on-surface-variant mb-1"
                    >
                        Tìm kiếm
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                            search
                        </span>
                        <input
                            id="search-input"
                            className="w-full p-2.5 pl-10 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-sm"
                            placeholder="Tìm theo tên hoặc mã..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
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
                        onChange={(e) =>
                            onFilterChange("provinceId", e.target.value)
                        }
                        disabled={!isAdmin && provinces.length <= 1}
                        className="w-full p-2.5 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isAdmin && (
                            <option value="all">Tất cả tỉnh thành</option>
                        )}
                        {provinces.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filter by Status */}
                <div>
                    <label
                        htmlFor="status-filter"
                        className="block text-sm font-medium text-on-surface-variant mb-1"
                    >
                        Trạng thái
                    </label>
                    <select
                        id="status-filter"
                        name="status"
                        value={filters.status}
                        onChange={(e) =>
                            onFilterChange("status", e.target.value)
                        }
                        className="w-full p-2.5 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-sm"
                    >
                        {STATUS_OPTIONS.map((opt) => (
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
