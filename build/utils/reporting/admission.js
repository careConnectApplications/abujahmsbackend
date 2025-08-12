"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admissionaggregatereports = void 0;
const config_1 = __importDefault(require("../../config"));
const admissionaggregatereports = (startdate, enddate) => {
    const admissionaggregateadmited = [
        {
            $lookup: {
                from: "wardmanagements",
                localField: "referedward",
                foreignField: "_id",
                as: "referedward",
            },
        },
        {
            $unwind: {
                path: "$referedward",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: { $and: [{ status: config_1.default.admissionstatus[1] }, { referddate: { $gt: startdate, $lt: enddate } }] }
        },
        {
            $group: {
                _id: "$referedward.wardname", // Group by product
                Numberofadmission: { $sum: 1 },
            }
        },
        {
            $project: {
                wardname: "$_id",
                Numberofadmission: 1,
                status: config_1.default.admissionstatus[1],
                _id: 0
            }
        }
    ];
    const admissionaggregatetransfered = [
        {
            $lookup: {
                from: "wardmanagements",
                localField: "referedward",
                foreignField: "_id",
                as: "referedward",
            },
        },
        {
            $unwind: {
                path: "$referedward",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: { $and: [{ status: config_1.default.admissionstatus[3] }, { referddate: { $gt: startdate, $lt: enddate } }] }
        },
        {
            $group: {
                _id: "$referedward.wardname", // Group by product
                Numberofadmission: { $sum: 1 },
            }
        },
        {
            $project: {
                wardname: "$_id",
                Numberofadmission: 1,
                status: config_1.default.admissionstatus[3],
                _id: 0
            }
        }
    ];
    const admissionaggregatedischarged = [
        {
            $lookup: {
                from: "wardmanagements",
                localField: "referedward",
                foreignField: "_id",
                as: "referedward",
            },
        },
        {
            $unwind: {
                path: "$referedward",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: { $and: [{ status: config_1.default.admissionstatus[5] }, { referddate: { $gt: startdate, $lt: enddate } }] }
        },
        {
            $group: {
                _id: "$referedward.wardname", // Group by product
                Numberofadmission: { $sum: 1 },
            }
        },
        {
            $project: {
                wardname: "$_id",
                Numberofadmission: 1,
                status: config_1.default.admissionstatus[5],
                _id: 0
            }
        }
    ];
    const admissionaggregatetotalnumberofadmissions = [
        {
            $match: { $or: [{ status: config_1.default.admissionstatus[1] }, { status: config_1.default.admissionstatus[3] }, { status: config_1.default.admissionstatus[5] }], referddate: { $gt: startdate, $lt: enddate } }
        },
        {
            $group: {
                _id: null, // Group by product
                TotalNumberofadmission: { $sum: 1 },
            }
        },
        {
            $project: {
                TotalNumberofadmission: 1,
                _id: 0
            }
        }
    ];
    return { admissionaggregateadmited, admissionaggregatetransfered, admissionaggregatedischarged, admissionaggregatetotalnumberofadmissions };
};
exports.admissionaggregatereports = admissionaggregatereports;
