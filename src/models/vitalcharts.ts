import { Schema, model } from "mongoose";
import configuration from "../config";
const vitalchartsSchema = new Schema({
    admission: {
        type: Schema.Types.ObjectId,
        ref: "Admission",
        default: null,
      },
      referedward:
  {
    type: Schema.Types.ObjectId,
    ref: "Wardmanagement",
    default: null,
  },
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
      },
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
        heartrate:
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
        staffname: String,
},
{ timestamps: true }
);

const vitalchart= model('Vitalchart', vitalchartsSchema);
export default vitalchart;



/*
 order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    drug_id INT,
    quantity_ordered INT,
    order_price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES PurchaseOrders(order_id),
    FOREIGN KEY (drug_id) REFERENCES Drugs(drug_id)
*/