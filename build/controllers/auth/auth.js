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
//sign in
var signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //destructure email and password
        const { email, password } = req.body;
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
        if (user.status === config_1.default.userstatus[0]) {
            throw new Error(config_1.default.error.errordeactivate);
        }
        //check if password match
        const isMatch = yield (0, otherservices_1.isValidPassword)(password, user.password);
        if (!isMatch) {
            throw new Error(config_1.default.error.errorpasswordmismatch);
        }
        //respond with token
        var queryresult = (0, otherservices_1.sendTokenResponse)(user);
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.signin = signin;
//signup users 
var signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get token from header
        const { email } = req.body;
        const foundUser = yield (0, users_1.readone)({ email });
        if (foundUser) {
            throw new Error(config_1.default.error.erroralreadyexit);
        }
        req.body.password = config_1.default.defaultPassword;
        //other validations
        const queryresult = yield (0, users_1.createuser)(req.body);
        const message = `Your account creation on Gotruck APP is successful. \n Login Email: ${email} \n Portal Link: https://google.com/ \n Default-Password: truck \n Please Login and change your Password`;
        yield (0, otherservices_1.mail)(email, "Account Registration Confrimation", message);
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.signup = signup;
//settings
function settings(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.status(200).json(Object.assign(Object.assign({}, config_1.default.settings), { status: true }));
        }
        catch (e) {
            res.json({ status: false, msg: e.message });
        }
    });
}
