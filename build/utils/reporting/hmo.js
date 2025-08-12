"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hmoaggregatereports = void 0;
const config_1 = __importDefault(require("../../config"));
const hmoaggregatereports = (startdate, enddate) => {
    const aggregatebyhmo = [
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patient",
            },
        },
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: { $and: [
                    {
                        "patient.isHMOCover": config_1.default.ishmo[1]
                    },
                    { createdAt: { $gt: startdate, $lt: enddate } }
                ]
            }
        },
        {
            $group: {
                _id: { $ifNull: ["$patient.HMOName", "HMO Not Found"] },
                //"$patient.HMOName",                // Group by product
                TotalNumber: { $sum: 1 },
            }
        },
        {
            $project: {
                HMOName: "$_id",
                TotalNumber: 1,
                _id: 0
            }
        }
    ];
    ///////procedure ////////
    const appointmentaggregatebyhmo = [
        {
            $lookup: {
                from: "patientsmanagements",
                localField: "patient",
                foreignField: "_id",
                as: "patient",
            },
        },
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: { $and: [
                    {
                        "patient.isHMOCover": config_1.default.ishmo[1]
                    },
                    { appointmentdate: { $gt: startdate, $lt: enddate } }
                ]
            }
        },
        {
            $group: {
                _id: { $ifNull: ["$patient.HMOName", "HMO Not Found"] },
                //"$patient.HMOName",                // Group by product
                TotalNumber: { $sum: 1 },
            }
        },
        {
            $project: {
                HMOName: "$_id",
                TotalNumber: 1,
                _id: 0
            }
        }
    ];
    return { appointmentaggregatebyhmo, aggregatebyhmo };
};
exports.hmoaggregatereports = hmoaggregatereports;
