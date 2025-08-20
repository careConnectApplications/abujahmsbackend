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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const InsuranceClaimSchema = new mongoose_1.Schema({
    patient: { type: mongoose_1.Schema.Types.ObjectId, ref: "Patientsmanagement", required: true },
    serviceCategory: { type: String, required: true },
    lab: { type: mongoose_1.Schema.Types.ObjectId, ref: "Lab" },
    radiology: { type: mongoose_1.Schema.Types.ObjectId, ref: "Radiology" },
    procedure: { type: mongoose_1.Schema.Types.ObjectId, ref: "Procedure" },
    pharmacy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Prescription" },
    histopathology: { type: mongoose_1.Schema.Types.ObjectId, ref: "Histopathology" },
    authorizationCode: { type: String },
    approvalCode: { type: String },
    status: {
        type: String,
        enum: ["Submitted", "Re-submitted", "Cancelled", "Rejected", "Paid"],
        default: "Submitted",
    },
    amountClaimed: { type: Number, required: true },
    amountApproved: { type: Number },
    insurer: { type: String },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Users" },
}, { timestamps: true });
exports.default = mongoose_1.default.model("InsuranceClaim", InsuranceClaimSchema);
