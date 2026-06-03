import * as signalR from "@microsoft/signalr";
import { SIGNALR_URL } from "../config/env";

let connection = null;
const logSignalR = (...args) => {
    if (import.meta.env.DEV) {
        console.info(...args);
    }
};

export const startSignalR = async () => {
    // đã tạo rồi thì dùng lại
    if (connection) {
        if (connection.state === "Connected") {
            return connection;
        }

        if (connection.state === "Disconnected") {
            await connection.start();
        }

        return connection;
    }

    connection = new signalR.HubConnectionBuilder()
        .withUrl(SIGNALR_URL)
        .withAutomaticReconnect()
        .build();

    connection.onreconnecting(() => {
        logSignalR("SignalR reconnecting...");
    });

    connection.onreconnected(() => {
        logSignalR("SignalR reconnected");
    });

    connection.onclose(() => {
        logSignalR("SignalR disconnected");
    });

    await connection.start();

    logSignalR("SignalR connected");

    return connection;
};

export const stopSignalR = async () => {
    if (!connection) return;

    await connection.stop();
    connection = null;
};

export const getConnection = () => connection;

// helper
export const onSignalR = (eventName, callback) => {
    if (!connection) return;

    connection.on(eventName, callback);
};

export const offSignalR = (eventName, callback) => {
    if (!connection) return;

    connection.off(eventName, callback);
};
