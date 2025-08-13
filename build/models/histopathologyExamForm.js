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
const paginate_1 = require("../paginate");
const histopathologyExamFormSchema = new mongoose_1.Schema({
    histopathologyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Histopathology",
        required: [true, "Histopathology id is required"]
    },
    serviceName: { type: String, trim: true },
    testTypeId: { type: String, required: [true, "please provide a exam/test type"] },
    firstDayLMP: { type: Date, default: null },
    postMenopausal: { type: Boolean, default: null },
    oralContraceptive: { type: String, },
    IUDInPlace: { type: String },
    parity: { type: Number },
    pregnant: { type: String },
    postpartum: { type: String },
    hysterectomy: { type: String },
    LiquidPrep: { type: String },
    CytoBrush: { type: String },
    RoutinePap: { type: String },
    Previous: { type: String },
    cytologyReport: {
        adequancy: { type: String },
        hormEvaluation: { type: String },
        microbialFlora: { type: String },
        specialFeatures: { type: String },
        diagnosis: { type: String },
        hpvResults: { type: String },
        recommendation: { type: String }
    },
    pathologistReport: {
        macro: { type: String },
        micro: { type: String },
        diagnosis: { type: String },
        comment: { type: String },
        sonographicFindings: { type: String }
    }
}, { timestamps: true });
histopathologyExamFormSchema.pre(/^find/, function (next) {
    this.populate({
        path: "histopathologyId",
    });
    next();
});
histopathologyExamFormSchema.plugin(paginate_1.paginate);
const HistopathologyExamForm = mongoose_1.default.model("HistopathologyExamForm", histopathologyExamFormSchema);
exports.default = HistopathologyExamForm;
