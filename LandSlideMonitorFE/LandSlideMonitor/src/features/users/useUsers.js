import { useCallback, useEffect, useState } from "react";
import userService from "../../services/userService";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const DEFAULT_QUERY = {
    username: "",
    provinceId: "all",
    role: "all",
    currentPage: 1,
    pageSize: 10,
};

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState(DEFAULT_QUERY);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mutationError, setMutationError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [totals, setTotals] = useState({
        totalPages: 1,
        totalCount: 0,
        pageSize: 10,
    });
    const debouncedUsername = useDebouncedValue(query.username, 300);

    const fetchUsers = useCallback(
        async (page = query.currentPage) => {
            try {
                setLoading(true);
                setError(null);
                const params = {
                    pageNumber: page,
                    pageSize: query.pageSize,
                    username: debouncedUsername || null,
                    role: query.role !== "all" ? query.role : null,
                    provinceId:
                        query.provinceId !== "all"
                            ? parseInt(query.provinceId, 10)
                            : null,
                };
                Object.keys(params).forEach((key) => {
                    if (params[key] == null) delete params[key];
                });

                const result = await userService.getUsers(params);
                setUsers(result.data || []);
                setTotals({
                    totalPages: result.totalPages || 1,
                    totalCount: result.totalCount || 0,
                    pageSize: result.pageSize || query.pageSize,
                });
                setQuery((prev) => ({
                    ...prev,
                    currentPage: result.currentPage || page,
                }));
            } catch (err) {
                setError(
                    "Không thể tải danh sách người dùng. Vui lòng thử lại.",
                );
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        [
            debouncedUsername,
            query.currentPage,
            query.pageSize,
            query.provinceId,
            query.role,
        ],
    );

    useEffect(() => {
        fetchUsers(query.currentPage);
    }, [fetchUsers, query.currentPage]);

    const setFilter = useCallback((name, value) => {
        setQuery((prev) => ({ ...prev, [name]: value, currentPage: 1 }));
    }, []);

    const setPage = useCallback((page) => {
        setQuery((prev) => ({ ...prev, currentPage: page }));
    }, []);

    const saveUser = useCallback(
        async (userData, editingUser) => {
            try {
                setSubmitting(true);
                setMutationError(null);
                if (editingUser) {
                    await userService.updateUser(editingUser.id, userData);
                } else {
                    await userService.createUser(userData);
                }
                await fetchUsers(query.currentPage);
                return true;
            } catch (err) {
                setMutationError("Lưu thất bại. Vui lòng thử lại.");
                console.error(err);
                return false;
            } finally {
                setSubmitting(false);
            }
        },
        [fetchUsers, query.currentPage],
    );

    return {
        users,
        query,
        loading,
        error,
        mutationError,
        setMutationError,
        submitting,
        pagination: {
            currentPage: query.currentPage,
            totalPages: totals.totalPages,
            totalCount: totals.totalCount,
            pageSize: totals.pageSize,
        },
        setFilter,
        setPage,
        saveUser,
        refetch: () => fetchUsers(1),
    };
}
