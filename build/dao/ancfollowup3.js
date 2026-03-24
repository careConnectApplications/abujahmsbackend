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
exports.readallancfollowup = readallancfollowup;
exports.createancfollowup = createancfollowup;
exports.readoneancfollowup = readoneancfollowup;
exports.updateancfollowup = updateancfollowup;
exports.updateancfollowupquery = updateancfollowupquery;
const ancfollowup3_1 = __importDefault(require("../models/ancfollowup3"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallancfollowup(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ancfollowupdetails = yield ancfollowup3_1.default.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
            const totalancfollowupdetails = yield ancfollowup3_1.default.find(query).countDocuments();
            return { ancfollowupdetails, totalancfollowupdetails };
        }
        catch (err) {
            console.log(err);
<<<<<<< HEAD
            throw new Error("Failed to retrieve ANC follow-up data");
=======
            throw new Error(config_1.default.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
        }
    });
}
;
function createancfollowup(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const ancfollowup = new ancfollowup3_1.default(input);
            return yield ancfollowup.save();
        }
        catch (err) {
            console.log(err);
<<<<<<< HEAD
            throw new Error("Failed to create ANC follow-up");
=======
            throw new Error(config_1.default.error.errorusercreate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
        }
    });
}
//find one
function readoneancfollowup(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield ancfollowup3_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
<<<<<<< HEAD
            throw new Error("Failed to retrieve ANC follow-up data");
=======
            throw new Error(config_1.default.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
        }
    });
}
function updateancfollowup(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ancfollowup = yield ancfollowup3_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!ancfollowup) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return ancfollowup;
        }
        catch (err) {
            console.log(err);
<<<<<<< HEAD
            throw new Error("Failed to update ANC follow-up");
=======
            throw new Error(config_1.default.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
        }
    });
}
//update  appointment by query
function updateancfollowupquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ancfollowup = yield ancfollowup3_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!ancfollowup) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return ancfollowup;
        }
        catch (err) {
            console.log(err);
<<<<<<< HEAD
            throw new Error("Failed to update ANC follow-up");
=======
            throw new Error(config_1.default.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
        }
    });
}
