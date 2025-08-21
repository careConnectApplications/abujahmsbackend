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
exports.readallhmocategorycover = readallhmocategorycover;
exports.createhmocategorycover = createhmocategorycover;
exports.readonehmocategorycover = readonehmocategorycover;
exports.updatehmocategorycover = updatehmocategorycover;
exports.updatehmocategorycoverbyquery = updatehmocategorycoverbyquery;
const hmocategorycover_1 = __importDefault(require("../models/hmocategorycover"));
const config_1 = __importDefault(require("../config"));
// Read all HMO Category Covers
function readallhmocategorycover(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hmocategorycoverdetails = yield hmocategorycover_1.default.find(query)
                .select(selectquery)
                .populate("hmoId")
                .sort({ createdAt: -1 });
            const totalhmocategorycoverdetails = yield hmocategorycover_1.default.find(query).countDocuments();
            return { hmocategorycoverdetails, totalhmocategorycoverdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
// Create new HMO Category Cover
function createhmocategorycover(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hmocategorycover = new hmocategorycover_1.default(input);
            return yield hmocategorycover.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
// Find one HMO Category Cover
function readonehmocategorycover(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield hmocategorycover_1.default.findOne(query).select(selectquery).populate("hmoId");
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
// Update by ID
function updatehmocategorycover(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hmocategorycover = yield hmocategorycover_1.default.findOneAndUpdate({ _id: id }, reqbody, { new: true });
            if (!hmocategorycover) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return hmocategorycover;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
// Update by query
function updatehmocategorycoverbyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hmocategorycover = yield hmocategorycover_1.default.findOneAndUpdate(query, reqbody, { new: true });
            if (!hmocategorycover) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return hmocategorycover;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
