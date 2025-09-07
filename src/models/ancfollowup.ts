import { Schema, model } from "mongoose";
import configuration from "../config";
const ancfollowupSchema = new Schema({
   
anc: {
type: Schema.Types.ObjectId,
ref: "Anc",
default: null,
},
ga:String,
sfh:String,
wt:String,
lie:String,
presentation:String,
position:String,
fhr:String,
urine:String,
bp:String,
remark:String,
followup:String,
riskidentified:String,
currentmedication:String,
staffname:String
},
{ timestamps: true }
);

// Single field indexes
ancfollowupSchema.index({ anc: 1 }); // For looking up follow-ups for a specific ANC record
ancfollowupSchema.index({ createdAt: -1 }); // For sorting by date
ancfollowupSchema.index({ staffname: 1 }); // For staff-based queries

// Compound indexes for common query patterns
ancfollowupSchema.index({ anc: 1, createdAt: -1 }); // For finding recent follow-ups for a specific ANC

const ancfollowup= model('Ancfollowup', ancfollowupSchema);
export default ancfollowup;
