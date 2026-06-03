import { getConnection, startSignalR } from "./signalr";

let started = false;
const logSignalR = (...args) => {
    if (import.meta.env.DEV) {
        console.info(...args);
    }
};

export const initSignalR = async () => {
    if (started && getConnection()) return;

    try {
        await startSignalR();

        started = true;

        logSignalR("SignalR initialized globally");
    } catch (err) {
        console.error("SignalR init failed", err);

        started = false;
    }
};
