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
exports.readallfoodgivens = readallfoodgivens;
exports.createfoodgiven = createfoodgiven;
exports.readonefoodgiven = readonefoodgiven;
exports.updatefoodgiven = updatefoodgiven;
exports.updatefoodgivenquery = updatefoodgivenquery;
const foodgiven_1 = __importDefault(require("../models/foodgiven"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallfoodgivens(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const foodgivendetails = yield foodgiven_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totalfoodgivendetails = yield foodgiven_1.default.find(query).countDocuments();
            return { foodgivendetails, totalfoodgivendetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createfoodgiven(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const foodgiven = new foodgiven_1.default(input);
            return yield foodgiven.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonefoodgiven(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield foodgiven_1.default.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updatefoodgiven(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const foodgiven = yield foodgiven_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!foodgiven) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return foodgiven;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatefoodgivenquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const foodgiven = yield foodgiven_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!foodgiven) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return foodgiven;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
