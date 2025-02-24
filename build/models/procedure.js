"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
const procedureSchema = new mongoose_1.Schema({
    clinic: String,
    procedureid: {
        type: String,
        required: true
    },
    procedureoutcome: String,
    indicationdiagnosisprocedure: String,
    procedure: String,
    appointmentdate: String,
    cptcodes: [],
    dxcodes: [],
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    procedureresult: [],
    raiseby: {
        type: String,
    },
    processby: {
        type: String
    },
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Payment",
        default: true,
    },
    status: {
        required: true,
        type: String,
        default: config_1.default.status[9],
    }
}, { timestamps: true });
const procedure = (0, mongoose_1.model)('Procedure', procedureSchema);
exports.default = procedure;
/*

clinic
indicationdiagnosisprocedure
procedure:[]
appointmentdate
cptcodes:[]
dxcodes:[]

*/ 
