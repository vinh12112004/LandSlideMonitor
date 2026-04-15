import { useState } from "react";

const getInitialFormData = (user) => {
    if (user) {
        return {
            username: user.username,
            password: "",
            role: user.role,
            provinceIds: user.provinceIds || [],
        };
    }
    return {
        username: "",
        password: "",
        role: "Manager",
        provinceIds: [],
    };
};

export default function AddEditUserModal({
    user,
    provinces,
    onClose,
    onSave,
    submitting,
}) {
    const [formData, setFormData] = useState(() => getInitialFormData(user));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProvinceChange = (provinceId) => {
        setFormData((prev) => {
            const newProvinceIds = prev.provinceIds.includes(provinceId)
                ? prev.provinceIds.filter((id) => id !== provinceId)
                : [...prev.provinceIds, provinceId];
            return { ...prev, provinceIds: newProvinceIds };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = { ...formData };
        if (!dataToSave.password) {
            delete dataToSave.password;
        }
        onSave(dataToSave);
    };

    const isManager = formData.role === "Manager";

    return (
        <div
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-surface-container-high rounded-2xl shadow-xl w-full max-w-lg p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold text-on-surface mb-6">
                    {user ? "Sửa người dùng" : "Tạo người dùng mới"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={
                                user
                                    ? "Để trống nếu không muốn đổi mật khẩu"
                                    : ""
                            }
                            className="w-full p-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">
                            Vai trò
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    {isManager && (
                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-2">
                                Các tỉnh/thành phố quản lý
                            </label>
                            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-surface-container rounded-lg">
                                {provinces.map((p) => (
                                    <label
                                        key={p.id}
                                        className="flex items-center gap-2 p-2 rounded-md hover:bg-surface-container-highest cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.provinceIds.includes(
                                                p.id,
                                            )}
                                            onChange={() =>
                                                handleProvinceChange(p.id)
                                            }
                                            className="h-4 w-4 rounded text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm text-on-surface-variant">
                                            {p.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-full text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {submitting ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
