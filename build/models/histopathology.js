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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const paginate_1 = require("../paginate");
const consentFormSchema = new mongoose_1.Schema({
    nameofexplainer: {
        type: String,
        // required: true,
    },
    filename: String,
    nameofrepresentive: {
        type: String,
        // required: true,
    },
    addressofrepresentaive: {
        type: String,
        //required: true,
    },
    fullnameofwitness: {
        type: String,
        //required: true,
    },
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
}, { timestamps: true });
const histopathologySchema = new mongoose_1.Schema({
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        required: [true, "Patient id is required"]
    },
    // appointment: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Appointment",
    //     default: null,
    // },
    // appointmentid:
    // {
    //     type: String,
    //     required: true
    // },
    staffInfo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Payment",
        default: null,
    },
    amount: {
        type: Number,
        min: [0, "Amount cannot be negative"],
    },
    hmopercentagecover: Number,
    actualcost: Number,
    paymentStatus: {
        type: String,
        default: config_1.default.status[2],
    },
    status: {
        required: true,
        type: String,
        default: config_1.default.status[5],
    },
    refNumber: String,
    testRequired: [{
            name: { type: String, required: true, trim: true },
            PaymentRef: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Payment",
                default: null
            },
            amount: { type: Number, min: [0, "Amount cannot be negative"] },
            paymentStatus: { type: String, default: config_1.default.status[5] }
        }],
    diagnosisForm: {
        //provisionalDiagnosis: { type: String, required: true },
        //clinicalDetails: { type: String },
        lmp: { type: String },
        // parity: { type: String },
        biopsyType: { type: String, enum: ["Excision", "Incision", "Endoscopy", "Trucut"], default: null },
        others: { type: String, trim: true },
        wholeOrgan: { type: String, trim: true },
        operationalOrEndoscopyFinding: { type: String, trim: true },
        radiologicalResults: { type: String, trim: true },
        otherLabResults: { type: String, trim: true },
        previousBiopsy: { type: Boolean, required: [true, "Previous Biopsy is required"] },
        diagnosis: { type: String, trim: true },
        labNo: { type: String, trim: true },
        requestingDoctor: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Users",
            default: null,
        },
        phoneNumber: {
            type: String,
            trim: true,
            default: null
        }
    },
    consentForm: {
        type: consentFormSchema,
        default: true,
    },
}, {
    timestamps: true,
});
histopathologySchema.virtual('examForms', {
    ref: 'HistopathologyExamForm',
    localField: '_id',
    foreignField: 'histopathologyId',
    justOne: false
});
histopathologySchema.pre(/^find/, function (next) {
    this.populate({
        path: "patient staffInfo diagnosisForm.requestingDoctor",
    });
    next();
});
histopathologySchema.plugin(paginate_1.paginate);
const Histopathology = mongoose_1.default.model("Histopathology", histopathologySchema);
exports.default = Histopathology;
