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
exports.signup = exports.signin = void 0;
exports.settings = settings;
const config_1 = __importDefault(require("../../config"));
const users_1 = require("../../dao/users");
const otherservices_1 = require("../../utils/otherservices");
const roles_1 = require("../../dao/roles");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const errors_1 = require("../../errors");
//sign in
var signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //destructure email and password
        const { email, password } = req.body;
        var requirepasswordchange;
        if (password == config_1.default.defaultPassword) {
            requirepasswordchange = true;
        }
        else {
            requirepasswordchange = false;
        }
        //validate email and password
        if (!email || !password) {
            throw new Error(config_1.default.error.errornoemailpassword);
        }
        //find user
        const user = yield (0, users_1.readone)({ email });
        //check if user exit
        if (!user) {
            throw new Error(config_1.default.error.errorinvaliduser);
        }
        //chek if user is active
        if (user.status === config_1.default.status[0]) {
            throw new Error(config_1.default.error.errordeactivate);
        }
        //check if password match
        const isMatch = yield (0, otherservices_1.isValidPassword)(password, user.password);
        if (!isMatch) {
            throw new Error(config_1.default.error.errorpasswordmismatch);
        }
        //respond with token
        var queryresult = (0, otherservices_1.sendTokenResponse)(user);
        res.status(200).json({ queryresult, status: true, requirepasswordchange });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.signin = signin;
//signup users 
exports.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //get token from header
    const { email, firstName, title, staffId, lastName, country, state, city, address, age, dateOfBirth, gender, licence, phoneNumber, role, degree, profession, employmentStatus, nativeSpokenLanguage, otherLanguage, readWriteLanguage, clinic, zip, specializationDetails } = req.body;
    //get role id
    var roleId = (config_1.default.roles).filter((e) => e.role == role)[0].roleId;
    req.body.roleId = roleId;
    (0, otherservices_1.validateinputfaulsyvalue)({ email, firstName, phoneNumber, lastName, gender, role, clinic });
    const foundUser = yield (0, users_1.readone)({ $or: [{ email }, { phoneNumber }] });
    if (foundUser) {
        return next(new errors_1.ApiError(401, `User with this email or phonenumber  ${config_1.default.error.erroralreadyexit}`));
    }
    if (!(0, otherservices_1.isValidPhoneNumber)(phoneNumber)) {
        return next(new errors_1.ApiError(409, config_1.default.error.errorNotValidPhoneNumber));
    }
    req.body.password = config_1.default.defaultPassword;
    //get user permissions
    const permissions = ((_a = (0, roles_1.getRolesById)(+roleId)) === null || _a === void 0 ? void 0 : _a.defaultPermissions) || [];
    req.body.specialPermissions = permissions;
    //other validations
    const queryresult = yield (0, users_1.createuser)(req.body);
    if (!queryresult) {
        return next(new errors_1.ApiError(403, 'operation failed!'));
    }
    //const message = `Your account creation on Gotruck APP is successful. \n Login Email: ${email} \n Portal Link: https://google.com/ \n Default-Password: truck \n Please Login and change your Password`;
    //await mail(email, "Account Registration Confrimation", message);
    res.status(200).json({ queryresult, status: true });
}));
//settings
function settings(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //const {clinicdetails} = await readallclinics({},{"clinic":1, "id":1,"_id":0});
            //console.log("clinic", clinicdetails);
            var settings = yield config_1.default.settings();
            console.log(settings);
            res.status(200).json(Object.assign(Object.assign({}, settings), { status: true }));
        }
        catch (e) {
            res.json({ status: false, msg: e.message });
        }
    });
}
