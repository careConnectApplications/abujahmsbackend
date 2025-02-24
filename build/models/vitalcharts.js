"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const vitalchartsSchema = new mongoose_1.Schema({
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
    height: {
        type: String
    },
    weight: {
        type: String
    },
    temperature: {
        type: String
    },
    heartrate: {
        type: String,
    },
    bloodpressuresystolic: {
        type: String
    },
    bloodpressurediastolic: {
        type: String
    },
    respiration: {
        type: String
    },
    saturation: {
        type: String
    },
    bmi: {
        type: String
    },
    painscore: {
        type: String
    },
    rbs: {
        type: String
    },
    gcs: {
        type: String
    },
    staffname: String,
}, { timestamps: true });
const vitalchart = (0, mongoose_1.model)('Vitalchart', vitalchartsSchema);
exports.default = vitalchart;
/*
 order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    drug_id INT,
    quantity_ordered INT,
    order_price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES PurchaseOrders(order_id),
    FOREIGN KEY (drug_id) REFERENCES Drugs(drug_id)
*/ 
