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
const countMortalityRegister = () => __awaiter(void 0, void 0, void 0, function* () {
    const mortalityRegisterCount = yield maternity_1.MortalityRegister.countDocuments({
        deletedAt: { $exists: false },
    });
    return {
        error: false,
        message: "Data retrieved successfully",
        data: mortalityRegisterCount,
        status: 200,
    };
});
const readAllMortalityRegister = (limit, skip, searchText) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = { deletedAt: { $exists: false } };
        if (searchText) {
            filter.$or = [
                { name: { $regex: searchText, $options: "i" } },
                { patientCardNumber: { $regex: searchText, $options: "i" } },
                { healthFacility: { $regex: searchText, $options: "i" } },
                { ward: { $regex: searchText, $options: "i" } },
                { state: { $regex: searchText, $options: "i" } },
                { lga: { $regex: searchText, $options: "i" } },
            ];
        }
        const mortalityRegisters = yield maternity_1.MortalityRegister.find(filter)
            .limit(limit || 10)
            .skip(skip || 0)
            .sort({ createdAt: -1 });
        const totalCount = yield maternity_1.MortalityRegister.countDocuments(filter);
        return {
            error: false,
            message: "Data retrieved successfully",
            data: mortalityRegisters,
            totalCount,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const createMortalityRegister = (mortalityRegisterData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newMortalityRegister = new maternity_1.MortalityRegister(mortalityRegisterData);
        const savedMortalityRegister = yield newMortalityRegister.save();
        return {
            error: false,
            message: "Mortality register created successfully",
            data: savedMortalityRegister,
            status: 201,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const updateMortalityRegister = (mortalityRegisterId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedMortalityRegister = yield maternity_1.MortalityRegister.findByIdAndUpdate(mortalityRegisterId, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true, runValidators: true });
        if (!updatedMortalityRegister) {
            throw new Error("Mortality register not found");
        }
        return {
            error: false,
            message: "Mortality register updated successfully",
            data: updatedMortalityRegister,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const deleteMortalityRegister = (mortalityRegisterId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedMortalityRegister = yield maternity_1.MortalityRegister.findByIdAndUpdate(mortalityRegisterId, { deletedAt: new Date() }, { new: true });
        if (!deletedMortalityRegister) {
            throw new Error("Mortality register not found");
        }
        return {
            error: false,
            message: "Mortality register deleted successfully",
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const getMortalityRegisterById = (mortalityRegisterId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mortalityRegister = yield maternity_1.MortalityRegister.findOne({
            _id: mortalityRegisterId,
            deletedAt: { $exists: false },
        });
        if (!mortalityRegister) {
            throw new Error("Mortality register not found");
        }
        return {
            error: false,
            message: "Data retrieved successfully",
            data: mortalityRegister,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const getMortalityRegisterByPatientId = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mortalityRegisters = yield maternity_1.MortalityRegister.find({
            patient: patientId
        })
            .sort({ createdAt: -1 });
        return {
            error: false,
            message: "Data retrieved successfully",
            data: mortalityRegisters,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const aggregateMortalityRegister = (startDate_1, endDate_1, ...args_1) => __awaiter(void 0, [startDate_1, endDate_1, ...args_1], void 0, function* (startDate, endDate, groupBy = "month") {
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
            maternalMortalityCount: {
                $sum: { $cond: ["$maternalMortality", 1, 0] },
            },
            neonatalDeathCount: {
                $sum: { $cond: ["$neonatalDeath", 1, 0] },
            },
            averageAge: { $avg: "$age" },
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
        const aggregateResult = yield maternity_1.MortalityRegister.aggregate([
            { $match: matchStage },
            { $group: groupStage },
            { $sort: { _id: 1 } },
        ]);
        return {
            error: false,
            message: "Data retrieved successfully",
            data: aggregateResult,
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
const getMortalityRegisterPaginated = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, searchText, filters) {
    try {
        const skip = (page - 1) * limit;
        const filter = { deletedAt: { $exists: false } };
        if (searchText) {
            filter.$or = [
                { name: { $regex: searchText, $options: "i" } },
                { patientCardNumber: { $regex: searchText, $options: "i" } },
                { healthFacility: { $regex: searchText, $options: "i" } },
                { ward: { $regex: searchText, $options: "i" } },
            ];
        }
        if (filters) {
            if (filters.sex)
                filter.sex = filters.sex;
            if (filters.maternalMortality !== undefined)
                filter.maternalMortality = filters.maternalMortality;
            if (filters.neonatalDeath !== undefined)
                filter.neonatalDeath = filters.neonatalDeath;
            if (filters.maternalDeath)
                filter.maternalDeath = filters.maternalDeath;
            if (filters.startDate && filters.endDate) {
                filter.createdAt = {
                    $gte: new Date(filters.startDate),
                    $lte: new Date(filters.endDate),
                };
            }
        }
        const [data, totalCount] = yield Promise.all([
            maternity_1.MortalityRegister.find(filter)
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip),
            maternity_1.MortalityRegister.countDocuments(filter),
        ]);
        const totalPages = Math.ceil(totalCount / limit);
        return {
            error: false,
            message: "Data retrieved successfully",
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
const getMortalityStatistics = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matchStage = { deletedAt: { $exists: false } };
        if (startDate && endDate) {
            matchStage.createdAt = { $gte: startDate, $lte: endDate };
        }
        const statistics = yield maternity_1.MortalityRegister.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalDeaths: { $sum: 1 },
                    maleDeaths: {
                        $sum: { $cond: [{ $eq: ["$sex", "Male"] }, 1, 0] },
                    },
                    femaleDeaths: {
                        $sum: { $cond: [{ $eq: ["$sex", "Female"] }, 1, 0] },
                    },
                    maternalMortality: {
                        $sum: { $cond: ["$maternalMortality", 1, 0] },
                    },
                    neonatalDeaths: {
                        $sum: { $cond: ["$neonatalDeath", 1, 0] },
                    },
                    averageAge: { $avg: "$age" },
                    minAge: { $min: "$age" },
                    maxAge: { $max: "$age" },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalDeaths: 1,
                    maleDeaths: 1,
                    femaleDeaths: 1,
                    maternalMortality: 1,
                    neonatalDeaths: 1,
                    averageAge: { $round: ["$averageAge", 2] },
                    minAge: 1,
                    maxAge: 1,
                    sexRatio: {
                        $cond: [
                            { $eq: ["$femaleDeaths", 0] },
                            "N/A",
                            { $round: [{ $divide: ["$maleDeaths", "$femaleDeaths"] }, 2] },
                        ],
                    },
                },
            },
        ]);
        // Get maternal death causes breakdown
        const maternalDeathCauses = yield maternity_1.MortalityRegister.aggregate([
            {
                $match: Object.assign(Object.assign({}, matchStage), { maternalMortality: true, maternalDeath: { $exists: true } }),
            },
            {
                $group: {
                    _id: "$maternalDeath",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);
        return {
            error: false,
            message: "Data retrieved successfully",
            data: {
                statistics: statistics[0] || {
                    totalDeaths: 0,
                    maleDeaths: 0,
                    femaleDeaths: 0,
                    maternalMortality: 0,
                    neonatalDeaths: 0,
                    averageAge: 0,
                    minAge: 0,
                    maxAge: 0,
                    sexRatio: "N/A",
                },
                maternalDeathCauses,
            },
            status: 200,
        };
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
});
exports.default = {
    countMortalityRegister,
    readAllMortalityRegister,
    createMortalityRegister,
    updateMortalityRegister,
    deleteMortalityRegister,
    getMortalityRegisterById,
    getMortalityRegisterByPatientId,
    aggregateMortalityRegister,
    getMortalityRegisterPaginated,
    getMortalityStatistics,
};
