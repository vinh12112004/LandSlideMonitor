import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { getAccessToken, getCurrentUser } from "./services/authService";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DevicesPage from "./pages/DevicesPage";
import HistoryPage from "./pages/HistoryPage";
import MapViewPage from "./pages/MapViewPage";
import LoginPage from "./pages/LoginPage";
import { initSignalR } from "./services/signalrInit";
import UsersPage from "./pages/UsersPage";

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

// Component layout chính cho các trang cần xác thực
function MainLayout({ searchQuery, onSearch, getPlaceholder, onLogout, user }) {
    return (
        <div className="bg-surface text-on-surface min-h-screen">
            <Sidebar onLogout={onLogout} user={user} />
            <Header
                searchQuery={searchQuery}
                onSearch={onSearch}
                placeholder={getPlaceholder()}
                user={user}
            />
            <Routes>
                <Route
                    path="/monitoring"
                    element={<PlaceholderPage title="Giám sát" />}
                />
                <Route path="/map" element={<MapViewPage />} />
                <Route
                    path="/alerts"
                    element={<PlaceholderPage title="Cảnh báo" />}
                />
                <Route
                    path="/history"
                    element={<HistoryPage searchQuery={searchQuery} />}
                />
                <Route
                    path="/devices"
                    element={<DevicesPage searchQuery={searchQuery} />}
                />
                <Route
                    path="/users"
                    element={<UsersPage searchQuery={searchQuery} />}
                />
                <Route
                    path="*"
                    element={<Navigate to="/monitoring" replace />}
                />
            </Routes>
        </div>
    );
}

export default function App() {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken());
    const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

    useEffect(() => {
        if (isAuthenticated) {
            initSignalR();
        }
    }, [isAuthenticated]);

    const getPlaceholder = () => {
        switch (location.pathname) {
            case "/devices":
                return "Tìm kiếm thiết bị theo ID hoặc vị trí...";
            case "/monitoring":
                return "Tìm kiếm dữ liệu giám sát...";
            case "/map":
                return "Tìm kiếm trên bản đồ...";
            case "/alerts":
                return "Tìm kiếm cảnh báo...";
            case "/history":
                return "Tìm kiếm lịch sử theo ID thiết bị...";
            case "/users":
                return "Tìm kiếm người dùng theo tên...";
            default:
                return "Tìm kiếm...";
        }
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setCurrentUser(getCurrentUser());
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    return (
        <Routes>
            {!isAuthenticated ? (
                <>
                    <Route
                        path="/login"
                        element={
                            <LoginPage onLoginSuccess={handleLoginSuccess} />
                        }
                    />
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                </>
            ) : (
                <Route
                    path="/*"
                    element={
                        <MainLayout
                            searchQuery={searchQuery}
                            onSearch={setSearchQuery}
                            getPlaceholder={getPlaceholder}
                            onLogout={handleLogout}
                            user={currentUser}
                        />
                    }
                />
            )}
        </Routes>
    );
}
