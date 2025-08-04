import {Schema, model} from "mongoose";
// bed.model.ts
const bedSchema = new Schema({
  bednumber: { type: String, required: true },
  ward: { type: Schema.Types.ObjectId, ref: 'Wardmanagement', required: true },
  status: { type: String, enum: ['vacant', 'occupied'], default: 'vacant' },
  isDeleted: { type: Boolean, default: false },
  assignedPatient: { type: Schema.Types.ObjectId, ref: 'Patient', default: null },
  assignedDate: { type: Date }
}, { timestamps: true });

const bed = model('Bed', bedSchema);
export default bed;
