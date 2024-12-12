"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
function createServer() {
    const app = (0, express_1.default)();
    //cross origin sharing
    app.use((0, cors_1.default)());
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
    // Swagger definition for the API
    // Swagger setup
    const swaggerOptions = {
        swaggerDefinition: {
            info: {
                title: 'My API',
                version: '1.0.0',
                description: 'A simple Express API',
            },
            basePath: '/',
        },
        apis: ['./src/routes/*.ts'], // Path to your API docs
    };
    // Initialize swagger-jsdoc
    const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
    // Serve Swagger UI at the /api-docs path
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.use('/api/v1/downloads', express_1.default.static('uploads'));
    return app;
}
exports.default = createServer;
