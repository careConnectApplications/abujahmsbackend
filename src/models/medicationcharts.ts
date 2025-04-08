import { Schema, model } from "mongoose";
import configuration from "../config";
const medicalchartsSchema = new Schema({
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
      drug:String,
        note:String,
        dose:String,
        frequency:String,
        route:String,
        staffname: String,
},
{ timestamps: true }
);

const medicationchart= model('Medicationchart', medicalchartsSchema);
export default medicationchart;



/*
 order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    drug_id INT,
    quantity_ordered INT,
    order_price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES PurchaseOrders(order_id),
    FOREIGN KEY (drug_id) REFERENCES Drugs(drug_id)
*/
/*
specialization name
ward
drug
time
note
dose
frequency
route
*/