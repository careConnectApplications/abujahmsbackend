"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
//create schema
const patientachieveSchema = new mongoose_1.Schema({
    title: {
        type: String
    },
    firstName: {
        required: true,
        type: String,
    },
    middleName: {
        type: String,
    },
    lastName: {
        required: true,
        type: String,
    },
    country: {
        type: String
    },
    stateOfResidence: {
        type: String,
    },
    LGA: {
        type: String
    },
    address: {
        type: String
    },
    age: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    gender: {
        required: true,
        type: String,
    },
    nin: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    oldMRN: {
        type: String,
    },
    nextOfKinName: {
        type: String,
    },
    nextOfKinRelationship: {
        type: String,
    },
    nextOfKinPhoneNumber: {
        type: String,
    },
    nextOfKinAddress: {
        type: String,
    },
    maritalStatus: {
        type: String,
    },
    disability: {
        type: String,
    },
    occupation: {
        type: String,
    },
    isHMOCover: {
        type: String,
        default: config_1.default.ishmo[0],
    },
    HMOName: {
        type: String,
    },
    HMOId: {
        type: String,
    },
    HMOPlan: {
        type: String,
    },
    passport: {
        type: String,
    },
    MRN: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    appointment: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Appointment",
            default: [],
        },
    ],
    admission: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Admission",
            default: [],
        },
    ],
    prescription: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Prescription",
            default: [],
        },
    ],
    lab: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Lab",
            default: [],
        },
    ],
    radiology: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Radiology",
            default: [],
        },
    ],
    prcedure: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Procedure",
            default: [],
        },
    ],
    status: {
        required: true,
        type: String,
        default: config_1.default.status[2],
    },
    payment: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Payment",
            default: [],
        },
    ]
}, { timestamps: true });
//create a model
const patientsachievemanagement = (0, mongoose_1.model)("Patientsachievemanagement", patientachieveSchema);
//export the model
exports.default = patientsachievemanagement;
