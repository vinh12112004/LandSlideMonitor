import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getAccessToken, getCurrentUser } from "./services/authService";
import AlertsPage from "./pages/AlertsPage";
import Sidebar from "./components/layout/Sidebar";
import DevicesPage from "./pages/DevicesPage";
import MapViewPage from "./pages/MapViewPage";
import LoginPage from "./pages/LoginPage";
import { initSignalR } from "./services/signalrInit";
import UsersPage from "./pages/UsersPage";
import DeviceDetailPage from "./pages/DeviceDetailPage";
import ThresholdsPage from "./pages/ThresholdsPage";
// Placeholder
function PlaceholderPage({ title }) {
    return (
        <main className="ml-64 p-10 bg-surface min-h-screen">
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
function MainLayout({ onLogout, user }) {
    return (
        <div className="bg-surface text-on-surface min-h-screen">
            <Sidebar onLogout={onLogout} user={user} />
            <Routes>
                <Route
                    path="/monitoring"
                    element={<PlaceholderPage title="Giám sát" />}
                />
                <Route path="/map" element={<MapViewPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/devices" element={<DevicesPage user={user} />} />
                {/* Protect the /users route */}
                <Route
                    path="/users"
                    element={
                        user?.role === "Admin" ? (
                            <UsersPage />
                        ) : (
                            <Navigate to="/monitoring" replace />
                        )
                    }
                />
                <Route
                    path="/devices/:deviceId"
                    element={<DeviceDetailPage />}
                />
                <Route path="/thresholds" element={<ThresholdsPage />} />
                <Route
                    path="*"
                    element={<Navigate to="/monitoring" replace />}
                />
            </Routes>
            // ...
        </div>
    );
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken());
    const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

    useEffect(() => {
        if (isAuthenticated) {
            initSignalR();
        }
    }, [isAuthenticated]);

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
                            onLogout={handleLogout}
                            user={currentUser}
                        />
                    }
                />
            )}
        </Routes>
    );
}
