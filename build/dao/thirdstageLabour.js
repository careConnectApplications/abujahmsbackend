"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const maternity_1 = require("../models/maternity");
const countThirdStageLabour = () => __awaiter(void 0, void 0, void 0, function* () {
    const thirdStageLabourCount = yield maternity_1.ThirdStageLabour.countDocuments({
        deletedAt: { $exists: false },
    });
    return {
        error: false,
        data: thirdStageLabourCount,
        status: 200,
    };
});
const readAllThirdStageLabour = (limit, skip, searchText) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = { deletedAt: { $exists: false } };
        if (searchText) {
            filter.$or = [
                { "mother.statusAfterDelivery": { $regex: searchText, $options: "i" } },
                { "newBorn.newBornStatus": { $regex: searchText, $options: "i" } },
                { "delivery.deliveryComment": { $regex: searchText, $options: "i" } },
                { "delivery.deliveredBy": { $regex: searchText, $options: "i" } },
            ];
        }
        const thirdStageLabour = yield maternity_1.ThirdStageLabour.find(filter)
            .populate("doctor")
            .limit(limit || 10)
            .skip(skip || 0)
            .sort({ createdAt: -1 });
        const totalCount = yield maternity_1.ThirdStageLabour.countDocuments(filter);
        return {
            error: false,
            data: thirdStageLabour,
            totalCount,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const createThirdStageLabour = (thirdStageLabourData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newThirdStageLabour = new maternity_1.ThirdStageLabour(thirdStageLabourData);
        const savedThirdStageLabour = yield newThirdStageLabour.save();
        return {
            error: false,
            message: "Third stage labour created successfully",
            status: 201,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const updateThirdStageLabour = (thirdStageLabourId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedThirdStageLabour = yield maternity_1.ThirdStageLabour.findByIdAndUpdate(thirdStageLabourId, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true, runValidators: true })
            .populate("patient")
            .populate("doctor");
        if (!updatedThirdStageLabour) {
            throw new Error("Third stage labour not found");
        }
        return {
            error: false,
            message: "Third stage labour updated successfully",
            data: updatedThirdStageLabour,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const deleteThirdStageLabour = (thirdStageLabourId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedThirdStageLabour = yield maternity_1.ThirdStageLabour.findByIdAndUpdate(thirdStageLabourId, { deletedAt: new Date() }, { new: true });
        if (!deletedThirdStageLabour) {
            throw new Error("Third stage labour not found");
        }
        return {
            error: false,
            message: "Third stage labour deleted successfully",
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const getThirdStageLabourById = (thirdStageLabourId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thirdStageLabour = yield maternity_1.ThirdStageLabour.findOne({
            _id: thirdStageLabourId,
            deletedAt: { $exists: false },
        })
            .populate("patient")
            .populate("doctor");
        if (!thirdStageLabour) {
            throw new Error("Third stage labour not found");
        }
        return {
            error: false,
            data: thirdStageLabour,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const getThirdStageLabourByPatientId = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thirdStageLabourRecords = yield maternity_1.ThirdStageLabour.find({
            patient: patientId
        })
            .populate("patient")
            .populate("doctor")
            .sort({ createdAt: -1 });
        return {
            error: false,
            //message: config.messages.general.dataRetrieved,
            data: thirdStageLabourRecords,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const aggregateThirdStageLabour = (startDate_1, endDate_1, ...args_1) => __awaiter(void 0, [startDate_1, endDate_1, ...args_1], void 0, function* (startDate, endDate, groupBy = "month") {
    try {
        const matchStage = { deletedAt: { $exists: false } };
        if (startDate && endDate) {
            matchStage.createdAt = { $gte: startDate, $lte: endDate };
        }
        const groupStage = {
            _id: null,
            total: { $sum: 1 },
            liveBirths: {
                $sum: { $cond: [{ $eq: ["$newBorn.newBornStatus", "Live Birth"] }, 1, 0] },
            },
            stillBirths: {
                $sum: {
                    $cond: [
                        { $in: ["$newBorn.newBornStatus", ["Fresh Still Birth", "Macerated Still Birth"]] },
                        1,
                        0
                    ]
                },
            },
            mothersAlive: {
                $sum: { $cond: [{ $eq: ["$mother.statusAfterDelivery", "Alive"] }, 1, 0] },
            },
            complications: {
                $sum: { $cond: [{ $ne: ["$delivery.obstetricComplication", null] }, 1, 0] },
            },
            averageApgar1Min: { $avg: "$newBorn.apgarScore1Min" },
            averageApgar5Min: { $avg: "$newBorn.apgarScore5Min" },
            averageBloodLoss: { $avg: { $toDouble: "$delivery.bloodLoss" } },
        };
        if (groupBy === "day") {
            groupStage._id = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        }
        else if (groupBy === "month") {
            groupStage._id = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        }
        else {
            groupStage._id = { $year: "$createdAt" };
        }
        const aggregateResult = yield maternity_1.ThirdStageLabour.aggregate([
            { $match: matchStage },
            { $group: groupStage },
            { $sort: { _id: 1 } },
        ]);
        return {
            error: false,
            data: aggregateResult,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const getThirdStageLabourPaginated = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, searchText, filters) {
    try {
        const skip = (page - 1) * limit;
        const filter = { deletedAt: { $exists: false } };
        if (searchText) {
            filter.$or = [
                { "mother.statusAfterDelivery": { $regex: searchText, $options: "i" } },
                { "newBorn.newBornStatus": { $regex: searchText, $options: "i" } },
                { "delivery.deliveryComment": { $regex: searchText, $options: "i" } },
            ];
        }
        if (filters) {
            if (filters.motherStatus)
                filter["mother.statusAfterDelivery"] = filters.motherStatus;
            if (filters.newBornStatus)
                filter["newBorn.newBornStatus"] = filters.newBornStatus;
            if (filters.startDate && filters.endDate) {
                filter.createdAt = {
                    $gte: new Date(filters.startDate),
                    $lte: new Date(filters.endDate),
                };
            }
        }
        const [data, totalCount] = yield Promise.all([
            maternity_1.ThirdStageLabour.find(filter)
                .populate("patient")
                .populate("doctor")
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip),
            maternity_1.ThirdStageLabour.countDocuments(filter),
        ]);
        const totalPages = Math.ceil(totalCount / limit);
        return {
            error: false,
            data: {
                records: data,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalRecords: totalCount,
                    recordsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                },
            },
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
exports.default = {
    countThirdStageLabour,
    readAllThirdStageLabour,
    createThirdStageLabour,
    updateThirdStageLabour,
    deleteThirdStageLabour,
    getThirdStageLabourById,
    getThirdStageLabourByPatientId,
    aggregateThirdStageLabour,
    getThirdStageLabourPaginated
};
