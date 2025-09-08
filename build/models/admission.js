"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
const admissionSchema = new mongoose_1.Schema({
    alldiagnosis: [{
            note: String,
            diagnosis: String
        }],
    referedward: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wardmanagement",
        default: null,
    },
    referredIn: {
        type: Boolean,
        default: false, // false = not referred, true = referred-in
    },
    referredFrom: {
        type: String,
        default: null, // optional: store hospital/clinic/doctor name
    },
    previousward: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wardmanagement",
        default: null,
    },
    admittospecialization: {
        type: String
    },
    admissionid: {
        type: String
    },
    referddate: {
        type: Date,
        required: true
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    appointment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Appointment",
        default: null,
    },
    bed: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Bed",
        required: true
    },
    bedfee: Number,
    doctorname: {
        type: String,
        required: true
    },
    staffname: {
        type: String
    },
    dischargeReason: {
        type: String
    },
    status: {
        type: String,
        default: config_1.default.admissionstatus[1],
        required: true
    }
}, { timestamps: true });
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
const admission = (0, mongoose_1.model)('Admission', admissionSchema);
exports.default = admission;
/*
 order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    drug_id INT,
    quantity_ordered INT,
    order_price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES PurchaseOrders(order_id),
    FOREIGN KEY (drug_id) REFERENCES Drugs(drug_id)
*/
