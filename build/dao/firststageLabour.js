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
const countFirstStageLabour = () => __awaiter(void 0, void 0, void 0, function* () {
    const firstStageLabourCount = yield maternity_1.FirstStageLabour.countDocuments({
        deletedAt: { $exists: false },
    });
    return {
        error: false,
        data: firstStageLabourCount,
        status: 200,
    };
});
const readAllFirstStageLabour = (limit, skip, searchText) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = { deletedAt: { $exists: false } };
        if (searchText) {
            filter.$or = [
                { phase: { $regex: searchText, $options: "i" } },
                { contraction: { $regex: searchText, $options: "i" } },
                { palpationExamination: { $regex: searchText, $options: "i" } },
                { notes: { $regex: searchText, $options: "i" } },
            ];
        }
        const firstStageLabour = yield maternity_1.FirstStageLabour.find(filter)
            .populate("patient")
            .populate("doctor")
            .limit(limit || 10)
            .skip(skip || 0)
            .sort({ createdAt: -1 });
        const totalCount = yield maternity_1.FirstStageLabour.countDocuments(filter);
        return {
            error: false,
            data: firstStageLabour,
            totalCount,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const createFirstStageLabour = (firstStageLabourData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newFirstStageLabour = new maternity_1.FirstStageLabour(firstStageLabourData);
        const savedFirstStageLabour = yield newFirstStageLabour.save();
        return {
            error: false,
            message: "First stage labour created successfully",
            status: 201,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const updateFirstStageLabour = (firstStageLabourId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedFirstStageLabour = yield maternity_1.FirstStageLabour.findByIdAndUpdate(firstStageLabourId, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true, runValidators: true })
            .populate("patient")
            .populate("doctor");
        if (!updatedFirstStageLabour) {
            throw new Error("First stage labour not found");
        }
        return {
            error: false,
            message: "First stage labour updated successfully",
            data: updatedFirstStageLabour,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const deleteFirstStageLabour = (firstStageLabourId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedFirstStageLabour = yield maternity_1.FirstStageLabour.findByIdAndUpdate(firstStageLabourId, { deletedAt: new Date() }, { new: true });
        if (!deletedFirstStageLabour) {
            throw new Error("First stage labour not found");
        }
        return {
            error: false,
            message: "First stage labour deleted successfully",
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const getFirstStageLabourById = (firstStageLabourId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const firstStageLabour = yield maternity_1.FirstStageLabour.findOne({
            _id: firstStageLabourId,
            deletedAt: { $exists: false },
        })
            .populate("patient")
            .populate("doctor");
        if (!firstStageLabour) {
            throw new Error("First stage labour not found");
        }
        return {
            error: false,
            data: firstStageLabour,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const getFirstStageLabourByPatientId = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const firstStageLabourRecords = yield maternity_1.FirstStageLabour.find({
            patient: patientId
        })
            .populate("patient")
            .populate("doctor")
            .sort({ createdAt: -1 });
        return {
            error: false,
            //message: config.messages.general.dataRetrieved,
            data: firstStageLabourRecords,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const aggregateFirstStageLabour = (startDate_1, endDate_1, ...args_1) => __awaiter(void 0, [startDate_1, endDate_1, ...args_1], void 0, function* (startDate, endDate, groupBy = "month") {
    try {
        const matchStage = { deletedAt: { $exists: false } };
        if (startDate && endDate) {
            matchStage.createdAt = { $gte: startDate, $lte: endDate };
        }
        const groupStage = {
            _id: null,
            total: { $sum: 1 },
            activePhase: {
                $sum: { $cond: [{ $eq: ["$phase", "Active"] }, 1, 0] },
            },
            latentPhase: {
                $sum: { $cond: [{ $eq: ["$phase", "Latent"] }, 1, 0] },
            },
            inducedLabour: {
                $sum: { $cond: [{ $eq: ["$inducedLabour", true] }, 1, 0] },
            },
            averageCervicalDilation: { $avg: "$cervicalDilation" },
            complicationCount: { $sum: { $cond: [{ $ne: ["$obstetricComplication", null] }, 1, 0] } },
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
        const aggregateResult = yield maternity_1.FirstStageLabour.aggregate([
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
const getFirstStageLabourPaginated = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, searchText, filters) {
    try {
        const skip = (page - 1) * limit;
        const filter = { deletedAt: { $exists: false } };
        if (searchText) {
            filter.$or = [
                { phase: { $regex: searchText, $options: "i" } },
                { contraction: { $regex: searchText, $options: "i" } },
                { notes: { $regex: searchText, $options: "i" } },
            ];
        }
        if (filters) {
            if (filters.phase)
                filter.phase = filters.phase;
            if (filters.inducedLabour !== undefined)
                filter.inducedLabour = filters.inducedLabour;
            if (filters.startDate && filters.endDate) {
                filter.createdAt = {
                    $gte: new Date(filters.startDate),
                    $lte: new Date(filters.endDate),
                };
            }
        }
        const [data, totalCount] = yield Promise.all([
            maternity_1.FirstStageLabour.find(filter)
                .populate("doctor")
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip),
            maternity_1.FirstStageLabour.countDocuments(filter),
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
    countFirstStageLabour,
    readAllFirstStageLabour,
    createFirstStageLabour,
    updateFirstStageLabour,
    deleteFirstStageLabour,
    getFirstStageLabourById,
    getFirstStageLabourByPatientId,
    aggregateFirstStageLabour,
    getFirstStageLabourPaginated,
};
