import mongoose, { Schema } from "mongoose";
import configuration from "../../config";
import { optometryLensPrescriptionSchema } from "./optometrylens-prescription.model";
import { preliminaryTestSchema } from "./preliminary-test.model";
import { ophthalmologyExaminationSchema } from "./opthalamology-examination.model";
import { ophthalmologyOperationalTestSchema } from "./opthalmology-operational-test.model";
import { IEyeModel, IEyeModuleDoc } from "../../interface/eye-module.interface";
import { paginate } from "../../paginate";

const eyeModuleSchema = new Schema<IEyeModuleDoc, IEyeModel>({
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
    appointment: {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
        default: null,
    },
    appointmentid:
    {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    updatedBy: {
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

eyeModuleSchema.pre<IEyeModuleDoc>(/^find/, function (next) {
    this.populate({
        path: "patient createdBy appointment",
    });
    next();
});

eyeModuleSchema.plugin(paginate as any);

const EyeModule = mongoose.model<IEyeModuleDoc, IEyeModel>("EyeModule", eyeModuleSchema);
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