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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistopatholofySubdocument = exports.getAllPaginatedHistopathologyRecords = exports.updateHistopathologyRecord = exports.queryDocs = exports.queryHistopathologyRecord = exports.getAllHistopathologyRecords = exports.getHistopathologyById = exports.getHistopathologyByIdPopulate = exports.findTestRequiredById = void 0;
exports.CreateHistopatholgyDao = CreateHistopatholgyDao;
const mongoose_1 = __importDefault(require("mongoose"));
const histopathology_1 = __importDefault(require("../models/histopathology"));
const findTestRequiredById = (subdocId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield histopathology_1.default.findOne({ "testRequired._id": new mongoose_1.default.Types.ObjectId(subdocId) }, { "testRequired.$": 1 } // project only the matching subdocument
    );
    return result;
});
exports.findTestRequiredById = findTestRequiredById;
function CreateHistopatholgyDao(body, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const histopathology = new histopathology_1.default(body);
            return yield histopathology.save();
        }
        catch (err) {
            return next(err);
        }
    });
}
const getHistopathologyByIdPopulate = (id) => __awaiter(void 0, void 0, void 0, function* () { return histopathology_1.default.findById(id).populate('patient'); });
exports.getHistopathologyByIdPopulate = getHistopathologyByIdPopulate;
const getHistopathologyById = (id) => __awaiter(void 0, void 0, void 0, function* () { return histopathology_1.default.findById(id); });
exports.getHistopathologyById = getHistopathologyById;
const getAllHistopathologyRecords = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const docs = yield histopathology_1.default.find(query).sort({ createdAt: -1 });
    return docs;
});
exports.getAllHistopathologyRecords = getAllHistopathologyRecords;
const queryHistopathologyRecord = (query, selectquery, populatequery) => __awaiter(void 0, void 0, void 0, function* () {
    return yield histopathology_1.default.findOne(query).select(selectquery).populate(populatequery);
});
exports.queryHistopathologyRecord = queryHistopathologyRecord;
/**
 * Query for histopathology records
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryDocs = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    const docs = yield histopathology_1.default.paginate(filter, options);
    return docs;
});
exports.queryDocs = queryDocs;
const updateHistopathologyRecord = (query, reqbody) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield histopathology_1.default.findOneAndUpdate(query, reqbody, {
        new: true
    });
    return doc;
});
exports.updateHistopathologyRecord = updateHistopathologyRecord;
const getAllPaginatedHistopathologyRecords = (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, page = 1, size = 150) {
    const skip = (page - 1) * size;
    const [docs, total] = yield Promise.all([
        histopathology_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(size),
        histopathology_1.default.countDocuments(query),
    ]);
    return {
        docs,
        total,
        page,
        totalPages: Math.ceil(total / size),
    };
});
exports.getAllPaginatedHistopathologyRecords = getAllPaginatedHistopathologyRecords;
const getHistopatholofySubdocument = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield histopathology_1.default.aggregate([
        { $match: { "testRequired._id": new mongoose_1.default.Types.ObjectId(id) } },
        // lookup patient
        {
            $lookup: {
                from: "patientsmanagements", // collection name (check exact name in MongoDB)
                localField: "patient",
                foreignField: "_id",
                as: "patient"
            }
        },
        { $unwind: "$patient" },
        {
            $project: {
                patient: 1,
                staffInfo: 1,
                amount: 1,
                status: 1,
                refNumber: 1,
                createdAt: 1,
                updatedAt: 1,
                testRequired: {
                    $filter: {
                        input: "$testRequired",
                        as: "tr",
                        cond: { $eq: ["$$tr._id", new mongoose_1.default.Types.ObjectId(id)] }
                    }
                }
            }
        }
    ]);
    if (!result || result.length === 0)
        throw new Error("TestRequired not found");
    return result;
});
exports.getHistopatholofySubdocument = getHistopatholofySubdocument;
