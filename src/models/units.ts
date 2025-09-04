import { Schema, model } from "mongoose";

// Define the Unit Schema
const unitSchema = new Schema({
    unit: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    clinicId: {
        type: Schema.Types.ObjectId,
        ref: "Clinic",
        default: null,
    },
   
    
},
{ timestamps: true }
);

const unit = model('Unit', unitSchema);
export default unit;
