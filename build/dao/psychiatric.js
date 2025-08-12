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
exports.readAllPsychiatricEvaluations = readAllPsychiatricEvaluations;
exports.createPsychiatricEvaluation = createPsychiatricEvaluation;
exports.readOnePsychiatricEvaluation = readOnePsychiatricEvaluation;
exports.updatePsychiatricEvaluationById = updatePsychiatricEvaluationById;
exports.updatePsychiatricEvaluationByQuery = updatePsychiatricEvaluationByQuery;
const psychiatric_1 = __importDefault(require("../models/psychiatric"));
const config_1 = __importDefault(require("../config"));
// 🔍 Read all psychiatric evaluations
function readAllPsychiatricEvaluations(query_1, selectquery_1, populatequery_1, populatesecondquery_1) {
    return __awaiter(this, arguments, void 0, function* (query, selectquery, populatequery, populatesecondquery, skip = 0, limit = 150) {
        try {
            const evaluations = yield psychiatric_1.default.find(query)
                .select(selectquery)
                .populate(populatequery)
                .populate(populatesecondquery)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            ;
            const total = yield psychiatric_1.default.countDocuments(query);
            return { evaluations, total };
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
// ➕ Create psychiatric evaluation
function createPsychiatricEvaluation(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newEvaluation = new psychiatric_1.default(input);
            return yield newEvaluation.save();
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
// 🔍 Read one psychiatric evaluation
function readOnePsychiatricEvaluation(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield psychiatric_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
// 🔄 Update evaluation by ID
function updatePsychiatricEvaluationById(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield psychiatric_1.default.findOneAndUpdate({ _id: id }, reqbody, { new: true });
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
// 🔄 Update evaluation by query
function updatePsychiatricEvaluationByQuery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield psychiatric_1.default.findOneAndUpdate(query, reqbody, { new: true });
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
