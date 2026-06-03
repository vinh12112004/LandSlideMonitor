import { useEffect, useState } from "react";
import MapView from "../components/map/MapView";
import ProvinceFilter from "../components/map/ProvinceFilter";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import { useMapData } from "../features/map/useMapData";
import { useProvinces } from "../hooks/useProvinces";
import { injectMarkerStyles } from "../utils/map-helpers";

export default function MapViewPage() {
    const [selectedProvince, setSelectedProvince] = useState("all");
    const { provinces } = useProvinces();
    const { mapData, loading, error, refetch } = useMapData(selectedProvince);

    useEffect(() => {
        injectMarkerStyles();
    }, []);

    if (loading) {
        return (
            <section className="page-shell">
                <LoadingState message="Đang tải dữ liệu bản đồ..." />
            </section>
        );
    }

    if (error) {
        return (
            <section className="page-shell">
                <EmptyState
                    icon="error_outline"
                    title="Không thể tải bản đồ"
                    description={error}
                    actionLabel="Thử lại"
                    onAction={refetch}
                />
            </section>
        );
    }

    return (
        <section className="relative h-[calc(100vh-4rem)] overflow-hidden lg:h-screen">
            <ProvinceFilter
                provinces={provinces}
                selectedProvince={selectedProvince}
                onProvinceChange={setSelectedProvince}
            />
            <MapView
                mapData={mapData}
                provinces={provinces}
                selectedProvince={selectedProvince}
            />
        </section>
    );
}
