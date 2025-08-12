"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashieraggregatereports = void 0;
const config_1 = __importDefault(require("../../config"));
const cashieraggregatereports = (startdate, enddate) => {
    const cashieraggregatepaid = [
        {
            $match: { $and: [{ status: config_1.default.status[3] }, { createdAt: { $gt: startdate, $lt: enddate } }] }
        },
        {
            $group: {
                _id: "$cashieremail", // Group by product
                totalAmount: { $sum: "$amount" },
                cashierid: { $first: "$cashierid" },
                tempcashiername: {
                    $push: {
                        $cond: [{ $ne: ["$cashiername", null] }, "$cashiername", "$$REMOVE"]
                    }
                },
                //cashiername:{$first:"$cashiername"}
            }
        },
        {
            $addFields: {
                cashiername: { $arrayElemAt: ["$tempcashiername", 0] }
            }
        },
        {
            $project: {
                cashieremail: "$_id",
                cashiername: 1,
                totalAmount: 1,
                cashierid: 1,
                status: config_1.default.status[3],
                _id: 0
            }
        }
    ];
    const cashieraggregatepaidgrandtotal = [
        {
            $match: { $and: [{ status: config_1.default.status[3] }, { createdAt: { $gt: startdate, $lt: enddate } }] }
        },
        {
            $group: {
                _id: null, // Group by product
                grandtotalAmount: { $sum: "$amount" }
            }
        },
        {
            $project: {
                grandtotalAmount: 1,
                _id: 0
            }
        }
    ];
    return { cashieraggregatepaid, cashieraggregatepaidgrandtotal };
};
exports.cashieraggregatereports = cashieraggregatereports;
