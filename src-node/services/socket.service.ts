import * as http from "http";
import * as SocketIO from "socket.io";
import * as core from "express-serve-static-core";
import Logger from "./logger.service";
import {UiSocketTopic} from "../../src/_common/socket.config";


const logger = new Logger("SocketService");
const port = 4001;
let io: SocketIO.Server;
const uiIoClients: SocketIO.Socket[] = [];


function init(app: core.Express) {
    if (io) return;

    const server = http.createServer(app);
    io = SocketIO(server);

    io.on(UiSocketTopic.connection, socket => {

        socket.on(UiSocketTopic.iAmUi, () => {
            logger.debug(UiSocketTopic.iAmUi, + uiIoClients.length);
            uiIoClients.push(socket);
        });

        socket.on(UiSocketTopic.disconnect, () => {
            for (const [i, clientSocket] of uiIoClients.entries()) {
                if (clientSocket.id === socket.id) {
                    uiIoClients.splice(i, 1);
                    logger.debug(`UI Client disconnected, ${uiIoClients.length} left`);
                    return;
                }
            }
        });

        socket.on(UiSocketTopic.checkTimeReq, () => {
            socket.emit(UiSocketTopic.checkTimeRes, Date.now());
        })
    });

    server.listen(port, () => logger.info(`Socket.IO listening on port ${port}`));
}

export default class SocketService {
    static init(app: core.Express) { init(app) }
}
