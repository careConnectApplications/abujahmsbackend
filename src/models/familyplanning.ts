import { Schema, model } from "mongoose";
import configuration from "../config";
const familyplanningSchema = new Schema({
   
patient: {
type: Schema.Types.ObjectId,
ref: "Patientsmanagement",
default: null,
},
weight:String,
bloodpressuresystolic:String,
parity:String,
counsellingonfamilyplanning:String,
counsellingonpostpartumfamilyplanning:String,
firsttimemodernfamilyplanninguser:String,
emergencycontraception:String,
typeoffamilyplanningclient:String,
oralpillsname:String,
orapillsquantity:Number,
oralnewacceptor:String,
oralrevisit:String,
nameofinjectable:String,
injectablequantity:Number,
selfinjection:String,
injectableacceptor:String,
injectablerevisit:String,
typeofiud:String,
iudinnewacceptor:String,
iudinrevisit:String,
iudoutnewacceptor:String,
iudoutrevisit:String,
typeofbarriermethods:String,
barrierquantity:Number,
barriernewacceptor:String,
barrierrevisit:String,
typeofimplants:String,
implantsinnewacceptor:String,
implantsinrevisit:String,
implantsoutnewacceptor:String,
implantsoutrevisit:String,
voluntorysterilization:String,
naturalemthodsnewacceptorforcyclebeads:String,
naturalemthodsrevisitforcyclebeads:String,
naturalemthodsnewacceptorforothers:String,
naturalemthodsrevisitforothers:String,
referredoralpills:String,
referredinjectable:String,
referredip:String,
referredintrauterinedevice:String,
referredsurgicalreferred:String,
referredmedicalreferred:String,
staffname:String
},
{ timestamps: true }
);

// Single field indexes
familyplanningSchema.index({ patient: 1 }); // For looking up family planning records by patient
familyplanningSchema.index({ createdAt: -1 }); // For sorting by date
familyplanningSchema.index({ staffname: 1 }); // For staff-based queries

// Compound indexes for common query patterns
familyplanningSchema.index({ patient: 1, createdAt: -1 }); // For finding recent family planning records for a specific patient

const familyplanning= model('Familyplanning',familyplanningSchema );
export default familyplanning;
