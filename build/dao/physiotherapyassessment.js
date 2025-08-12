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
exports.readAllPhysiotherapyAssessments = readAllPhysiotherapyAssessments;
exports.createPhysiotherapyAssessment = createPhysiotherapyAssessment;
exports.readOnePhysiotherapyAssessment = readOnePhysiotherapyAssessment;
exports.updatePhysiotherapyAssessmentById = updatePhysiotherapyAssessmentById;
exports.updatePhysiotherapyAssessmentByQuery = updatePhysiotherapyAssessmentByQuery;
const physiotherapyassessment_1 = __importDefault(require("../models/physiotherapyassessment"));
const config_1 = __importDefault(require("../config"));
// 🔍 Read all physiotherapy assessments
function readAllPhysiotherapyAssessments() {
    return __awaiter(this, arguments, void 0, function* (query = {}, selectquery = {}, populatequery = "", populatesecondquery = "", skip = 0, limit = 150) {
        try {
            const assessments = yield physiotherapyassessment_1.default.find(query)
                .select(selectquery)
                .populate(populatequery)
                .populate(populatesecondquery)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = yield physiotherapyassessment_1.default.countDocuments(query);
            return { assessments, total };
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
// ➕ Create a physiotherapy assessment
function createPhysiotherapyAssessment(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newAssessment = new physiotherapyassessment_1.default(input);
            return yield newAssessment.save();
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
// 🔍 Read one physiotherapy assessment
function readOnePhysiotherapyAssessment(query_1) {
    return __awaiter(this, arguments, void 0, function* (query, selectquery = {}) {
        try {
            return yield physiotherapyassessment_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
// 🔄 Update assessment by ID
function updatePhysiotherapyAssessmentById(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield physiotherapyassessment_1.default.findOneAndUpdate({ _id: id }, reqbody, { new: true });
            if (!updated) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return updated;
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
// 🔄 Update assessment by query
function updatePhysiotherapyAssessmentByQuery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield physiotherapyassessment_1.default.findOneAndUpdate(query, reqbody, { new: true });
            if (!updated) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return updated;
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
