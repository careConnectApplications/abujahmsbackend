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
exports.eyeConsultationSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.eyeConsultationSchema = new mongoose_1.Schema({
    comps: { type: String, trim: true },
    historyOfPresentingComplaint: { type: String, trim: true },
    pastMedicalHistory: { type: String, trim: true },
    opticalHistory: { type: String, trim: true },
    familySocialHx: { type: String, trim: true },
    va: { type: String, trim: true },
    IOP: { type: String, trim: true },
    Refraction: { type: String, trim: true },
    externalExamination: { type: String, trim: true },
    opthalmoscopy: { type: String, trim: true },
    slitLamp: { type: String, trim: true },
    diagnosis: { type: String, trim: true },
    treatmentPlan: { type: String, trim: true },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    nextAppointmentDate: { type: Date }
}, { timestamps: true });
const EyeConsultation = mongoose_1.default.model("EyeConsultation", exports.eyeConsultationSchema);
exports.default = EyeConsultation;
