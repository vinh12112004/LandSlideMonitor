import { startSignalR } from "./signalr";

let started = false;

export const initSignalR = async () => {
    if (started) return;
    started = true;

    try {
        await startSignalR();
        console.log("SignalR initialized globally");
    } catch (err) {
        console.error("SignalR init failed", err);
        started = false;
    }
};
