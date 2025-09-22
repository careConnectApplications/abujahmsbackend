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
const readAllPostnatalCare = (limit, skip, searchText) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = { deletedAt: { $exists: false } };
        if (searchText) {
            filter.$or = [
                { visitFor: { $regex: searchText, $options: "i" } },
                { associatedProblems: { $regex: searchText, $options: "i" } },
                { typeOfVisit: { $regex: searchText, $options: "i" } },
                { sexOfChild: { $regex: searchText, $options: "i" } },
            ];
        }
        const postnatalCare = yield maternity_1.PostnatalCare.find(filter)
            .populate("patient")
            .populate("doctor")
            .limit(limit || 10)
            .skip(skip || 0)
            .sort({ createdAt: -1 });
        const totalCount = yield maternity_1.PostnatalCare.countDocuments(filter);
        return {
            error: false,
            data: postnatalCare,
            totalCount,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const createPostnatalCare = (postnatalCareData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPostnatalCare = new maternity_1.PostnatalCare(postnatalCareData);
        const savedPostnatalCare = yield newPostnatalCare.save();
        return {
            error: false,
            message: "Postnatal care created successfully",
            status: 201,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const updatePostnatalCare = (postnatalCareId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPostnatalCare = yield maternity_1.PostnatalCare.findByIdAndUpdate(postnatalCareId, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true, runValidators: true })
            .populate("patient")
            .populate("doctor");
        if (!updatedPostnatalCare) {
            throw new Error("Postnatal care not found");
        }
        return {
            error: false,
            message: "Postnatal care updated successfully",
            data: updatedPostnatalCare,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const deletePostnatalCare = (postnatalCareId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPostnatalCare = yield maternity_1.PostnatalCare.findByIdAndUpdate(postnatalCareId, { deletedAt: new Date() }, { new: true });
        if (!deletedPostnatalCare) {
            throw new Error("Postnatal care not found");
        }
        return {
            error: false,
            message: "Postnatal care deleted successfully",
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const getPostnatalCareById = (postnatalCareId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postnatalCare = yield maternity_1.PostnatalCare.findOne({
            _id: postnatalCareId,
            deletedAt: { $exists: false },
        })
            .populate("patient")
            .populate("doctor");
        if (!postnatalCare) {
            throw new Error("Postnatal care not found");
        }
        return {
            error: false,
            data: postnatalCare,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const getPostnatalCareByPatientId = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postnatalCareRecords = yield maternity_1.PostnatalCare.find({
            patient: patientId
        })
            .populate("patient")
            .populate("doctor")
            .sort({ createdAt: -1 });
        return {
            error: false,
            //message: config.messages.general.dataRetrieved,
            data: postnatalCareRecords,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const getPostnatalCarePaginated = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, searchText, filters) {
    try {
        const skip = (page - 1) * limit;
        const filter = { deletedAt: { $exists: false } };
        if (searchText) {
            filter.$or = [
                { visitFor: { $regex: searchText, $options: "i" } },
                { associatedProblems: { $regex: searchText, $options: "i" } },
                { typeOfVisit: { $regex: searchText, $options: "i" } },
            ];
        }
        if (filters) {
            if (filters.typeOfVisit)
                filter.typeOfVisit = filters.typeOfVisit;
            if (filters.sexOfChild)
                filter.sexOfChild = filters.sexOfChild;
            if (filters.outcomeOfVisit)
                filter.outcomeOfVisit = filters.outcomeOfVisit;
            if (filters.startDate && filters.endDate) {
                filter.createdAt = {
                    $gte: new Date(filters.startDate),
                    $lte: new Date(filters.endDate),
                };
            }
        }
        const [data, totalCount] = yield Promise.all([
            maternity_1.PostnatalCare.find(filter)
                .populate("doctor")
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip),
            maternity_1.PostnatalCare.countDocuments(filter),
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
    readAllPostnatalCare,
    createPostnatalCare,
    updatePostnatalCare,
    deletePostnatalCare,
    getPostnatalCareById,
    getPostnatalCareByPatientId,
    getPostnatalCarePaginated,
};
