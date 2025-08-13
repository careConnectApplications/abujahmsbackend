"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentaggregatereports = void 0;
const config_1 = __importDefault(require("../../config"));
const appointmentaggregatereports = (startdate, enddate) => {
    const appointmentaggregatescheduled = [
        {
            $match: { $and: [{ status: config_1.default.status[5] }, {
                        appointmentdate: { $gt: startdate, $lt: enddate }
                    }] }
        },
        {
            $group: {
                _id: "$clinic", // Group by product
                Numberofappointment: { $sum: 1 },
            }
        },
        {
            $project: {
                clinic: "$_id",
                Numberofappointment: 1,
                status: config_1.default.status[5],
                _id: 0
            }
        }
    ];
    const appointmentaggregatecomplete = [
        {
            $match: { $and: [{ status: config_1.default.status[6] }, {
                        appointmentdate: { $gt: startdate, $lt: enddate }
                    }] }
        },
        {
            $group: {
                _id: "$clinic", // Group by product
                Numberofappointment: { $sum: 1 },
            }
        },
        {
            $project: {
                clinic: "$_id",
                Numberofappointment: 1,
                status: config_1.default.status[6],
                _id: 0
            }
        }
    ];
    const appointmentaggregateinprogress = [
        {
            $match: { $and: [{ status: config_1.default.status[9] }, {
                        appointmentdate: { $gt: startdate, $lt: enddate }
                    }] }
        },
        {
            $group: {
                _id: "$clinic", // Group by product
                Numberofappointment: { $sum: 1 },
            }
        },
        {
            $project: {
                clinic: "$_id",
                Numberofappointment: 1,
                status: config_1.default.status[9],
                _id: 0
            }
        }
    ];
    const appointmentaggregatetotalnumberofappointments = [
        {
            $match: { $or: [{ status: config_1.default.status[5] }, { status: config_1.default.status[6] }, { status: config_1.default.status[9] }], appointmentdate: { $gt: startdate, $lt: enddate } }
        },
        {
            $group: {
                _id: null, // Group by product
                GrandTotalNumberofappointment: { $sum: 1 },
            }
        },
        {
            $project: {
                GrandTotalNumberofappointment: 1,
                _id: 0
            }
        }
    ];
    const clinicalaggregate = [
        {
            $match: { appointmentdate: { $gt: startdate, $lt: enddate } }
        },
        {
            $group: {
                _id: {
                    $ifNull: ["$clinicalencounter.diagnosisicd10", "No Diagnosis"] // Group by product
                },
                Numberofappointment: { $sum: 1 },
            }
        },
        {
            $project: {
                diagnosis: "$_id",
                Numberofappointment: 1,
                _id: 0
            }
        }
    ];
    return { appointmentaggregatescheduled, appointmentaggregatecomplete, appointmentaggregateinprogress, appointmentaggregatetotalnumberofappointments, clinicalaggregate };
};
exports.appointmentaggregatereports = appointmentaggregatereports;
