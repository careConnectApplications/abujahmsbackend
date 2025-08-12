"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.financialreports = void 0;
const config_1 = __importDefault(require("../../config"));
const financialreports = (startdate, enddate) => {
    const financialaggregatepaid = [
        {
            $match: { $and: [{ status: config_1.default.status[3] }, { updatedAt: { $gt: startdate, $lt: enddate } }] }
        },
        {
            $group: {
                _id: "$paymentcategory", // Group by product
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $project: {
                paymentcategory: "$_id",
                totalAmount: 1,
                status: config_1.default.status[3],
                _id: 0
            }
        }
    ];
    const financialaggregategrandtotalpaid = [
        {
            $match: { $and: [{ status: config_1.default.status[3] }, { updatedAt: { $gt: startdate, $lt: enddate } }] }
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
    return { financialaggregatepaid, financialaggregategrandtotalpaid };
};
exports.financialreports = financialreports;
