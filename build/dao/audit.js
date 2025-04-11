"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createaudit = createaudit;
exports.readallaudit = readallaudit;
const audit_1 = __importDefault(require("../models/audit"));
function createaudit(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //create audit
            return yield audit_1.default.create(input);
        }
        catch (e) {
            throw new Error(e.message);
        }
    });
}
function readallaudit(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const auditdetails = yield audit_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totalauditdetails = yield audit_1.default.find(query).countDocuments();
            return { auditdetails, totalauditdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(err.message);
        }
    });
}
;
