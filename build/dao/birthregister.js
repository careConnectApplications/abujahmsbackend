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
const countBirthRegister = () => __awaiter(void 0, void 0, void 0, function* () {
    const birthRegisterCount = yield maternity_1.BirthRegister.countDocuments({
        deletedAt: { $exists: false },
    });
    return {
        error: false,
        data: birthRegisterCount,
        status: 200,
    };
});
const readAllBirthRegister = (limit, skip, searchText) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = { deletedAt: { $exists: false } };
        if (searchText) {
            filter.$or = [
                { "childName.firstName": { $regex: searchText, $options: "i" } },
                { "childName.lastName": { $regex: searchText, $options: "i" } },
                { "motherName.firstName": { $regex: searchText, $options: "i" } },
                { "motherName.lastName": { $regex: searchText, $options: "i" } },
                { "fatherName.firstName": { $regex: searchText, $options: "i" } },
                { "fatherName.lastName": { $regex: searchText, $options: "i" } },
                { phoneNumber: { $regex: searchText, $options: "i" } },
            ];
        }
        const birthRegisters = yield maternity_1.BirthRegister.find(filter)
            .limit(limit || 10)
            .skip(skip || 0)
            .sort({ createdAt: -1 });
        const totalCount = yield maternity_1.BirthRegister.countDocuments(filter);
        return {
            error: false,
            data: birthRegisters,
            totalCount,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const createBirthRegister = (birthRegisterData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBirthRegister = new maternity_1.BirthRegister(birthRegisterData);
        const savedBirthRegister = yield newBirthRegister.save();
        return {
            error: false,
            message: "Birth register created successfully",
            status: 201,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const updateBirthRegister = (birthRegisterId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedBirthRegister = yield maternity_1.BirthRegister.findByIdAndUpdate(birthRegisterId, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true, runValidators: true })
            .populate("patient");
        if (!updatedBirthRegister) {
            throw new Error("Birth register not found");
        }
        return {
            error: false,
            message: "Birth register updated successfully",
            data: updatedBirthRegister,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const deleteBirthRegister = (birthRegisterId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedBirthRegister = yield maternity_1.BirthRegister.findByIdAndUpdate(birthRegisterId, { deletedAt: new Date() }, { new: true });
        if (!deletedBirthRegister) {
            throw new Error("Birth register not found");
        }
        return {
            error: false,
            message: "Birth register deleted successfully",
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const getBirthRegisterById = (birthRegisterId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const birthRegister = yield maternity_1.BirthRegister.findOne({
            _id: birthRegisterId,
            deletedAt: { $exists: false },
        })
            .populate("patient");
        if (!birthRegister) {
            throw new Error("Birth register not found");
        }
        return {
            error: false,
            data: birthRegister,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const getBirthRegisterByPatientId = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const birthRegisters = yield maternity_1.BirthRegister.find({
            patient: patientId
        })
            .populate("patient")
            .sort({ createdAt: -1 });
        return {
            error: false,
            //message: config.messages.general.dataRetrieved,
            data: birthRegisters,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const aggregateBirthRegister = (startDate_1, endDate_1, ...args_1) => __awaiter(void 0, [startDate_1, endDate_1, ...args_1], void 0, function* (startDate, endDate, groupBy = "month") {
    try {
        const matchStage = { deletedAt: { $exists: false } };
        if (startDate && endDate) {
            matchStage.createdAt = { $gte: startDate, $lte: endDate };
        }
        const groupStage = {
            _id: null,
            total: { $sum: 1 },
            maleCount: {
                $sum: { $cond: [{ $eq: ["$sex", "Male"] }, 1, 0] },
            },
            femaleCount: {
                $sum: { $cond: [{ $eq: ["$sex", "Female"] }, 1, 0] },
            },
            under1YearCount: {
                $sum: { $cond: ["$under1YearRegistration", 1, 0] },
            },
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
        const aggregateResult = yield maternity_1.BirthRegister.aggregate([
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
const getBirthRegisterPaginated = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, searchText, filters) {
    try {
        const skip = (page - 1) * limit;
        const filter = { deletedAt: { $exists: false } };
        if (searchText) {
            filter.$or = [
                { "childName.firstName": { $regex: searchText, $options: "i" } },
                { "childName.lastName": { $regex: searchText, $options: "i" } },
                { "motherName.firstName": { $regex: searchText, $options: "i" } },
                { phoneNumber: { $regex: searchText, $options: "i" } },
            ];
        }
        if (filters) {
            if (filters.sex)
                filter.sex = filters.sex;
            if (filters.startDate && filters.endDate) {
                filter.dateOfChildRegistration = {
                    $gte: new Date(filters.startDate),
                    $lte: new Date(filters.endDate),
                };
            }
        }
        const [data, totalCount] = yield Promise.all([
            maternity_1.BirthRegister.find(filter)
                .populate("patient")
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip),
            maternity_1.BirthRegister.countDocuments(filter),
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
    countBirthRegister,
    readAllBirthRegister,
    createBirthRegister,
    updateBirthRegister,
    deleteBirthRegister,
    getBirthRegisterById,
    getBirthRegisterByPatientId,
    aggregateBirthRegister,
    getBirthRegisterPaginated,
};
