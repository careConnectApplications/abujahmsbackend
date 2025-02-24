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
exports.readall = readall;
exports.createuser = createuser;
exports.readone = readone;
exports.updateuser = updateuser;
exports.createmanyuser = createmanyuser;
const users_1 = __importDefault(require("../models/users"));
const otherservices_1 = require("../utils/otherservices");
const config_1 = __importDefault(require("../config"));
//read all payment history
function readall(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userdetails = yield users_1.default.find(query).select({ "_id": 1, "title": 1, "staffId": 1, "firstName": 1, "middleName": 1, "lastName": 1, "country": 1, "state": 1, "city": 1, "address": 1, "age": 1, "dateOfBirth": 1, "gender": 1, "licence": 1, "phoneNumber": 1, "email": 1, "role": 1, "degree": 1, "profession": 1, "employmentStatus": 1, "nativeSpokenLanguage": 1, "otherLanguage": 1, "readWriteLanguage": 1, "zip": 1, "specializationDetails": 1, "status": 1, "clinic": 1, "createdAt": 1 }).sort({ createdAt: -1 });
            const totaluserdetails = yield users_1.default.countDocuments();
            return { userdetails, totaluserdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createuser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = new users_1.default(input);
            return yield user.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readone(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield users_1.default.findOne(query);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update mobile users
function updateuser(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (reqbody.password) {
                const passwordHash = yield (0, otherservices_1.encrypt)(reqbody.password);
                //re-assign hasshed version of original
                reqbody.password = passwordHash;
            }
            const user = yield users_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!user) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return user;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//insert many
function createmanyuser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // this option prevents additional documents from being inserted if one fails
            const options = { ordered: true };
            return yield users_1.default.insertMany(input, options);
        }
        catch (err) {
            var message;
            if (err.name === "ValidationError") {
                message = Object.values(err.errors).map((value) => value.message);
            }
            else {
                message = config_1.default.error.errorusercreate;
            }
            throw new Error(message[0]);
        }
    });
}
