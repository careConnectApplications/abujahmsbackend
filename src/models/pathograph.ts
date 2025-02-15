

import { Schema, model } from "mongoose";
import configuration from "../config";
const pathographSchema = new Schema({
   
patient: {
type: Schema.Types.ObjectId,
ref: "Patientsmanagement",
default: null,
},
selectdate:Date,
temperature:String,
pulse:String,
bloodpressuresystolic:String,
bloodpressurediastolic:String,
respiratoryrate:String,
foetalheartrate:String,
liquor:String,
moulding:String,
cervicaldilationb:String,
descentofhead:String,
contraction:String,
doseofoxytocinadministered:String,
urineprotein:String,
urineacetone:String,
urinevolume:String,
effecement:String,
status:{
    type: String,
    default: configuration.status[11]
},
staffname:String
},
{ timestamps: true }
);

const pathograph= model('Pathograph',pathographSchema );
export default pathograph;






/*
selectdate
temperature
pulse
bloodpressuresystolic
bloodpressurediastolic
respiratoryrate
foetalheartrate
liquor
moulding
cervicaldilationb
descentofhead
contraction
doseofoxytocinadministered
status
*/