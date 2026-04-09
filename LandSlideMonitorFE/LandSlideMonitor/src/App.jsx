import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DevicesPage from "./pages/DevicesPage";

// Placeholder cho các trang chưa xây dựng
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

// App — root component
export default function App() {
    const [activePath, setActivePath] = useState("/devices");
    const [searchQuery, setSearchQuery] = useState("");

    const renderPage = () => {
        switch (activePath) {
            case "/devices":
                return <DevicesPage searchQuery={searchQuery} />;
            case "/monitoring":
                return <PlaceholderPage title="Monitoring" />;
            case "/map":
                return <PlaceholderPage title="Map View" />;
            case "/alerts":
                return <PlaceholderPage title="Alerts" />;
            case "/history":
                return <PlaceholderPage title="History" />;
            default:
                return <DevicesPage searchQuery={searchQuery} />;
        }
    };

    return (
        <div className="bg-surface text-on-surface min-h-screen">
            <Sidebar activePath={activePath} onNavigate={setActivePath} />
            <Header searchQuery={searchQuery} onSearch={setSearchQuery} />
            {renderPage()}
        </div>
    );
}
