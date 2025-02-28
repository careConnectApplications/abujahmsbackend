
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
wf:String,
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

const ancfollowup= model('Ancfollowup', ancfollowupSchema);
export default ancfollowup;





