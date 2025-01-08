import { Schema, model } from "mongoose";
import configuration from "../config";

export interface appointinterface {
  appointmentid: String;
  patient:any,
  clinic:String,
  reason:String,
  appointmentdate:any,
  appointmentcategory:String,
  appointmenttype:String
 
}
const assessmentSchema = new Schema({
  assessment: String,
  assessmentnote: String,
  diagosis: String,
  diagosisnote: String,
  icpc2: String,
  icpc2note: String
})
const generalphysicalexaminationSchema = new Schema({
  hair: String,
  hairnote: String,
  face: String,
  facenote: String,
  jaundice:String,
  jaundicenote:String,
  cyanosis: String,
  cyanosisnote: String,
  pallor: String,
  pallornote: String,
  oral: String,
  oralnote: String,
  lymphnodes: String,
  lymphnodesnote: String,
  ederma:String,
  edermanote:String,
  lastmenstrationperiod: String,
  lastmenstrationperiodnote: String,
  generalphysicalexamination: String,
  paediatricsspecification:{
    general:{
    currentlengthheight: String,
    currentlengthheightpercentage: String,
    currentlengthheightenote: String,
    currentweight: String,
    currentweightnote: String,
    percentageofweightexpected: String,
    headcircumference: String,
    anteriorfontanelle: String,
    posteriorfontanelle: String,
    chestcircumference: String,
    limbexamination: String,
    generalnote: String
    },
    neuro:{
    reflexes: String,
    rootingreflexes: String,
    suckreflexes: String,
    mororeflexes: String,
    tonicneckreflexes: String,
    graspreflexes: String,
    steppingreflexes: String,
    neuronote: String
    }
  }
})

const vitalsSchema = new Schema({
height:{
  type: String

},
weight:
{
  type: String
},
temperature:
{
  type: String
},
heartbit:
{
  type: String, 
 
},
bloodpressuresystolic:
{
  type: String
},
bloodpressurediastolic:
{
  type: String
},
respiration:
{
  type: String
},
saturation:
{
  type: String
},
bmi:
{
  type: String
},
/*
painscore:
{
  type: String
},
rbs:
{
  type: String
},
gcs:
{
  type: String
},
*/
staffname: String,
status:{
 
  type: String,
  default:configuration.status[9]


}
});


const appointmentSchema = new Schema({
  appointmentid:
  {
    type: String, 
    required: true
  },
  reason: String,
  findings: String,  // Description of the examination findings
  diagnosis: String, // Doctor's diagnosis based on the examination
  prescriptions: String,  // List of prescribed medications or treatments
  requestforlabtest: String,
  notes: String, // Additional notes (if any)
  appointmentdate:
  {
    type: Date, 
    required: true
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null,
  },
  payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: true,
    },
    encounter:{ 
      vitals: vitalsSchema,
      assessmentdiagnosis: assessmentSchema,
      generalphysicalexamination:generalphysicalexaminationSchema
    },
    lab: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lab",
        default: [],
      },
    ],
  
  appointmentcategory: {
    type: String,
    required: true
  },
  appointmenttype: {
    type: String,
    required: true
  },
  clinic: {
    type: String,
    required: true
  },
  status:{
    required: true,
    type: String,
    default: configuration.status[2],

  }
});

const appointment = model('Appointment', appointmentSchema);
export default appointment;


