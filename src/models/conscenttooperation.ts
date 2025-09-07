import { Schema, model } from "mongoose";

// Define the Clinic Schema
const conscenttooperationSchema = new Schema({
    nameofexplainer: {
        type: String,
        required: true,
    },
    filename: String,
    nameofrepresentive:
    {
        type: String,
        required: true,
    },
    addressofrepresentaive: {
        type: String,
        required: true,
    },
    fullnameofwitness: {
        type: String,
        required: true,
    },
    conscentdate: Date,
    theatreadmission: {
        type: Schema.Types.ObjectId,
        ref: "Theatreadmission",
        default: null,
    },

},
    { timestamps: true }
);

// Single field indexes
conscenttooperationSchema.index({ theatreadmission: 1 }); // For looking up consent by theatre admission
conscenttooperationSchema.index({ conscentdate: -1 }); // For sorting by consent date
conscenttooperationSchema.index({ createdAt: -1 }); // For sorting by creation date

// Compound indexes for common query patterns
conscenttooperationSchema.index({ theatreadmission: 1, conscentdate: -1 }); // For finding recent consents for a specific admission

const conscenttooperation = model('Conscenttooperation', conscenttooperationSchema);
export default conscenttooperation;
