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
exports.updateuseranyparam = updateuseranyparam;
const users_1 = __importDefault(require("../models/users"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config"));
//read all payment history
function readall(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userdetails = yield users_1.default.find(query);
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
                //generate a salt
                const salt = yield bcryptjs_1.default.genSalt(10);
                //generate password hash
                const passwordHash = yield bcryptjs_1.default.hash(reqbody.password, salt);
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
function updateuseranyparam(query, update) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield users_1.default.findOneAndUpdate(query, update, {
                new: true
            });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
