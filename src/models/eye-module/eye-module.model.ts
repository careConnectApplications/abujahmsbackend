import mongoose, { Schema } from "mongoose";
import configuration from "../../config";

const eyeModuleSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        required: [true, "Patient id is required"]
    },
    staffInfo: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    status: {
        required: true,
        type: String,
        default: configuration.status[5],
    },
    category: {
        type: String,
        enum: ["optometry", "ophthalmology"],
        required: true
    },
}, { timestamps: true });

const EyeModule = mongoose.model("EyeModule", eyeModuleSchema);
export default EyeModule;