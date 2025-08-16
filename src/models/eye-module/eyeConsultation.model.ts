import mongoose, { Schema } from "mongoose";

export const eyeConsultationSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    nextAppointmentDate: { type: Date }
}, { timestamps: true });

const EyeConsultation = mongoose.model("EyeConsultation", eyeConsultationSchema);
export default EyeConsultation;