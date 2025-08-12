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
exports.readAllDentalEncounters = readAllDentalEncounters;
exports.createDentalEncounter = createDentalEncounter;
exports.readOneDentalEncounter = readOneDentalEncounter;
exports.updateDentalEncounterById = updateDentalEncounterById;
exports.updateDentalEncounterByQuery = updateDentalEncounterByQuery;
const dentalencounter_1 = __importDefault(require("../models/dentalencounter"));
const config_1 = __importDefault(require("../config"));
// 🔍 Read all dental encounters
function readAllDentalEncounters(query_1, selectquery_1, populatequery_1, populatesecondquery_1) {
    return __awaiter(this, arguments, void 0, function* (query, selectquery, populatequery, populatesecondquery, skip = 0, limit = 150) {
        try {
            const encounters = yield dentalencounter_1.default.find(query)
                .select(selectquery)
                .populate(populatequery)
                .populate(populatesecondquery)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = yield dentalencounter_1.default.countDocuments(query);
            return { encounters, total };
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
// ➕ Create a dental encounter
function createDentalEncounter(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newEncounter = new dentalencounter_1.default(input);
            return yield newEncounter.save();
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
// 🔍 Read one dental encounter
function readOneDentalEncounter(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield dentalencounter_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.error(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
// 🔄 Update dental encounter by ID
function updateDentalEncounterById(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield dentalencounter_1.default.findOneAndUpdate({ _id: id }, reqbody, { new: true });
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
// 🔄 Update dental encounter by query
function updateDentalEncounterByQuery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield dentalencounter_1.default.findOneAndUpdate(query, reqbody, {
                new: true,
            });
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
