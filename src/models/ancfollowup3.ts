
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

const ancfollowup3= model('Ancfollowup3', ancfollowup3Schema);
export default ancfollowup3;





