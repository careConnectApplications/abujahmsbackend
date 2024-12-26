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
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//create schema
const userSchema = new mongoose_1.Schema({
    title: {
        required: true,
        type: String,
    },
    staffId: {
        required: true,
        type: String,
    },
    firstName: {
        required: true,
        type: String,
    },
    middleName: {
        required: true,
        type: String,
    },
    lastName: {
        required: true,
        type: String,
    },
    country: {
        required: true,
        type: String,
    },
    state: {
        required: true,
        type: String,
    },
    city: {
        required: true,
        type: String,
    },
    address: {
        required: true,
        type: String,
    },
    age: {
        required: true,
        type: String,
    },
    dateOfBirth: {
        required: true,
        type: String,
    },
    gender: {
        required: true,
        type: String,
    },
    licence: {
        required: true,
        type: String,
    },
    phoneNumber: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    role: {
        required: true,
        type: String,
    },
    degree: {
        required: true,
        type: String,
    },
    profession: {
        required: true,
        type: String,
    },
    employmentStatus: {
        required: true,
        type: String,
    },
    nativeSpokenLanguage: {
        required: true,
        type: String,
    },
    otherLanguage: {
        required: true,
        type: String,
    },
    readWriteLanguage: {
        required: true,
        type: String,
    },
    zip: {
        required: true,
        type: String,
    },
    specializationDetails: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    status: {
        required: true,
        type: String,
        default: config_1.default.userstatus[1],
    }
}, { timestamps: true });
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //GENERATE A SALT
            const salt = yield bcryptjs_1.default.genSalt(10);
            //generate password hash
            const passwordHash = yield bcryptjs_1.default.hash(this.password, salt);
            //re-assign hashed version of original
            this.password = passwordHash;
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
//create a model
const users = (0, mongoose_1.model)("Users", userSchema);
//export the model
exports.default = users;
