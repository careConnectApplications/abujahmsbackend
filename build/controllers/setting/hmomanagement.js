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
exports.createhmo = void 0;
exports.getallhmo = getallhmo;
exports.updatehmo = updatehmo;
const config_1 = __importDefault(require("../../config"));
const hmomanagement_1 = require("../../dao/hmomanagement");
const otherservices_1 = require("../../utils/otherservices");
const audit_1 = require("../../dao/audit");
//add patiient
var createhmo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { hmoname } = req.body;
        const { firstName, lastName } = (req.user).user;
        var actor = `${firstName} ${lastName}`;
        (0, otherservices_1.validateinputfaulsyvalue)({ hmoname });
        var id = `${hmoname[0]}${(0, otherservices_1.generateRandomNumber)(5)}${hmoname[hmoname.length - 1]}`;
        const foundHmo = yield (0, hmomanagement_1.readonehmomanagement)({ hmoname }, '');
        //update servicetype for New Patient Registration
        if (foundHmo) {
            throw new Error(`HMO ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, hmomanagement_1.createhmomanagement)({ hmoname, id });
        yield (0, audit_1.createaudit)({ action: "Create HMO", actor, affectedentity: hmoname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.createhmo = createhmo;
//read all patients
function getallhmo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, hmomanagement_1.readallhmomanagement)({}, '');
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
//update a price
function updatehmo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { hmoname } = req.body;
            const { firstName, lastName } = (req.user).user;
            var actor = `${firstName} ${lastName}`;
            (0, otherservices_1.validateinputfaulsyvalue)({ hmoname, id });
            yield (0, audit_1.createaudit)({ action: "Update HMO", actor, affectedentity: hmoname });
            var queryresult = yield (0, hmomanagement_1.updatehmomanagement)(id, { hmoname });
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
