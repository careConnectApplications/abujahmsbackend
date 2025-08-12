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
exports.updateHistopathologyRecord = exports.queryDocs = exports.queryHistopathologyRecord = exports.getAllHistopathologyRecords = exports.getHistopathologyById = void 0;
exports.CreateHistopatholgyDao = CreateHistopatholgyDao;
const histopathology_1 = __importDefault(require("../models/histopathology"));
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
