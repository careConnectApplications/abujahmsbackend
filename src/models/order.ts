import { Schema, model } from "mongoose";
import configuration from "../config";

export interface labinterface {
    prescription: String;
    orderid:String,
    patient:any

}


const pharmacyorderSchema = new Schema({
  
  prescription:
  {
    type: String, 
    required: true
  },
  orderid:
  {
    type: String, 
    required: true
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },
  appointment: 
    {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      default: [],
    }
  ,
  appointmentid:
  {
    type: String, 
    required: true
  },
  staffname: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null,
  },
  payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: true,
    },
  
  status:{
    required: true,
    type: String,
    default: configuration.status[2],

  }
},
{ timestamps: true }
);

const pharmacyorder = model('Pharmacy', pharmacyorderSchema);
export default pharmacyorder;



/*
 order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    drug_id INT,
    quantity_ordered INT,
    order_price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES PurchaseOrders(order_id),
    FOREIGN KEY (drug_id) REFERENCES Drugs(drug_id)
*/