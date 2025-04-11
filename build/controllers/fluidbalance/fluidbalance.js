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
exports.createfluidbalance = exports.readAllfluidbalanceByPatient = exports.readallfluidbalanceByAdmission = void 0;
exports.updatefluidbalance = updatefluidbalance;
const fluidbalance_1 = require("../../dao/fluidbalance");
const admissions_1 = require("../../dao/admissions");
const otherservices_1 = require("../../utils/otherservices");
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const config_1 = __importDefault(require("../../config"));
// Get all lab records
const readallfluidbalanceByAdmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admission } = req.params;
        const queryresult = yield (0, fluidbalance_1.readallfluidbalances)({ admission }, {}, 'patient', 'admission');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readallfluidbalanceByAdmission = readallfluidbalanceByAdmission;
//get lab order by patient
const readAllfluidbalanceByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { patient } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, fluidbalance_1.readallfluidbalances)({ patient }, {}, 'patient', 'admission');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllfluidbalanceByPatient = readAllfluidbalanceByPatient;
//create vital charts
// Create a new schedule
const createfluidbalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        var { oralfluids, tubefeedingvolume, IVfluidtype, IVfluidvolume, IVfluidrate, medication, urineoutput, stoolfrequency, consistency, stoolamount, vomitamount, drainage, totalintake, totaloutput, netfliudbalancefor24hours, staffname } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ oralfluids, tubefeedingvolume, IVfluidtype, IVfluidvolume, IVfluidrate, medication, urineoutput, stoolfrequency, consistency, stoolamount, vomitamount, drainage, totalintake, totaloutput, netfliudbalancefor24hours, staffname });
        //frequency must inlcude
        //route must contain allowed options
        const admissionrecord = yield (0, admissions_1.readoneadmission)({ _id: id }, {}, '');
        //console.log(admissionrecord);   
        if (!admissionrecord) {
            throw new Error(`Admission donot ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, fluidbalance_1.createfluidbalances)({ referedward: admissionrecord.referedward, admission: admissionrecord._id, patient: admissionrecord.patient, oralfluids, tubefeedingvolume, IVfluidtype, IVfluidvolume, IVfluidrate, medication, urineoutput, stoolfrequency, consistency, stoolamount, vomitamount, drainage, totalintake, totaloutput, netfliudbalancefor24hours, staffname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createfluidbalance = createfluidbalance;
//insulin
function updatefluidbalance(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { oralfluids, tubefeedingvolume, IVfluidtype, IVfluidvolume, IVfluidrate, medication, urineoutput, stoolfrequency, consistency, stoolamount, vomitamount, drainage, totalintake, totaloutput, netfliudbalancefor24hours, staffname } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ oralfluids, tubefeedingvolume, IVfluidtype, IVfluidvolume, IVfluidrate, medication, urineoutput, stoolfrequency, consistency, stoolamount, vomitamount, drainage, totalintake, totaloutput, netfliudbalancefor24hours, staffname });
            var queryresult = yield (0, fluidbalance_1.updatefluidbalances)(id, { oralfluids, tubefeedingvolume, IVfluidtype, IVfluidvolume, IVfluidrate, medication, urineoutput, stoolfrequency, consistency, stoolamount, vomitamount, drainage, totalintake, totaloutput, netfliudbalancefor24hours, staffname });
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
