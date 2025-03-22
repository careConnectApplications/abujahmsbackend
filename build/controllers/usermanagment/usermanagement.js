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
exports.getallusers = getallusers;
exports.updatepassword = updatepassword;
exports.passwordreset = passwordreset;
exports.updatestatus = updatestatus;
exports.updateusers = updateusers;
exports.bulkuploadusers = bulkuploadusers;
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_1 = require("../../dao/users");
const otherservices_1 = require("../../utils/otherservices");
//get all users
function getallusers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, users_1.readall)({});
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//update a user password
function updatepassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            var { currentpassword, newpassword } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ currentpassword, newpassword });
            //read user 
            var user = yield (0, users_1.readone)({ _id: id });
            const { password } = user;
            const isMatch = yield bcryptjs_1.default.compare(currentpassword, password);
            if (!isMatch) {
                //return error
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            //change password
            var queryresult = yield (0, users_1.updateuser)(id, { password: newpassword });
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
function passwordreset(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const queryresult = yield (0, users_1.updateuser)(id, { password: config_1.default.defaultPassword });
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//deactivate a user
function updatestatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const response = yield (0, users_1.readone)({ _id: id });
            const status = (response === null || response === void 0 ? void 0 : response.status) == config_1.default.status[0] ? config_1.default.status[1] : config_1.default.status[0];
            const queryresult = yield (0, users_1.updateuser)(id, { status });
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//update a user
function updateusers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            var queryresult = yield (0, users_1.updateuser)(id, req.body);
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//bulk upload users
function bulkuploadusers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = req.files.file;
            const filename = config_1.default.useruploadfilename;
            let allowedextension = ['.csv', '.xlsx'];
            let uploadpath = `${process.cwd()}/${config_1.default.useruploaddirectory}`;
            var columnmapping = {
                A: "title",
                B: "staffId",
                C: "firstName",
                D: "middleName",
                E: "lastName",
                F: "country",
                G: "state",
                H: "city",
                I: "address",
                J: "age",
                K: "dateOfBirth",
                L: "gender",
                M: "licence",
                N: "phoneNumber",
                O: "email",
                P: "role",
                Q: "degree",
                R: "profession",
                S: "employmentStatus",
                T: "nativeSpokenLanguage",
                U: "otherLanguage",
                V: "readWriteLanguage",
                W: "clinic",
                X: "zip",
                Y: "specializationDetails",
            };
            yield (0, otherservices_1.uploaddocument)(file, filename, allowedextension, uploadpath);
            //convert uploaded excel to json
            var convert_to_json = (0, otherservices_1.convertexceltojson)(`${uploadpath}/${filename}${path_1.default.extname(file.name)}`, config_1.default.usertemplate, columnmapping);
            //save to database
            var { userslist } = convert_to_json;
            if (userslist.length > 0) {
                for (var i = 0; i < userslist.length; i++) {
                    const { email, firstName, title, staffId, lastName, country, state, city, address, age, dateOfBirth, gender, licence, phoneNumber, role, degree, profession, employmentStatus, nativeSpokenLanguage, otherLanguage, readWriteLanguage, clinic, zip, specializationDetails } = userslist[i];
                    (0, otherservices_1.validateinputfaulsyvalue)({ email, firstName, title, staffId, lastName, country, state, city, address, age, dateOfBirth, gender, licence, phoneNumber, role, degree, profession, employmentStatus, nativeSpokenLanguage, otherLanguage, readWriteLanguage, clinic, zip, specializationDetails });
                    const foundUser = yield (0, users_1.readone)({ email });
                    if (foundUser) {
                        throw new Error(`${email} ${config_1.default.error.erroralreadyexit}`);
                    }
                    userslist[i].password = config_1.default.defaultPassword;
                    //other validations
                    yield (0, users_1.createuser)(userslist[i]);
                }
            }
            res.status(200).json({ status: true, queryresult: 'Bulk upload was successfull' });
        }
        catch (e) {
            //logger.error(e.message);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
