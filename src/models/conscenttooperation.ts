import { Schema, model } from "mongoose";

// Define the Clinic Schema
const conscenttooperationSchema = new Schema({
    nameofexplainer: {
        type: String,
        required: true,
    },
<<<<<<< HEAD
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

=======
    addressofrepresentaive:{
        type: String,
        required: true,
    },
    fullnameofwitness:{
        type: String,
        required: true,
    },
   conscentdate: Date,
   theatreadmission: {
       type: Schema.Types.ObjectId,
       ref: "Theatreadmission",
       default: null,
     },
 
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
