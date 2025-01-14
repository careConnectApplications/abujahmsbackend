import { Schema, model } from "mongoose";
import configuration from "../config";

export interface labinterface {
    prescription: String;
    orderid:String,
    patient:any

}


const inventorySchema = new Schema({ 
  name:
  {
    type: String, 
    required: true
  },
  category:
  {
    type: String, 
    required: true
  },
  
  qty:
  {
    type: Number, 
    required: true
  },
  lowstocklevel: {
    type: Number,
    required: true
  
  },
  expirationdate: {
      type: Date,
      required: true
    },
 lastrestockdate: {
        type: Date,
        required: true
      },
      //Price
      price: {
        type: Schema.Types.ObjectId,
        ref: "Price",
        default: null,
      }
  },
{ timestamps: true }
);

const inventory = model('Inventory', inventorySchema);
export default inventory;



/*
 order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    drug_id INT,
    quantity_ordered INT,
    order_price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES PurchaseOrders(order_id),
    FOREIGN KEY (drug_id) REFERENCES Drugs(drug_id)
*/