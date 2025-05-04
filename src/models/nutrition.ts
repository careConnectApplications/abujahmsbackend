import { Schema, model } from "mongoose";
const nutitionSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
      },
      date:Date,
      ageinmonths:String,
      typeofvisit:String,
      infactandyoungchildfeeding:String,
      complementaryfeeding:String,
      counsellingprovided:String,
      referedtosupportgroup:String,
      anthropometryheight:String,
      anthropometryweight:String,
      anthropometrybilateraloedema:String,
      muacred:String,
      muacyellow:String,
      muacgreen:String,
      growthaccordingtothechildhealthcard:String,
      vitaminasupplement:String,
      deworming: String
},
{ timestamps: true }
);

const nutition= model('Nutition', nutitionSchema);
export default nutition;







