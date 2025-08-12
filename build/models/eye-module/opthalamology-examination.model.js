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
exports.ophthalmologyExaminationSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const eyeSideSchema = {
    OD: { type: String, trim: true },
    OS: { type: String, trim: true }
};
exports.ophthalmologyExaminationSchema = new mongoose_1.Schema({
    slitLamp: {
        adnexa: eyeSideSchema,
        lids: eyeSideSchema,
        tearBreak: eyeSideSchema,
        conjunctiva: eyeSideSchema,
        cornea: eyeSideSchema,
        antChamber: eyeSideSchema,
        depth: eyeSideSchema,
        cells: eyeSideSchema,
        flare: eyeSideSchema,
        iris: eyeSideSchema,
        colour: eyeSideSchema,
        angles: eyeSideSchema,
        pupil: eyeSideSchema,
        lens: eyeSideSchema,
        clarity: eyeSideSchema,
        antCaps: eyeSideSchema,
        postCaps: eyeSideSchema,
        cortex: eyeSideSchema,
        nucleus: eyeSideSchema
    },
    ophthalmoscopy: {
        opticDisc: eyeSideSchema,
        size: eyeSideSchema,
        ratio: eyeSideSchema,
        appearance: eyeSideSchema,
        nerveFiber: eyeSideSchema,
        retina: eyeSideSchema,
        macula: eyeSideSchema,
        postRetina: eyeSideSchema,
        vessels: eyeSideSchema,
        periphery: eyeSideSchema,
        vitreous: eyeSideSchema
    },
    refraction: {
        sphere: eyeSideSchema,
        cyl: eyeSideSchema,
        axis: eyeSideSchema,
        add: eyeSideSchema,
        hPrism: eyeSideSchema,
        hBase: eyeSideSchema,
        vPrism: eyeSideSchema,
        vBase: eyeSideSchema,
        vc: eyeSideSchema,
        bcva: eyeSideSchema
    },
    phorias: {
        distAt: {
            unnamed: String,
            horizontal: { type: String, trim: true },
            vertical: { type: String, trim: true },
            base: { type: String, trim: true },
            refEye: { type: String, trim: true },
        },
        nearAt: {
            unnamed: String,
            horizontal: { type: String, trim: true },
            vertical: { type: String, trim: true },
            base: { type: String, trim: true },
            refEye: { type: String, trim: true },
        },
        method: {
            input1: { type: String, trim: true },
            input2: { type: String, trim: true },
        }
    },
    nextAppointmentDate: { type: Date, default: null }
}, { timestamps: true });
const ophthalmologyExamination = mongoose_1.default.model("OphthalmologyExamination", exports.ophthalmologyExaminationSchema);
exports.default = ophthalmologyExamination;
