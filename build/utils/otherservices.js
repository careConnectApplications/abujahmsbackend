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
exports.mail = exports.sendTokenResponse = exports.isValidPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
var isValidPassword = function (newPassword, currentpassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield bcryptjs_1.default.compare(newPassword, currentpassword);
        }
        catch (error) {
            console.log(error);
        }
    });
};
exports.isValidPassword = isValidPassword;
var sendTokenResponse = (user) => {
    const { firstName, lastName, role, staffId } = user;
    const token = jsonwebtoken_1.default.sign({ user: { firstName, lastName, role, staffId } }, process.env.KEYGEN, { expiresIn: "1d" });
    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    return { token, options };
};
exports.sendTokenResponse = sendTokenResponse;
var mail = function mail(to, subject, textmessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
                user: "malachi.egbugha3@gmail.com",
                pass: "Maeg/1987",
            },
            secure: true,
        });
        const mailData = {
            from: '"From HMSB" <noreply@hmsb.com>',
            to: `${to}`,
            subject: `${subject}`,
            text: `${textmessage}`,
        };
        let info = yield transporter.sendMail(mailData, function (err, info) {
            if (err)
                console.log(err);
            else
                console.log(info);
        });
    });
};
exports.mail = mail;
