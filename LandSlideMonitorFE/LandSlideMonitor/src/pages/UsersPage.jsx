import { useState } from "react";
import AddEditUserModal from "../components/users/AddEditUserModal";
import Pagination from "../components/common/Pagination";
import UserFilters from "../components/users/UserFilters";
import UserTable from "../components/users/UserTable";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import { useProvinces } from "../hooks/useProvinces";
import { useUsers } from "../features/users/useUsers";

export default function UsersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const { provinces } = useProvinces();
    const {
        users,
        query,
        loading,
        error,
        mutationError,
        setMutationError,
        submitting,
        pagination,
        setFilter,
        setPage,
        saveUser,
        refetch,
    } = useUsers();

    const openAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
        setMutationError(null);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
        setMutationError(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = async (userData) => {
        const saved = await saveUser(userData, editingUser);
        if (saved) closeModal();
    };

    const getProvinceName = (id) =>
        provinces.find((province) => province.id === id)?.name || "Không rõ";

    if (loading && users.length === 0) {
        return (
            <section className="page-shell">
                <LoadingState message="Đang tải người dùng..." />
            </section>
        );
    }

    if (error) {
        return (
            <section className="page-shell">
                <EmptyState
                    icon="error_outline"
                    title="Đã xảy ra lỗi"
                    description={error}
                    actionLabel="Thử lại"
                    onAction={refetch}
                />
            </section>
        );
    }

    return (
        <section className="page-shell">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                        Access Control
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                        Quản lý người dùng
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                        Tạo, sửa và quản lý tài khoản và quyền của người dùng.
                    </p>
                </div>
                <Button onClick={openAddModal} className="md:self-center">
                    <span className="material-symbols-outlined" aria-hidden="true">
                        add
                    </span>
                    Tạo người dùng mới
                </Button>
            </div>

            {mutationError && (
                <div
                    className="mb-5 rounded-lg border border-error/20 bg-error-container/25 px-4 py-3 text-sm font-medium text-on-error-container"
                    role="alert"
                >
                    {mutationError}
                </div>
            )}

            <div className="space-y-6">
                <UserFilters
                    filters={{
                        username: query.username,
                        provinceId: query.provinceId,
                        role: query.role,
                    }}
                    onFilterChange={setFilter}
                    provinces={provinces}
                />
                <div>
                    <UserTable
                        users={users}
                        onEdit={openEditModal}
                        getProvinceName={getProvinceName}
                        loading={loading}
                    />
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        total={pagination.totalCount}
                        pageSize={pagination.pageSize}
                        onPageChange={setPage}
                    />
                </div>
            </div>

            {isModalOpen && (
                <AddEditUserModal
                    key={editingUser?.id || "new"}
                    user={editingUser}
                    provinces={provinces}
                    onClose={closeModal}
                    onSave={handleSaveUser}
                    submitting={submitting}
                />
            )}
        </section>
    );
}
