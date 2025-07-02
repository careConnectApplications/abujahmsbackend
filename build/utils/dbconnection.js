"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
function dbconnect() {
    const database = config_1.default.environment === "test" ? process.env.LOCALDATABASE : process.env.DOCKERDATABASE;
    // const database =  'mongodb://mongo_db:27017/ims';
    mongoose_1.default.set('strictQuery', true);
    return mongoose_1.default.connect(database, {
        useNewUrlParser: true,
        // useUnifiedTopology: true,
        directConnection: true,
        family: 4,
    }).then(() => console.log('MongoDb Connected')).catch((e) => console.log(e));
}
exports.default = dbconnect;
