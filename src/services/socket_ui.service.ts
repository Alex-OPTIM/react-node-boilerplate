import socketIOClient from "socket.io-client";
import {IO_ENDPOINT} from "../_common/config";
import {UiSocketTopic} from "../_common/socket.config";

const socketIo = socketIOClient(IO_ENDPOINT, {
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionAttempts: 30
});

let isConnected = false;

setNecessaryListeners();
socketIo.connect();

export default class SocketUiService {

    static socketIo = socketIo;
    static isConnected() { return isConnected};

    static removeAllListeners() {
        socketIo.removeAllListeners();
        setNecessaryListeners();
    }
}

function setNecessaryListeners() {
    socketIo.on(UiSocketTopic.connect, () => {
        isConnected = true;
        socketIo.emit(UiSocketTopic.iAmUi);
    });
    socketIo.on(UiSocketTopic.disconnect, () => {
        isConnected = false;
    });
}
