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
exports.updatepreanatheticsconscentform = exports.readpreanatheticsformbytheatreadmission = exports.fillpreanatheticsform = void 0;
const config_1 = __importDefault(require("../../config"));
const otherservices_1 = require("../../utils/otherservices");
const theatreadmission_1 = require("../../dao/theatreadmission");
const preanathetics_1 = require("../../dao/preanathetics");
const fillpreanatheticsform = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pastmedicalhistory, presentmedicalhistory, anaestheticmedicalhistory, drugshistory, dentalhistory, familyhistory, physicalexamination, airwayassessment, mouth, neck, throidmentaldish, malamphaticscore, plan, } = req.body;
        const { theatreadmission } = req.params;
        (0, otherservices_1.validateinputfaulsyvalue)({
            theatreadmission,
            pastmedicalhistory,
            presentmedicalhistory,
            anaestheticmedicalhistory,
            drugshistory,
            dentalhistory,
            familyhistory,
            physicalexamination,
            airwayassessment,
            mouth,
            neck,
            throidmentaldish,
            malamphaticscore,
            plan
        });
        //validate theatre admission
        var findAdmission = yield (0, theatreadmission_1.readonethearteadmission)({ _id: theatreadmission }, {}, '');
        if (!findAdmission) {
            throw new Error(`Theatre Admission ${config_1.default.error.erroralreadyexit}`);
        }
        //const queryresult:any =await updatethearteadmission(id,{status});
        //create conscent
        const preanathetics = yield (0, preanathetics_1.createpreanathetics)({ theatreadmission,
            pastmedicalhistory,
            presentmedicalhistory,
            anaestheticmedicalhistory,
            drugshistory,
            dentalhistory,
            familyhistory,
            physicalexamination,
            airwayassessment, mouth,
            neck,
            throidmentaldish,
            malamphaticscore,
            plan
        });
        //update theatre admission
        const queryresult = yield (0, theatreadmission_1.updatethearteadmission)(theatreadmission, { preanathetics: preanathetics._id });
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.fillpreanatheticsform = fillpreanatheticsform;
//get lab order by patient
const readpreanatheticsformbytheatreadmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { theatreadmission } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, preanathetics_1.readonepreanathetics)({ theatreadmission }, {}, '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readpreanatheticsformbytheatreadmission = readpreanatheticsformbytheatreadmission;
const updatepreanatheticsconscentform = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pastmedicalhistory, presentmedicalhistory, anaestheticmedicalhistory, drugshistory, dentalhistory, familyhistory, physicalexamination, airwayassessment, mouth, neck, throidmentaldish, malamphaticscore, plan, } = req.body;
        const { id } = req.params;
        (0, otherservices_1.validateinputfaulsyvalue)({ id, pastmedicalhistory,
            presentmedicalhistory,
            anaestheticmedicalhistory,
            drugshistory,
            dentalhistory,
            familyhistory,
            physicalexamination,
            airwayassessment,
            mouth,
            neck,
            throidmentaldish,
            malamphaticscore,
            plan });
        //theatre
        //const filename = await uploadbase64image(imageBase64);
        //validate theatre admission
        var findAdmission = yield (0, preanathetics_1.readonepreanathetics)({ _id: id }, {}, '');
        if (!findAdmission) {
            throw new Error(`Preanathetics Form ${config_1.default.error.erroralreadyexit}`);
        }
        //const queryresult:any =await updatethearteadmission(id,{status});
        //create conscent
        const queryresult = yield (0, preanathetics_1.updatepreanathetics)(id, {
            pastmedicalhistory,
            presentmedicalhistory,
            anaestheticmedicalhistory,
            drugshistory,
            dentalhistory,
            familyhistory,
            physicalexamination,
            airwayassessment,
            mouth,
            neck,
            throidmentaldish,
            malamphaticscore,
            plan
        });
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.updatepreanatheticsconscentform = updatepreanatheticsconscentform;
