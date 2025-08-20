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
const config_1 = __importDefault(require("../../config"));
const optometrylens_prescription_model_1 = require("./optometrylens-prescription.model");
const preliminary_test_model_1 = require("./preliminary-test.model");
const opthalamology_examination_model_1 = require("./opthalamology-examination.model");
const opthalmology_operational_test_model_1 = require("./opthalmology-operational-test.model");
const paginate_1 = require("../../paginate");
const eyeConsultation_model_1 = require("./eyeConsultation.model");
const eyeModuleSchema = new mongoose_1.Schema({
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        required: [true, "Patient id is required"]
    },
    ref: {
        type: String,
        unique: true,
        trim: true,
    },
    appointment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Appointment",
        default: null,
    },
    appointmentid: {
        type: String,
        required: true
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
    status: {
        required: true,
        type: String,
        default: config_1.default.status[5],
    },
    // category: {
    //     type: String,
    //     enum: ["optometry", "ophthalmology"],
    //     required: true
    // },
    optometryLensPrescription: {
        type: optometrylens_prescription_model_1.optometryLensPrescriptionSchema,
        default: null
    },
    preliminaryTest: {
        type: preliminary_test_model_1.preliminaryTestSchema,
        default: null
    },
    examination: {
        type: opthalamology_examination_model_1.ophthalmologyExaminationSchema,
        default: null
    },
    eyeConsultation: {
        type: eyeConsultation_model_1.eyeConsultationSchema,
        default: null
    },
    operationalTest: {
        type: [opthalmology_operational_test_model_1.ophthalmologyOperationalTestSchema],
        default: []
    },
    observationalNotes: { type: String }
}, { timestamps: true });
eyeModuleSchema.pre(/^find/, function (next) {
    this.populate({
        path: "patient createdBy appointment",
    });
    next();
});
eyeModuleSchema.plugin(paginate_1.paginate);
const EyeModule = mongoose_1.default.model("EyeModule", eyeModuleSchema);
exports.default = EyeModule;
//   optometryLensPrescriptionId: {
//         type: Schema.Types.ObjectId,
//         ref: "OptometryLensPrescription",
//         default: null
//     },
//     preliminaryTestId: {
//         type: Schema.Types.ObjectId,
//         ref: "PreliminaryTest",
//         default: null
//     },
//     examinationId: {
//         type: Schema.Types.ObjectId,
//         ref: "OphthalmologyExamination",
//         default: null
//     },
//     operationalTestId: {
//         type: Schema.Types.ObjectId,
//         ref: "OphthalmologyOperationalTest",
//         default: null
//     }
