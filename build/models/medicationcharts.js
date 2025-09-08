"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const medicalchartsSchema = new mongoose_1.Schema({
    admission: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admission",
        default: null,
    },
    referedward: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wardmanagement",
        default: null,
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    prescription: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Prescription",
        default: null,
    },
    drug: String,
    note: String,
    dose: String,
    frequency: String,
    route: String,
    staffname: String,
}, { timestamps: true });
// Add indexes for performance optimization
// Single field indexes
medicalchartsSchema.index({ patient: 1 });
medicalchartsSchema.index({ admission: 1 });
medicalchartsSchema.index({ prescription: 1 });
medicalchartsSchema.index({ referedward: 1 });
medicalchartsSchema.index({ drug: 1 });
medicalchartsSchema.index({ createdAt: -1 });
// Compound indexes for common query patterns
medicalchartsSchema.index({ patient: 1, createdAt: -1 });
medicalchartsSchema.index({ admission: 1, createdAt: -1 });
medicalchartsSchema.index({ patient: 1, admission: 1 });
medicalchartsSchema.index({ referedward: 1, createdAt: -1 });
const medicationchart = (0, mongoose_1.model)('Medicationchart', medicalchartsSchema);
exports.default = medicationchart;
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
