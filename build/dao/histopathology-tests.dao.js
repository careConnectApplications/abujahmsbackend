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
exports.queryDocs = exports.getAllHistopathologyTestRecords = exports.updateHistopathologyById = exports.queryHistopathologyTestFilter = exports.queryOneHistopathologyTestFilter = void 0;
exports.CreateHistopatholgyTestDao = CreateHistopatholgyTestDao;
const histopathologyExamForm_1 = __importDefault(require("../models/histopathologyExamForm"));
function CreateHistopatholgyTestDao(body, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const histopathologyTestForm = new histopathologyExamForm_1.default(body);
            return yield histopathologyTestForm.save();
        }
        catch (err) {
            return next(err);
        }
    });
}
const queryOneHistopathologyTestFilter = (query, selectquery, populatequery) => __awaiter(void 0, void 0, void 0, function* () { return yield histopathologyExamForm_1.default.findOne(query).select(selectquery).populate(populatequery); });
exports.queryOneHistopathologyTestFilter = queryOneHistopathologyTestFilter;
const queryHistopathologyTestFilter = (query, selectquery, populatequery) => __awaiter(void 0, void 0, void 0, function* () { return yield histopathologyExamForm_1.default.find(query).select(selectquery).populate(populatequery); });
exports.queryHistopathologyTestFilter = queryHistopathologyTestFilter;
const updateHistopathologyById = (Id, body) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedTestRecord = yield histopathologyExamForm_1.default.findByIdAndUpdate({ _id: Id }, body, {
        new: true,
        runValidators: true,
    });
    return updatedTestRecord;
});
exports.updateHistopathologyById = updateHistopathologyById;
const getAllHistopathologyTestRecords = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const docs = yield histopathologyExamForm_1.default.find(query).sort({ createdAt: -1 });
    return docs;
});
exports.getAllHistopathologyTestRecords = getAllHistopathologyTestRecords;
/**
 * Query for histopathology Test records
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryDocs = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    const docs = yield histopathologyExamForm_1.default.paginate(filter, options);
    return docs;
});
exports.queryDocs = queryDocs;
