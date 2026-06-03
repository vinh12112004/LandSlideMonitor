import { useCallback, useEffect, useMemo, useState } from "react";
import thresholdService from "../../services/thresholdService";
import channelDefinitionService from "../../services/channelDefinitionService";

export function useThresholds() {
    const [thresholds, setThresholds] = useState([]);
    const [channelDefinitions, setChannelDefinitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [channelsLoading, setChannelsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mutationError, setMutationError] = useState(null);
    const [tab, setTab] = useState("thresholds");
    const [filterType, setFilterType] = useState("all");
    const [submitting, setSubmitting] = useState(false);
    const [typeSubmitting, setTypeSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fetchThresholds = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await thresholdService.getAll();
            setThresholds(data || []);
        } catch (err) {
            setError("Không thể tải cấu hình ngưỡng.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchChannelDefinitions = useCallback(async () => {
        try {
            setChannelsLoading(true);
            const data = await channelDefinitionService.getAll();
            setChannelDefinitions(data || []);
        } catch (err) {
            setMutationError("Không thể tải danh sách kênh.");
            console.error(err);
        } finally {
            setChannelsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchThresholds();
        fetchChannelDefinitions();
    }, [fetchChannelDefinitions, fetchThresholds]);

    const filteredThresholds = useMemo(() => {
        if (filterType === "all") return thresholds;
        return thresholds.filter(
            (threshold) =>
                threshold.channelDefinitionId === parseInt(filterType, 10),
        );
    }, [filterType, thresholds]);

    const saveThreshold = useCallback(
        async (form, editing) => {
            try {
                setSubmitting(true);
                setMutationError(null);
                if (editing) await thresholdService.update(editing.id, form);
                else await thresholdService.create(form);
                await fetchThresholds();
                return true;
            } catch (err) {
                setMutationError(
                    err?.response?.data || "Lưu thất bại. Vui lòng thử lại.",
                );
                console.error(err);
                return false;
            } finally {
                setSubmitting(false);
            }
        },
        [fetchThresholds],
    );

    const deleteThreshold = useCallback(
        async (id) => {
            try {
                setDeletingId(id);
                setMutationError(null);
                await thresholdService.delete(id);
                await fetchThresholds();
                return true;
            } catch (err) {
                setMutationError("Xóa thất bại. Vui lòng thử lại.");
                console.error(err);
                return false;
            } finally {
                setDeletingId(null);
            }
        },
        [fetchThresholds],
    );

    const saveChannel = useCallback(
        async (form, editingType) => {
            try {
                setTypeSubmitting(true);
                setMutationError(null);
                if (editingType) {
                    await channelDefinitionService.update(editingType.id, form);
                } else {
                    await channelDefinitionService.create(form);
                }
                await fetchChannelDefinitions();
                return true;
            } catch (err) {
                setMutationError(
                    err?.response?.data || "Lưu thất bại. Vui lòng thử lại.",
                );
                console.error(err);
                return false;
            } finally {
                setTypeSubmitting(false);
            }
        },
        [fetchChannelDefinitions],
    );

    const deleteChannel = useCallback(
        async (id) => {
            try {
                setDeletingId(id);
                setMutationError(null);
                await channelDefinitionService.delete(id);
                await fetchChannelDefinitions();
                return true;
            } catch (err) {
                setMutationError("Xóa thất bại. Vui lòng thử lại.");
                console.error(err);
                return false;
            } finally {
                setDeletingId(null);
            }
        },
        [fetchChannelDefinitions],
    );

    return {
        thresholds,
        filteredThresholds,
        channelDefinitions,
        loading,
        channelsLoading,
        error,
        mutationError,
        setMutationError,
        tab,
        setTab,
        filterType,
        setFilterType,
        submitting,
        typeSubmitting,
        deletingId,
        saveThreshold,
        deleteThreshold,
        saveChannel,
        deleteChannel,
        refetch: fetchThresholds,
    };
}
