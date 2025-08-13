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
exports.updateDoctorWardRecordById = exports.queryDoctorWardRoundRecord = exports.getAllDoctorWardRoundRecords = exports.getDoctorWardRoundById = void 0;
exports.CreateDoctorWardRoundDao = CreateDoctorWardRoundDao;
const doctor_ward_round_1 = __importDefault(require("../models/doctor-ward-round"));
function CreateDoctorWardRoundDao(body, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const histopathology = new doctor_ward_round_1.default(body);
            return yield histopathology.save();
        }
        catch (err) {
            return next(err);
        }
    });
}
const getDoctorWardRoundById = (id) => __awaiter(void 0, void 0, void 0, function* () { return doctor_ward_round_1.default.findById(id); });
exports.getDoctorWardRoundById = getDoctorWardRoundById;
const getAllDoctorWardRoundRecords = (query, populate) => __awaiter(void 0, void 0, void 0, function* () {
    const docs = yield doctor_ward_round_1.default.find(query).populate(populate).sort({ createdAt: -1 });
    return docs;
});
exports.getAllDoctorWardRoundRecords = getAllDoctorWardRoundRecords;
const queryDoctorWardRoundRecord = (query, selectquery, populatequery) => __awaiter(void 0, void 0, void 0, function* () {
    return yield doctor_ward_round_1.default.findOne(query).select(selectquery).populate(populatequery);
});
exports.queryDoctorWardRoundRecord = queryDoctorWardRoundRecord;
/**
 * Query for histopathology records
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
// export const queryDocs = async (
//     filter: Record<string, any>,
//     options: IOptions
// ): Promise<QueryResult> => {
//     const docs = await Histopathology.paginate(filter, options);
//     return docs;
// };
const updateDoctorWardRecordById = (query, reqbody) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield doctor_ward_round_1.default.findOneAndUpdate(query, reqbody, {
        new: true
    });
    return doc;
});
exports.updateDoctorWardRecordById = updateDoctorWardRecordById;
