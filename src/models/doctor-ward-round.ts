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

// Additional indexes for performance
doctorWardRoundSchema.index({ createdBy: 1 }); // For staff-based queries
doctorWardRoundSchema.index({ createdAt: -1 }); // For sorting by date

// Compound indexes for common query patterns
doctorWardRoundSchema.index({ admissionId: 1, createdAt: -1 }); // For finding recent rounds for an admission
doctorWardRoundSchema.index({ createdBy: 1, createdAt: -1 }); // For finding recent rounds by a specific doctor

doctorWardRoundSchema.pre<any>(/^find/, function (next) {
    this.populate({
        path: "admissionId createdBy",
    });
    next();
});


const DoctorWardRound = model("DoctorWardRound", doctorWardRoundSchema);
export default DoctorWardRound;
