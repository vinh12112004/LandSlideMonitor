import * as signalR from "@microsoft/signalr";

let connection = null;

export const startSignalR = async () => {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5000/sensorHub")
        .withAutomaticReconnect()
        .build();

    await connection.start();
    console.log("SignalR connected");

    return connection;
};

export const getConnection = () => connection;
