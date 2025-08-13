"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.globalErrorHandler = exports.protect = exports.checkSubscription = void 0;
const config_1 = __importDefault(require("../config"));
const patientmanagement_1 = require("../dao/patientmanagement");
const jwt = __importStar(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
// Middleware to block unpaid patients
exports.checkSubscription = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var { patient, id } = req.body;
    const _id = patient || id;
    if (!_id) {
        throw new Error("Unauthorized");
    }
    const patientinfo = yield (0, patientmanagement_1.readonepatient)({ _id }, {}, '', '');
    if (!patientinfo) {
        throw new Error("Patient not found");
    }
    const now = new Date();
    if (!patientinfo.subscriptionPaidUntil || patientinfo.subscriptionPaidUntil < now) {
        throw new Error("Subscription expired. Please renew to continue.");
    }
    next();
}));
//Protect routes
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        //check if token is contain in the header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        //check the presence of token
        if (!token) {
            throw new Error(config_1.default.error.protectroutes);
        }
        const decoded = jwt.verify(token, process.env.KEYGEN);
        req.user = decoded;
        next();
    }
    catch (e) {
        //console.error(e.message);
        res.status(500).json({ msg: e.message, status: false });
    }
});
exports.protect = protect;
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = false;
    res.status(statusCode).json(Object.assign({ status, msg: err.message || "Internal Server Error" }, (process.env.NODE_ENV === "development" && { stack: err.stack })));
};
exports.globalErrorHandler = globalErrorHandler;
exports.default = exports.globalErrorHandler;
