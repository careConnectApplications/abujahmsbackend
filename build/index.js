"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./utils/server"));
const config_1 = __importDefault(require("./config"));
const dbconnection_1 = __importDefault(require("./utils/dbconnection"));
dotenv_1.default.config();
(0, dbconnection_1.default)();
const app = (0, server_1.default)();
const port = config_1.default.environment === "test" ? process.env.TESTPORT : process.env.PORT;
app.listen(port, () => {
    console.log(`Server is listening on Port ${port}`);
});
