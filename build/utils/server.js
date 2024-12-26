"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const auth_1 = __importDefault(require("../routes/auth"));
function createServer() {
    const app = (0, express_1.default)();
    //cross origin sharing
    app.use((0, cors_1.default)({
        origin: "*",
    }));
    app.use(express_1.default.static(__dirname + '/public'));
    //middleware to process json
    app.use(express_1.default.json({ limit: '50mb' }));
    /*
    app.use(fileUpload({
        useTempFiles: true,
        tempFileDir:path.join(__dirname, 'tmp'),
        createParentPath: true,
    }));
    */
    app.use((0, express_fileupload_1.default)());
    app.use('/api/v1/downloads', express_1.default.static('uploads'));
    app.use('/api/v1/auth', auth_1.default);
    return app;
}
exports.default = createServer;
