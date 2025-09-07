import { Schema, model } from "mongoose";
import configuration from "../config";




const admissionSchema = new Schema({
  
  alldiagnosis:[{
    note: String,
    diagnosis:String
  }],
  referedward:
  {
    type: Schema.Types.ObjectId,
    ref: "Wardmanagement",
    default: null,
  },
  referredIn: {
      type: Boolean,
      default: false,   // false = not referred, true = referred-in
    },
  referredFrom: {
      type: String,
      default: null,    // optional: store hospital/clinic/doctor name
    },
  previousward:
  {
    type: Schema.Types.ObjectId,
    ref: "Wardmanagement",
    default: null,
  },
  admittospecialization:
  {
    type: String
  },
  admissionid:
  {
    type: String
  },
  referddate:
  {
    type: Date, 
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
      default: null,
    }
  ,
  bed:{
     type: Schema.Types.ObjectId,
      ref: "Bed",
       required: true

  },
  bedfee:Number,
  doctorname:
  {
    type: String, 
    required: true
  },
  staffname:
  {
    type: String
  },
  dischargeReason: {
      type: String
    },
   
  status:{
    type: String,
    default: configuration.admissionstatus[1],
    required: true

  }
},
{ timestamps: true }
);

// Add indexes for performance optimization
// Single field indexes
admissionSchema.index({ patient: 1 });
admissionSchema.index({ appointment: 1 });
admissionSchema.index({ bed: 1 });
admissionSchema.index({ admissionid: 1 });
admissionSchema.index({ status: 1 });
admissionSchema.index({ referedward: 1 });
admissionSchema.index({ createdAt: -1 });
admissionSchema.index({ referddate: 1 });

// Compound indexes for common query patterns
admissionSchema.index({ patient: 1, status: 1 });
admissionSchema.index({ bed: 1, status: 1 });
admissionSchema.index({ status: 1, createdAt: -1 });
admissionSchema.index({ admissionid: 1, status: 1 });

const admission= model('Admission', admissionSchema);
export default admission;



/*
 order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    drug_id INT,
    quantity_ordered INT,
    order_price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES PurchaseOrders(order_id),
    FOREIGN KEY (drug_id) REFERENCES Drugs(drug_id)
*/
