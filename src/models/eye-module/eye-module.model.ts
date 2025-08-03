import mongoose, { Schema } from "mongoose";
import configuration from "../../config";
import { optometryLensPrescriptionSchema } from "./optometrylens-prescription.model";
import { preliminaryTestSchema } from "./preliminary-test.model";
import { ophthalmologyExaminationSchema } from "./opthalamology-examination.model";
import { ophthalmologyOperationalTestSchema } from "./opthalmology-operational-test.model";

const eyeModuleSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        required: [true, "Patient id is required"]
    },
    ref: {
        type: String,
        unique: true,
        trim: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    status: {
        required: true,
        type: String,
        default: configuration.status[5],
    },
    // category: {
    //     type: String,
    //     enum: ["optometry", "ophthalmology"],
    //     required: true
    // },
    optometryLensPrescription: {
        type: optometryLensPrescriptionSchema,
        default: null
    },
    preliminaryTest: {
        type: preliminaryTestSchema,
        default: null
    },
    examination: {
        type: ophthalmologyExaminationSchema,
        default: null
    },
    operationalTest: {
        type: [ophthalmologyOperationalTestSchema],
        default: []
    }
}, { timestamps: true });

const EyeModule = mongoose.model("EyeModule", eyeModuleSchema);
export default EyeModule;

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