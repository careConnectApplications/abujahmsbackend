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
exports.readpaymentaggregate = readpaymentaggregate;
exports.readappointmentaggregate = readappointmentaggregate;
exports.readadmissionaggregate = readadmissionaggregate;
exports.readclinicaggregate = readclinicaggregate;
exports.readwardaggregate = readwardaggregate;
exports.readprocedureaggregate = readprocedureaggregate;
const payment_1 = __importDefault(require("../models/payment"));
const admission_1 = __importDefault(require("../models/admission"));
const appointment_1 = __importDefault(require("../models/appointment"));
const clinics_1 = __importDefault(require("../models/clinics"));
const wardmanagement_1 = __importDefault(require("../models/wardmanagement"));
const procedure_1 = __importDefault(require("../models/procedure"));
const config_1 = __importDefault(require("../config"));
function readpaymentaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield payment_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
function readappointmentaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield appointment_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
function readadmissionaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield admission_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
function readclinicaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield clinics_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e.message);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
function readwardaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield wardmanagement_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
function readprocedureaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield procedure_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
