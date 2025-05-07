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
exports.readallnutrition = readallnutrition;
exports.createnutrition = createnutrition;
exports.readonenutrition = readonenutrition;
exports.updatenutrition = updatenutrition;
exports.updatenutritionquery = updatenutritionquery;
const nutrition_1 = __importDefault(require("../models/nutrition"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallnutrition(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nutritiondetails = yield nutrition_1.default.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
            const totalnutritiondetails = yield nutrition_1.default.find(query).countDocuments();
            return { nutritiondetails, totalnutritiondetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createnutrition(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const nutrition = new nutrition_1.default(input);
            return yield nutrition.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonenutrition(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield nutrition_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
function updatenutrition(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nutrition = yield nutrition_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!nutrition) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return nutrition;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatenutritionquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nutrition = yield nutrition_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!nutrition) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return nutrition;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
