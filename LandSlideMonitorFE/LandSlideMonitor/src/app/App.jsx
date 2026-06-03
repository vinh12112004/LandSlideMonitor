import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import LoadingState from "../components/ui/LoadingState";
import { getAccessToken, getCurrentUser, logout } from "../services/authService";
import { initSignalR } from "../services/signalrInit";
import { stopSignalR } from "../services/signalr";

const AlertsPage = lazy(() => import("../pages/AlertsPage"));
const DevicesPage = lazy(() => import("../pages/DevicesPage"));
const DeviceDetailPage = lazy(() => import("../pages/DeviceDetailPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const MapViewPage = lazy(() => import("../pages/MapViewPage"));
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

function PlaceholderPage({ title }) {
    return (
        <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
            <div className="text-center">
                <span
                    className="material-symbols-outlined mb-4 block text-6xl text-outline"
                    aria-hidden="true"
                >
                    construction
                </span>
                <h1 className="text-2xl font-extrabold text-on-surface">
                    {title}
                </h1>
                <p className="mt-2 text-sm text-on-surface-variant">
                    Trang này đang được phát triển.
                </p>
            </div>
        </section>
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
                        element={<PlaceholderPage title="Giám sát" />}
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
