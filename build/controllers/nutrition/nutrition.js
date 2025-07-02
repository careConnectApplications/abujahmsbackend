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
exports.createnutritions = exports.readAllnutritionByPatient = void 0;
exports.updatenutritions = updatenutritions;
const nutrition_1 = require("../../dao/nutrition");
const patientmanagement_1 = require("../../dao/patientmanagement");
const otherservices_1 = require("../../utils/otherservices");
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const config_1 = __importDefault(require("../../config"));
const readAllnutritionByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { patient } = req.params;
        const queryresult = yield (0, nutrition_1.readallnutrition)({ patient }, {}, 'patient');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllnutritionByPatient = readAllnutritionByPatient;
const createnutritions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log('id', id);
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        var { date, ageinmonths, typeofvisit, infactandyoungchildfeeding, complementaryfeeding, counsellingprovided, referedtosupportgroup, anthropometryheight, anthropometryweight, anthropometrybilateraloedema, muacred, muacyellow, muacgreen, growthaccordingtothechildhealthcard, vitaminasupplement, deworming, staffname } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ date, ageinmonths, typeofvisit, infactandyoungchildfeeding, complementaryfeeding, counsellingprovided, referedtosupportgroup, anthropometryheight, anthropometryweight, anthropometrybilateraloedema, muacred, muacyellow, muacgreen, growthaccordingtothechildhealthcard, vitaminasupplement, deworming, staffname });
        const patientrecord = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, '', '');
        //console.log(admissionrecord);   
        if (!patientrecord) {
            throw new Error(`Patient donot ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, nutrition_1.createnutrition)({ patient: patientrecord._id, date, ageinmonths, typeofvisit, infactandyoungchildfeeding, complementaryfeeding, counsellingprovided, referedtosupportgroup, anthropometryheight, anthropometryweight, anthropometrybilateraloedema, muacred, muacyellow, muacgreen, growthaccordingtothechildhealthcard, vitaminasupplement, deworming, staffname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createnutritions = createnutritions;
//insulin
function updatenutritions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { date, ageinmonths, typeofvisit, infactandyoungchildfeeding, complementaryfeeding, counsellingprovided, referedtosupportgroup, anthropometryheight, anthropometryweight, anthropometrybilateraloedema, muacred, muacyellow, muacgreen, growthaccordingtothechildhealthcard, vitaminasupplement, deworming, staffname } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ date, ageinmonths, typeofvisit, infactandyoungchildfeeding, complementaryfeeding, counsellingprovided, referedtosupportgroup, anthropometryheight, anthropometryweight, anthropometrybilateraloedema, muacred, muacyellow, muacgreen, growthaccordingtothechildhealthcard, vitaminasupplement, deworming, staffname });
            var queryresult = yield (0, nutrition_1.updatenutrition)(id, { date, ageinmonths, typeofvisit, infactandyoungchildfeeding, complementaryfeeding, counsellingprovided, referedtosupportgroup, anthropometryheight, anthropometryweight, anthropometrybilateraloedema, muacred, muacyellow, muacgreen, growthaccordingtothechildhealthcard, vitaminasupplement, deworming, staffname });
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
