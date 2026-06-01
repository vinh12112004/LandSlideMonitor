import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function LoginPage({ onLoginSuccess }) {
    const [identity, setIdentity] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(identity, password);
            console.log("Đăng nhập thành công");
            onLoginSuccess();
            navigate("/devices");
        } catch (err) {
            console.error("Đăng nhập thất bại", err);
            setError(
                "Thông tin không hợp lệ. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col sentient-gradient">
            <div className="fixed bottom-0 left-0 w-full h-full z-0 opacity-30 pointer-events-none">
                <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBppTjXcpk_A1m88vnw4xoHlhMTSRzdGDPKer8pbWNppKYy5melHDKNC9W_lebXvIHAXwR_a7BE3xkDdZq8V8YDlAIxgcaaEx-ZMB7cHPjw2t56jxL7FQMsgale3Z5FTKdVnILTXi5oUMUJUKYgT7aMEcLQ4tBoiNXfX4thCQwVZnsxp1fBykE1ABj004t6W05ADuPEN6FXMiR3w-XTlY9zN0PRHcFyJ_youYnyMW08hnqKjYvVyIcEglWVZmP4tDoWOQcpBD2dZ5-D"
                    alt="topography"
                />
            </div>

            <main className="flex-grow flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 sm:p-10 ambient-shadow relative z-10">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="mb-4 text-primary">
                            <span
                                className="material-symbols-outlined text-5xl"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                landscape
                            </span>
                        </div>
                        <h1 className="font-headline font-extrabold text-2xl text-on-surface tracking-tighter mb-2">
                            Hệ thống giám sát sạt lở
                        </h1>
                    </div>

                    {error && (
                        <div className="mb-6 bg-error-container/20 border border-error/10 rounded-lg p-3 flex items-center gap-3">
                            <span className="material-symbols-outlined text-error text-lg">
                                error
                            </span>
                            <p className="text-on-error-container text-xs font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label
                                className="block text-xs font-semibold text-on-surface-variant ml-1 font-label"
                                htmlFor="identity"
                            >
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">
                                    person
                                </span>
                                <input
                                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-highest/50 border-none rounded-xl focus:ring-2 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all text-sm outline-none placeholder:text-outline/60"
                                    id="identity"
                                    placeholder="Nhập tên đăng nhập của bạn"
                                    type="text"
                                    value={identity}
                                    onChange={(e) =>
                                        setIdentity(e.target.value)
                                    }
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-end px-1">
                                <label
                                    className="block text-xs font-semibold text-on-surface-variant font-label"
                                    htmlFor="password"
                                >
                                    Mật khẩu
                                </label>
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">
                                    lock
                                </span>
                                <input
                                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-highest/50 border-none rounded-xl focus:ring-2 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all text-sm outline-none placeholder:text-outline/60"
                                    id="password"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-1">
                            <div className="relative flex items-center">
                                <input
                                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface-container-highest/50 cursor-pointer"
                                    id="remember"
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) =>
                                        setRemember(e.target.checked)
                                    }
                                />
                            </div>
                            <label
                                className="text-sm text-on-surface-variant cursor-pointer select-none"
                                htmlFor="remember"
                            >
                                Ghi nhớ thiết bị này
                            </label>
                        </div>

                        <button
                            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl font-semibold shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 text-on-primary"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            fill="currentColor"
                                        ></path>
                                    </svg>
                                    <span>Đang đăng nhập...</span>
                                </>
                            ) : (
                                <span>Đăng nhập</span>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
