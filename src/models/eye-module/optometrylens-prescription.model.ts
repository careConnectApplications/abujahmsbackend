import mongoose, { Schema } from "mongoose";

const eyeMeasurementSchema = {
    sphere: { type: String, trim: true },
    cyl: { type: String, trim: true },
    axis: { type: String, trim: true },
    prism: { type: String, trim: true },
    va: { type: String, trim: true }
};

export const optometryLensPrescriptionSchema = new Schema({
    distance: {
        right: eyeMeasurementSchema,
        left: eyeMeasurementSchema,
    },
    add: {
        right: { type: String, trim: true },
        left: { type: String, trim: true }
    },
    ipd: {
        near: { type: String, trim: true },
        dist: { type: String, trim: true }
    },
    lensTint: { type: String, trim: true },
    lensSize: { type: String, trim: true },
    segHt: { type: String, trim: true },
    temple: { type: String, trim: true },
    lensType: { type: String, trim: true },
    frame: { type: String, trim: true },
    colour: { type: String, trim: true },
    remarks: { type: String, trim: true },

    nextExamDate: { type: Date, default: null },
    nextAppointmentDate: { type: Date, default: null }
}, { timestamps: true });

const optometryLensPrescription = mongoose.model("OptometryLensPrescription", optometryLensPrescriptionSchema);
export default optometryLensPrescription;