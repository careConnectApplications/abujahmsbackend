import { Schema, model } from "mongoose";
import configuration from "../config";
const ancfollowup3Schema = new Schema({
   
anc: {
type: Schema.Types.ObjectId,
ref: "Anc3",
default: null,
},
heightoffundus:String,
presentationandposition:String,
presentingpart:String,
foetalheight:String,
bp:String,
hb:String,
protein:String,
glucose:String,
weight:String,
oedema:String,
tetanustoxoid:String,
sulfadoxinepyrimethamine:String,
albendazole:String,
remark:String,
staffname:String
},
{ timestamps: true }
);

// Single field indexes
ancfollowup3Schema.index({ anc: 1 }); // For looking up follow-ups for a specific ANC3 record
ancfollowup3Schema.index({ createdAt: -1 }); // For sorting by date
ancfollowup3Schema.index({ staffname: 1 }); // For staff-based queries

// Compound indexes for common query patterns
ancfollowup3Schema.index({ anc: 1, createdAt: -1 }); // For finding recent follow-ups for a specific ANC3

const ancfollowup3= model('Ancfollowup3', ancfollowup3Schema);
export default ancfollowup3;
