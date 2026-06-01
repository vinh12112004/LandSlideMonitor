import { useState, useEffect, useCallback } from "react";
import userService from "../services/userService";
import { getProvinces } from "../services/provinceService";
import UserTable from "../components/users/UserTable";
import AddEditUserModal from "../components/users/AddEditUserModal";
import Pagination from "../components/common/Pagination";
import UserFilters from "../components/users/UserFilters";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [filters, setFilters] = useState({
        username: "",
        provinceId: "all",
        role: "all",
    });

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        pageSize: 10,
    });

    const fetchUsers = useCallback(
        async (page = 1) => {
            try {
                setLoading(true);
                setError(null);
                const params = {
                    pageNumber: page,
                    pageSize: pagination.pageSize,
                    username: filters.username || null,
                    role: filters.role !== "all" ? filters.role : null,
                    provinceId:
                        filters.provinceId !== "all"
                            ? parseInt(filters.provinceId)
                            : null,
                };
                // Remove null or undefined params
                Object.keys(params).forEach(
                    (key) => params[key] == null && delete params[key],
                );

                const result = await userService.getUsers(params);
                setUsers(result.data);
                setPagination({
                    currentPage: result.currentPage,
                    totalPages: result.totalPages,
                    totalCount: result.totalCount,
                    pageSize: result.pageSize,
                });
            } catch (err) {
                setError(
                    "Không thể tải danh sách người dùng. Vui lòng thử lại.",
                );
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        [pagination.pageSize, filters], // Depend on filters now
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPagination((p) => ({ ...p, currentPage: 1 }));
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [filters]);

    useEffect(() => {
        fetchUsers(pagination.currentPage);
    }, [pagination.currentPage, fetchUsers]);

    useEffect(() => {
        fetchProvinces();
    }, []);

    const fetchProvinces = async () => {
        try {
            const data = await getProvinces();
            setProvinces(data);
        } catch (err) {
            console.error("Lấy danh sách tỉnh thành thất bại", err);
        }
    };

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const getProvinceName = (id) => {
        return provinces.find((p) => p.id === id)?.name || "Không rõ";
    };

    const handleOpenAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = async (userData) => {
        try {
            setSubmitting(true);
            if (editingUser) {
                await userService.updateUser(editingUser.id, userData);
            } else {
                await userService.createUser(userData);
            }
            fetchUsers(pagination.currentPage); // Refresh list
            handleCloseModal();
        } catch (err) {
            alert("Lưu thất bại. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && users.length === 0) {
        return (
            <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-primary animate-spin block mb-4">
                        progress_activity
                    </span>
                    <p className="text-on-surface-variant text-sm">
                        Đang tải người dùng...
                    </p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-tertiary block mb-4">
                        error_outline
                    </span>
                    <p className="text-on-surface font-bold mb-2">
                        Đã xảy ra lỗi
                    </p>
                    <p className="text-on-surface-variant text-sm mb-6">
                        {error}
                    </p>
                    <button
                        onClick={() => fetchUsers(1)}
                        className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)]">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">
                        Quản lý người dùng
                    </h2>
                    <p className="text-on-surface-variant font-body">
                        Tạo, sửa và quản lý tài khoản và quyền của người dùng.
                    </p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                    <span className="material-symbols-outlined">add</span>
                    <span>Tạo người dùng mới</span>
                </button>
            </div>

            <UserFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                provinces={provinces}
            />

            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
                <UserTable
                    users={users}
                    onEdit={handleOpenEditModal}
                    getProvinceName={getProvinceName}
                />
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    total={pagination.totalCount}
                    pageSize={pagination.pageSize}
                    onPageChange={(page) =>
                        setPagination((p) => ({ ...p, currentPage: page }))
                    }
                />
            </div>

            {isModalOpen && (
                <AddEditUserModal
                    key={editingUser?.id || "new"}
                    user={editingUser}
                    provinces={provinces}
                    onClose={handleCloseModal}
                    onSave={handleSaveUser}
                    submitting={submitting}
                />
            )}
        </main>
    );
}
