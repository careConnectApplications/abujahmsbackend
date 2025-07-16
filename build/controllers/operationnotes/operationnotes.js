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
exports.updatefilloperationnote = exports.readoperationnotebytheatreadmission = exports.filloperationnote = void 0;
const config_1 = __importDefault(require("../../config"));
const otherservices_1 = require("../../utils/otherservices");
const theatreadmission_1 = require("../../dao/theatreadmission");
const operationnotes_1 = require("../../dao/operationnotes");
const filloperationnote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { theatreadmission } = req.params;
        const { diagnosispreop, diagnosisoperative, operative, surgeon, assistants, preoperativenurse, anestheticnurse, typeofanesthetic, findings } = req.body;
        const { firstName, lastName } = (req.user).user;
        var filledby = `${firstName} ${lastName}`;
        (0, otherservices_1.validateinputfaulsyvalue)({ theatreadmission, diagnosispreop, diagnosisoperative, operative, surgeon, assistants, preoperativenurse, anestheticnurse, typeofanesthetic, findings });
        //theatre
        //validate theatre admission
        var findAdmission = yield (0, theatreadmission_1.readonethearteadmission)({ _id: theatreadmission }, {}, '');
        if (!findAdmission) {
            throw new Error(`Theatre Admission donot ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, operationnotes_1.createoperationnote)({ theatreadmission, diagnosispreop, diagnosisoperative, operative, surgeon, assistants, preoperativenurse, anestheticnurse, typeofanesthetic, findings, filledby });
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.filloperationnote = filloperationnote;
//get lab order by patient
const readoperationnotebytheatreadmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { theatreadmission } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, operationnotes_1.readoneoperationnote)({ theatreadmission }, {}, '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readoperationnotebytheatreadmission = readoperationnotebytheatreadmission;
const updatefilloperationnote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { diagnosispreop, diagnosisoperative, operative, surgeon, assistants, preoperativenurse, anestheticnurse, typeofanesthetic, findings } = req.body;
        const { firstName, lastName } = (req.user).user;
        var filledby = `${firstName} ${lastName}`;
        (0, otherservices_1.validateinputfaulsyvalue)({ diagnosispreop, diagnosisoperative, operative, surgeon, assistants, preoperativenurse, anestheticnurse, typeofanesthetic, findings });
        var findoperationnote = yield (0, operationnotes_1.readoneoperationnote)({ _id: id }, {}, '');
        if (!findoperationnote) {
            throw new Error(`Operation Note ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, operationnotes_1.updateoperationnote)(id, { diagnosispreop, diagnosisoperative, operative, surgeon, assistants, preoperativenurse, anestheticnurse, typeofanesthetic, findings, filledby });
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.updatefilloperationnote = updatefilloperationnote;
