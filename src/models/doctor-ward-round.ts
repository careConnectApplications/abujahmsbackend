import { Schema, model } from "mongoose";

const doctorWardRoundSchema = new Schema({
    admissionId: {
        type: String,
        required: [true, 'Admission ID is required'],
        trim: true,
        index: true
    },
    admissionNote: {
        type: String,
        required: [true, 'Admission note is required'],
        trim: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Creator ID is required']
    }
}, { timestamps: true });

doctorWardRoundSchema.pre<any>(/^find/, function (next) {
    this.populate({
        path: "admissionId createdBy",
    });
    next();
});


const DoctorWardRound = model("DoctorWardRound", doctorWardRoundSchema);
export default DoctorWardRound;