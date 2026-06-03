import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Select from "../ui/Select";

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
        <Modal
            title={user ? "Sửa người dùng" : "Tạo người dùng mới"}
            description="Quản lý vai trò và phạm vi tỉnh/thành phố được phân quyền."
            onClose={onClose}
            size="lg"
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        form="user-form"
                        isLoading={submitting}
                    >
                        Lưu
                    </Button>
                </>
            }
        >
            <form id="user-form" onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Tên đăng nhập"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoFocus
                />
                <Input
                    label="Mật khẩu"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={user ? "Để trống nếu không muốn đổi mật khẩu" : ""}
                    autoComplete={user ? "new-password" : "current-password"}
                />
                <Select
                    label="Vai trò"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                </Select>
                {isManager && (
                    <fieldset>
                        <legend className="mb-2 text-xs font-semibold text-on-surface-variant">
                            Các tỉnh/thành phố quản lý
                        </legend>
                        <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto rounded-lg border border-outline-variant/40 bg-surface-container-low p-2 sm:grid-cols-2 md:grid-cols-3">
                            {provinces.map((p) => (
                                <label
                                    key={p.id}
                                    className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm text-on-surface-variant transition hover:bg-surface-container-high"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.provinceIds.includes(
                                            p.id,
                                        )}
                                        onChange={() =>
                                            handleProvinceChange(p.id)
                                        }
                                        className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/25"
                                    />
                                    <span>{p.name}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                )}
            </form>
        </Modal>
    );
}
