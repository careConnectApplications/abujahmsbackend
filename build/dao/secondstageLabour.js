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
const countSecondStageLabour = () => __awaiter(void 0, void 0, void 0, function* () {
    const secondStageLabourCount = yield maternity_1.SecondStageLabour.countDocuments({
        deletedAt: { $exists: false },
    });
    return {
        error: false,
        data: secondStageLabourCount,
        status: 200,
    };
});
const readAllSecondStageLabour = (limit, skip, searchText) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = { deletedAt: { $exists: false } };
        if (searchText) {
            filter.$or = [
                { modeOfDelivery: { $regex: searchText, $options: "i" } },
                { contraction: { $regex: searchText, $options: "i" } },
                { preferredDrugs: { $regex: searchText, $options: "i" } },
                { comments: { $regex: searchText, $options: "i" } },
            ];
        }
        const secondStageLabour = yield maternity_1.SecondStageLabour.find(filter)
            .populate("doctor")
            .limit(limit || 10)
            .skip(skip || 0)
            .sort({ createdAt: -1 });
        const totalCount = yield maternity_1.SecondStageLabour.countDocuments(filter);
        return {
            error: false,
            data: secondStageLabour,
            totalCount,
            status: 200,
        };
    }
    catch (error) {
        return {
            error: true,
            message: error.message,
            status: 500,
        };
    }
});
const createSecondStageLabour = (secondStageLabourData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSecondStageLabour = new maternity_1.SecondStageLabour(secondStageLabourData);
        const savedSecondStageLabour = yield newSecondStageLabour.save();
        return {
            error: false,
            message: "Second stage labour created successfully",
            status: 201,
        };
    }
    catch (error) {
        return {
            error: true,
            message: error.message,
            status: 500,
        };
    }
});
const updateSecondStageLabour = (secondStageLabourId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedSecondStageLabour = yield maternity_1.SecondStageLabour.findByIdAndUpdate(secondStageLabourId, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true, runValidators: true });
        if (!updatedSecondStageLabour) {
            throw new Error("Second stage labour not found");
        }
        return {
            error: false,
            message: "Second stage labour updated successfully",
            data: updatedSecondStageLabour,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const deleteSecondStageLabour = (secondStageLabourId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedSecondStageLabour = yield maternity_1.SecondStageLabour.findByIdAndUpdate(secondStageLabourId, { deletedAt: new Date() }, { new: true });
        if (!deletedSecondStageLabour) {
            return {
                error: true,
                message: "Second stage labour not found",
                status: 404,
            };
        }
        return {
            error: false,
            message: "Second stage labour deleted successfully",
            status: 200,
        };
    }
    catch (error) {
        return {
            error: true,
            message: error.message,
            status: 500,
        };
    }
});
const getSecondStageLabourById = (secondStageLabourId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secondStageLabour = yield maternity_1.SecondStageLabour.findOne({
            _id: secondStageLabourId,
            deletedAt: { $exists: false },
        })
            .populate("patient")
            .populate("doctor");
        if (!secondStageLabour) {
            return {
                error: true,
                message: "Second stage labour not found",
                status: 404,
            };
        }
        return {
            error: false,
            data: secondStageLabour,
            status: 200,
        };
    }
    catch (error) {
        return {
            error: true,
            message: error.message,
            status: 500,
        };
    }
});
const getSecondStageLabourByPatientId = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secondStageLabourRecords = yield maternity_1.SecondStageLabour.find({
            patient: patientId
        })
            .populate("patient")
            .populate("doctor")
            .sort({ createdAt: -1 });
        return {
            error: false,
            data: secondStageLabourRecords,
            status: 200,
        };
    }
    catch (error) {
        return {
            error: true,
            message: error.message,
            status: 500,
        };
    }
});
const getSecondStageLabourPaginated = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, searchText, filters) {
    try {
        const skip = (page - 1) * limit;
        const filter = { deletedAt: { $exists: false } };
        if (searchText) {
            filter.$or = [
                { modeOfDelivery: { $regex: searchText, $options: "i" } },
                { contraction: { $regex: searchText, $options: "i" } },
                { comments: { $regex: searchText, $options: "i" } },
            ];
        }
        if (filters) {
            if (filters.modeOfDelivery)
                filter.modeOfDelivery = filters.modeOfDelivery;
            if (filters.startDate && filters.endDate) {
                filter.createdAt = {
                    $gte: new Date(filters.startDate),
                    $lte: new Date(filters.endDate),
                };
            }
        }
        const [data, totalCount] = yield Promise.all([
            maternity_1.SecondStageLabour.find(filter)
                .populate("doctor")
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip),
            maternity_1.SecondStageLabour.countDocuments(filter),
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
        return {
            error: true,
            message: error.message,
            status: 500,
        };
    }
});
exports.default = {
    countSecondStageLabour,
    readAllSecondStageLabour,
    createSecondStageLabour,
    updateSecondStageLabour,
    deleteSecondStageLabour,
    getSecondStageLabourById,
    getSecondStageLabourByPatientId,
    getSecondStageLabourPaginated
};
