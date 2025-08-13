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
exports.createbed = createbed;
exports.readallbeds = readallbeds;
exports.readonebed = readonebed;
exports.updatebed = updatebed;
exports.updatebedbyquery = updatebedbyquery;
const beds_1 = __importDefault(require("../models/beds"));
const config_1 = __importDefault(require("../config"));
// Create a bed
function createbed(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bed = new beds_1.default(input);
            return yield bed.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
// Read all beds
function readallbeds(query, selectquery, populate) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bedDetails = yield beds_1.default.find(query).select(selectquery).populate(populate).sort({ createdAt: -1 });
            const totalBeds = yield beds_1.default.countDocuments(query);
            return { bedDetails, totalBeds };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
// Read one bed
function readonebed(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield beds_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
// Update bed by ID
function updatebed(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bed = yield beds_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!bed) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return bed;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
// Update bed by query
function updatebedbyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bed = yield beds_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!bed) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return bed;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
