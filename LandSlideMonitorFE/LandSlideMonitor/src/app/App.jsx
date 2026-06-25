import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import LoadingState from "../components/ui/LoadingState";
import { getAccessToken, getCurrentUser, logout } from "../services/authService";
import { initSignalR } from "../services/signalrInit";
import { stopSignalR } from "../services/signalr";

const AlertsPage = lazy(() => import("../pages/AlertsPage"));
const AuditLogsPage = lazy(() => import("../pages/AuditLogsPage"));
const DevicesPage = lazy(() => import("../pages/DevicesPage"));
const DeviceDetailPage = lazy(() => import("../pages/DeviceDetailPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const MapViewPage = lazy(() => import("../pages/MapViewPage"));
const MonitoringPage = lazy(() => import("../pages/MonitoringPage"));
const ThresholdsPage = lazy(() => import("../pages/ThresholdsPage"));
const UsersPage = lazy(() => import("../pages/UsersPage"));

function withPageSuspense(element) {
    return (
        <Suspense
            fallback={
                <div className="min-h-[calc(100vh-4rem)] bg-surface px-4 py-10 lg:px-8">
                    <LoadingState message="Đang tải trang..." />
                </div>
            }
        >
            {element}
        </Suspense>
    );
}

function RequireAdmin({ user, children }) {
    if (user?.role !== "Admin") {
        return <Navigate to="/devices" replace />;
    }

    return children;
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

    const handleLogout = async () => {
        await logout();
        await stopSignalR();
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    return (
        <Routes>
            {!isAuthenticated ? (
                <>
                    <Route
                        path="/login"
                        element={withPageSuspense(
                            <LoginPage onLoginSuccess={handleLoginSuccess} />,
                        )}
                    />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </>
            ) : (
                <Route
                    element={
                        <AppLayout
                            onLogout={handleLogout}
                            user={currentUser}
                        />
                    }
                >
                    <Route
                        path="/monitoring"
                        element={withPageSuspense(<MonitoringPage />)}
                    />
                    <Route
                        path="/map"
                        element={withPageSuspense(<MapViewPage />)}
                    />
                    <Route
                        path="/alerts"
                        element={withPageSuspense(<AlertsPage />)}
                    />
                    <Route
                        path="/devices"
                        element={withPageSuspense(
                            <DevicesPage user={currentUser} />,
                        )}
                    />
                    <Route
                        path="/users"
                        element={withPageSuspense(
                            <RequireAdmin user={currentUser}>
                                <UsersPage />
                            </RequireAdmin>,
                        )}
                    />
                    <Route
                        path="/audit-logs"
                        element={withPageSuspense(
                            <RequireAdmin user={currentUser}>
                                <AuditLogsPage />
                            </RequireAdmin>,
                        )}
                    />
                    <Route
                        path="/devices/:deviceId"
                        element={withPageSuspense(<DeviceDetailPage />)}
                    />
                    <Route
                        path="/thresholds"
                        element={withPageSuspense(<ThresholdsPage />)}
                    />
                    <Route path="*" element={<Navigate to="/devices" replace />} />
                </Route>
            )}
        </Routes>
    );
}
