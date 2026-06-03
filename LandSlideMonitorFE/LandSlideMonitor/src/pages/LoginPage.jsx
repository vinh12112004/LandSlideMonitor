import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { login } from "../services/authService";

export default function LoginPage({ onLoginSuccess }) {
    const [identity, setIdentity] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(identity, password);
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
        <div className="relative min-h-screen overflow-hidden bg-surface text-on-surface">
            <div className="absolute inset-0 opacity-25">
                <img
                    className="h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBppTjXcpk_A1m88vnw4xoHlhMTSRzdGDPKer8pbWNppKYy5melHDKNC9W_lebXvIHAXwR_a7BE3xkDdZq8V8YDlAIxgcaaEx-ZMB7cHPjw2t56jxL7FQMsgale3Z5FTKdVnILTXi5oUMUJUKYgT7aMEcLQ4tBoiNXfX4thCQwVZnsxp1fBykE1ABj004t6W05ADuPEN6FXMiR3w-XTlY9zN0PRHcFyJ_youYnyMW08hnqKjYvVyIcEglWVZmP4tDoWOQcpBD2dZ5-D"
                    alt=""
                    aria-hidden="true"
                />
            </div>
            <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
                <section className="w-full max-w-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest/95 p-8 shadow-2xl backdrop-blur sm:p-10">
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary-container/25 text-primary">
                            <span
                                className="material-symbols-outlined text-4xl"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                                aria-hidden="true"
                            >
                                landscape
                            </span>
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">
                            Hệ thống giám sát sạt lở
                        </h1>
                        <p className="mt-2 text-sm text-on-surface-variant">
                            Đăng nhập để quản lý thiết bị, cảnh báo và cấu hình
                            ngưỡng.
                        </p>
                    </div>

                    {error && (
                        <div
                            className="mb-5 flex items-start gap-3 rounded-lg border border-error/20 bg-error-container/25 p-3 text-sm text-on-error-container"
                            role="alert"
                        >
                            <span
                                className="material-symbols-outlined text-error"
                                aria-hidden="true"
                            >
                                error
                            </span>
                            <p>{error}</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <Input
                            label="Tên đăng nhập"
                            id="identity"
                            icon="person"
                            placeholder="Nhập tên đăng nhập của bạn"
                            type="text"
                            value={identity}
                            onChange={(event) => setIdentity(event.target.value)}
                            autoComplete="username"
                            required
                        />
                        <Input
                            label="Mật khẩu"
                            id="password"
                            icon="lock"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            required
                        />

                        <label
                            className="flex cursor-pointer items-center gap-3 text-sm text-on-surface-variant"
                            htmlFor="remember"
                        >
                            <input
                                className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/25"
                                id="remember"
                                type="checkbox"
                                checked={remember}
                                onChange={(event) =>
                                    setRemember(event.target.checked)
                                }
                            />
                            Ghi nhớ thiết bị này
                        </label>

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full"
                            size="lg"
                        >
                            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                    </form>
                </section>
            </main>
        </div>
    );
}
