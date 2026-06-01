import * as signalR from "@microsoft/signalr";

let connection = null;

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
        .withUrl("http://localhost:5000/sensorHub")
        .withAutomaticReconnect()
        .build();

    connection.onreconnecting(() => {
        console.log("SignalR reconnecting...");
    });

    connection.onreconnected(() => {
        console.log("SignalR reconnected");
    });

    connection.onclose(() => {
        console.log("SignalR disconnected");
    });

    await connection.start();

    console.log("SignalR connected");

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

    connection.off(eventName);
    connection.on(eventName, callback);
};

export const offSignalR = (eventName, callback) => {
    if (!connection) return;

    connection.off(eventName, callback);
};
