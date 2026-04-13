import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DevicesPage from "./pages/DevicesPage";
import HistoryPage from "./pages/HistoryPage";
import MapViewPage from "./pages/MapViewPage";
import { initSignalR } from "./services/signalrInit";

// Placeholder
function PlaceholderPage({ title }) {
    return (
        <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)] flex items-center justify-center">
            <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">
                    construction
                </span>
                <h2 className="text-2xl font-extrabold text-on-surface">
                    {title}
                </h2>
                <p className="text-on-surface-variant mt-2 text-sm">
                    Trang này đang được phát triển.
                </p>
            </div>
        </main>
    );
}

export default function App() {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        initSignalR();
    }, []);

    const getPlaceholder = () => {
        switch (location.pathname) {
            case "/devices":
                return "Search devices by ID or location...";
            case "/monitoring":
                return "Search monitoring data...";
            case "/map":
                return "Search on map...";
            case "/alerts":
                return "Search alerts...";
            case "/history":
                return "Search history by device ID...";
            default:
                return "Search...";
        }
    };

    return (
        <div className="bg-surface text-on-surface min-h-screen">
            <Sidebar />
            <Header
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                placeholder={getPlaceholder()}
            />

            <Routes>
                <Route
                    path="/monitoring"
                    element={<PlaceholderPage title="Monitoring" />}
                />
                <Route path="/map" element={<MapViewPage />} />
                <Route
                    path="/alerts"
                    element={<PlaceholderPage title="Alerts" />}
                />
                <Route
                    path="/history"
                    element={<HistoryPage searchQuery={searchQuery} />}
                />
                <Route
                    path="/devices"
                    element={<DevicesPage searchQuery={searchQuery} />}
                />
                {/* default */}
                <Route
                    path="*"
                    element={<PlaceholderPage searchQuery={searchQuery} />}
                />
            </Routes>
        </div>
    );
}
