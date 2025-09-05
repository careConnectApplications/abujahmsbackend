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
exports.readallunits = readallunits;
exports.createunit = createunit;
exports.readoneunit = readoneunit;
exports.readunitsbyclinic = readunitsbyclinic;
exports.updateunit = updateunit;
exports.updateunitbyquery = updateunitbyquery;
const units_1 = __importDefault(require("../models/units"));
const config_1 = __importDefault(require("../config"));
// read all units
function readallunits(query, selectquery, populatesecondquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const unitdetails = yield units_1.default.find(query).select(selectquery).populate(populatesecondquery).sort({ createdAt: -1 });
            const totalunitdetails = yield units_1.default.find(query).countDocuments();
            return { unitdetails, totalunitdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to retrieve unit data");
        }
    });
}
;
// create unit
function createunit(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('//////////', input);
            const unit = new units_1.default(input);
            return yield unit.save();
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to create unit");
        }
    });
}
// find one unit
function readoneunit(query, selectquery, populatesecondquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield units_1.default.findOne(query).select(selectquery).populate(populatesecondquery);
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to retrieve unit data");
        }
    });
}
// read units by clinic
function readunitsbyclinic(clinicId, selectquery, populatesecondquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const unitdetails = yield units_1.default.find({ clinicId }).select(selectquery).populate(populatesecondquery).sort({ createdAt: -1 });
            const totalunitdetails = yield units_1.default.find({ clinicId }).countDocuments();
            return { unitdetails, totalunitdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to retrieve units by clinic");
        }
    });
}
// update unit by id
function updateunit(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const unit = yield units_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!unit) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return unit;
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to update unit");
        }
    });
}
// update unit by query
function updateunitbyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const unit = yield units_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!unit) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return unit;
        }
        catch (err) {
            console.log(err);
            throw new Error("Failed to update unit");
        }
    });
}
