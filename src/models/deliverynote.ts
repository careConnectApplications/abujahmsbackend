import { Schema, model } from "mongoose";
import configuration from "../config";
const deliverynoteSchema = new Schema({
   note: String,
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
      },
      staffname: String,
},
{ timestamps: true }
);

const deliverynote= model('Deliverynote', deliverynoteSchema);
export default deliverynote;







