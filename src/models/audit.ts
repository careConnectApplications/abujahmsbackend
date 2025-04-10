import {Schema, model} from "mongoose";
export interface auditinterface{
    "action": String,
    "actor": String
  }
//create schema
 const auditSchema = new Schema(
    {
        action:{ 
            required: true,
            type: String
        },
        actor:{
            required: true,
            type: String,

        }
       
    },
    {timestamps: true}
);

//create a model
const audit = model("Audit", auditSchema);
//export the model
export default audit;
