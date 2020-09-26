import "./env-config";
import {DEFAULT_CONSTANT} from "../src/_common/config";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { router as apiRoutes } from "./routes";
import * as path from "path";
import SocketService from "./services/socket.service";

console.log("This demonstrates usage of common classes and interfaces between " + DEFAULT_CONSTANT);


const PORT = 4000;
const app = express();
SocketService.init(app);


app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + "/../../build")));
app.use("/api", apiRoutes);

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/../../build/index.html"));
});



app.listen(PORT, () => console.log(`App is running on port ${PORT}`));


