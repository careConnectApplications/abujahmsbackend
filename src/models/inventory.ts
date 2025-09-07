import { Schema, model } from "mongoose";
import configuration from "../config";

export interface labinterface {
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

// Add indexes for performance optimization
// Single field indexes for primary lookups
inventorySchema.index({ name: 1 });
inventorySchema.index({ category: 1 });
inventorySchema.index({ qty: 1 });
inventorySchema.index({ lowstocklevel: 1 });
inventorySchema.index({ expirationdate: 1 });
inventorySchema.index({ lastrestockdate: 1 });
inventorySchema.index({ price: 1 });

// Compound indexes for common query patterns
inventorySchema.index({ category: 1, name: 1 }); // Category-based item lookup
inventorySchema.index({ qty: 1, lowstocklevel: 1 }); // Low stock monitoring
inventorySchema.index({ expirationdate: 1, category: 1 }); // Expiry tracking by category
inventorySchema.index({ name: 1, category: 1, qty: 1 }); // Inventory search and status

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
