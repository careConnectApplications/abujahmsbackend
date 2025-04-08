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
        type: String
    },
    staffId: {
        required: true,
        type: String,
    },
    roleId: {
        required: true,
        type: String,
    },
    firstName: {
        required: true,
        type: String,
    },
    middleName: {
        type: String,
    },
    lastName: {
        required: true,
        type: String,
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    age: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    gender: {
        required: true,
        type: String,
    },
    licence: {
        type: String
    },
    phoneNumber: {
        type: String
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
        type: String
    },
    profession: {
        type: String
    },
    employmentStatus: {
        type: String
    },
    nativeSpokenLanguage: {
        type: String
    },
    otherLanguage: {
        type: String
    },
    readWriteLanguage: {
        type: String
    },
    clinic: {
        required: true,
        type: String,
    },
    zip: {
        type: String
    },
    specializationDetails: {
        type: String
    },
    password: {
        required: [true, "Password is required"],
        type: String,
    },
    status: {
        required: true,
        type: String,
        default: config_1.default.status[1],
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
