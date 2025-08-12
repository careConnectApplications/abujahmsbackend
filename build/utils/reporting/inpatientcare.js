"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inpatientattendancereports = void 0;
const config_1 = __importDefault(require("../../config"));
const inpatientattendancereports = (startdate, enddate) => {
    const inpatientdischarges = [
        {
            $match: { $and: [{ updatedAt: { $gt: startdate, $lt: enddate } }, { status: config_1.default.admissionstatus[5] }] }
        },
        {
            // Group to ensure each patient is counted once
            $group: {
                _id: "$patient"
            }
        },
        {
            // Join with patient details
            $lookup: {
                from: "patientsmanagements",
                localField: "_id",
                foreignField: "_id",
                as: "patientDetails"
            }
        },
        {
            $unwind: "$patientDetails"
        },
        {
            // Convert and sanitize DOB, add gender
            $addFields: {
                dob: {
                    $cond: {
                        if: {
                            $and: [
                                { $ne: ["$patientDetails.dateOfBirth", null] },
                                { $ne: ["$patientDetails.dateOfBirth", ""] }
                            ]
                        },
                        then: { $toDate: "$patientDetails.dateOfBirth" },
                        else: null
                    }
                },
                gender: "$patientDetails.gender"
            }
        },
        {
            $match: {
                dob: { $ne: null }
            }
        },
        {
            // Calculate age in days
            $addFields: {
                age: {
                    $dateDiff: {
                        startDate: "$dob",
                        endDate: "$$NOW",
                        unit: "day"
                    }
                }
            }
        },
        {
            // Assign age group
            $addFields: {
                ageGroup: {
                    $switch: {
                        branches: [
                            { case: { $lt: ["$age", 29] }, then: "0-28 days" },
                            {
                                case: {
                                    $and: [{ $gte: ["$age", 28] }, { $lte: ["$age", 331] }]
                                },
                                then: "29d-11mths"
                            },
                            {
                                case: {
                                    $and: [{ $gt: ["$age", 330] }, { $lte: ["$age", 1771] }]
                                },
                                then: "12-59mths"
                            },
                            {
                                case: {
                                    $and: [{ $gt: ["$age", 1770] }, { $lte: ["$age", 3241] }]
                                },
                                then: "5-9yrs"
                            },
                            {
                                case: {
                                    $and: [{ $gt: ["$age", 3240] }, { $lte: ["$age", 6841] }]
                                },
                                then: "10-19yrs"
                            },
                            { case: { $gt: ["$age", 6840] }, then: ">=20yrs" }
                        ],
                        default: "Unknown"
                    }
                }
            }
        },
        {
            // Group by gender and age group
            $group: {
                _id: { gender: "$gender", ageGroup: "$ageGroup" },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                gender: "$_id.gender",
                ageGroup: "$_id.ageGroup",
                count: 1
            }
        },
        {
            $sort: {
                ageGroup: 1,
                gender: 1
            }
        }
    ];
    return { inpatientdischarges };
};
exports.inpatientattendancereports = inpatientattendancereports;
