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
exports.updatefillpreoperativeprevisitform = exports.readpreoperativeprevisitformbytheatreadmission = exports.fillpreoperativeprevisitform = void 0;
const config_1 = __importDefault(require("../../config"));
const otherservices_1 = require("../../utils/otherservices");
const theatreadmission_1 = require("../../dao/theatreadmission");
const preoperativeprevisit_1 = require("../../dao/preoperativeprevisit");
const fillpreoperativeprevisitform = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { theatreadmission } = req.params;
        (0, otherservices_1.validateinputfaulsyvalue)({ theatreadmission });
        //theatre
        //validate theatre admission
        var findAdmission = yield (0, theatreadmission_1.readonethearteadmission)({ _id: theatreadmission }, {}, '');
        if (!findAdmission) {
            throw new Error(`Theatre Admission ${config_1.default.error.erroralreadyexit}`);
        }
        req.body.theatreadmission = theatreadmission;
        //const queryresult:any =await updatethearteadmission(id,{status});
        //create conscent
        const preoperativeprevisit = yield (0, preoperativeprevisit_1.createpreoperativeprevisit)(req.body);
        //update theatre admission
        const queryresult = yield (0, theatreadmission_1.updatethearteadmission)(theatreadmission, { preoperativeprevisit: preoperativeprevisit._id });
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.fillpreoperativeprevisitform = fillpreoperativeprevisitform;
//get lab order by patient
const readpreoperativeprevisitformbytheatreadmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { theatreadmission } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, preoperativeprevisit_1.readonepreoperativeprevisit)({ theatreadmission }, {}, '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readpreoperativeprevisitformbytheatreadmission = readpreoperativeprevisitformbytheatreadmission;
const updatefillpreoperativeprevisitform = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const { nameofexplainer,nameofrepresentive,conscentdate} = req.body;
        const { id } = req.params;
        //validateinputfaulsyvalue({id,nameofexplainer,nameofrepresentive,conscentdate});
        //theatre
        //const filename = await uploadbase64image(imageBase64);
        //validate theatre admission
        var findAdmission = yield (0, preoperativeprevisit_1.readonepreoperativeprevisit)({ _id: id }, {}, '');
        if (!findAdmission) {
            throw new Error(`Preoperative previsit Form ${config_1.default.error.erroralreadyexit}`);
        }
        //const queryresult:any =await updatethearteadmission(id,{status});
        //create conscent
        const queryresult = yield (0, preoperativeprevisit_1.updatepreoperativeprevisit)(id, req.body);
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.updatefillpreoperativeprevisitform = updatefillpreoperativeprevisitform;
