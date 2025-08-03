import mongoose, { Schema } from "mongoose";

export const ophthalmologyOperationalTestSchema = new Schema({
    resultType: {
        type: String,
        enum: ['CVF,', 'OCT', 'FundusPhotograph', 'FFA'],
        required: true
    },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: String, required: true }
}, { timestamps: true });

const ophthalmologyOperationalTest = mongoose.model("OphthalmologyOperationalTest", ophthalmologyOperationalTestSchema);
export default ophthalmologyOperationalTest;