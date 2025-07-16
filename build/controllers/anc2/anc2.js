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
exports.createancsv2 = exports.readAllancByPatientv2 = exports.createancfollowupsv2 = exports.readAllancfollowupByAncv2 = void 0;
exports.updateancfollowupsv2 = updateancfollowupsv2;
exports.updateancsv2 = updateancsv2;
const anc2_1 = require("../../dao/anc2");
const ancfollowup_1 = require("../../dao/ancfollowup");
const otherservices_1 = require("../../utils/otherservices");
const patientmanagement_1 = require("../../dao/patientmanagement");
const config_1 = __importDefault(require("../../config"));
//get lab order by patient
///////////////////////////anc followup/////////////////////////
const readAllancfollowupByAncv2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { anc } = req.params;
        const queryresult = yield (0, ancfollowup_1.readallancfollowup)({ anc }, {}, '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllancfollowupByAncv2 = readAllancfollowupByAncv2;
const createancfollowupsv2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { anc } = req.params;
        console.log('anc', anc);
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        var { ga, sfh, wt, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ ga, sfh, wt, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname });
        //frequency must inlcude
        //route must contain allowed options
        const ancrecord = yield (0, anc2_1.readoneanc)({ _id: anc }, {}, '');
        //console.log(admissionrecord);   
        if (!ancrecord) {
            throw new Error(`ANC donot ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, ancfollowup_1.createancfollowup)({ anc: ancrecord._id, ga, sfh, wt, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createancfollowupsv2 = createancfollowupsv2;
//insulin
function updateancfollowupsv2(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { ga, sfh, wt, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ ga, sfh, wt, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname });
            var queryresult = yield (0, ancfollowup_1.updateancfollowup)(id, { ga, sfh, wt, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname });
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
////////////////////////////////anc////////////////////////////
const readAllancByPatientv2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { patient } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, anc2_1.readallanc)({ patient }, {}, 'patient');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllancByPatientv2 = readAllancByPatientv2;
const createancsv2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName } = (req.user).user;
        const staffname = `${firstName} ${lastName}`;
        const { presentingcomplaints, historyofpresentingcomplaints, historyofindexpregnancy, gynaehistory, passsurgicalhistory, drughistory, familyandsocialhistory, systematicreview, generalmedicalhistory } = req.body;
        const { bookingstatus, lmp, edd, gravidity, ega, lcb } = req.body;
        const reproductiveprofile = { bookingstatus, lmp, edd, gravidity, ega, lcb };
        const { pastobstetrichistory } = req.body;
        //frequency must inlcude
        //route must contain allowed options
        const patientrecord = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, '', '');
        //console.log(admissionrecord);   
        if (!patientrecord) {
            throw new Error(`Patient donot ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, anc2_1.createanc)({ patient: patientrecord._id, generalmedicalhistory, reproductiveprofile, pastobstetrichistory, presentingcomplaints, historyofpresentingcomplaints, historyofindexpregnancy, gynaehistory, passsurgicalhistory, drughistory, familyandsocialhistory, systematicreview, staffname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createancsv2 = createancsv2;
function updateancsv2(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            const staffname = `${firstName} ${lastName}`;
            const { presentingcomplaints, historyofpresentingcomplaints, historyofindexpregnancy, gynaehistory, passsurgicalhistory, drughistory, familyandsocialhistory, systematicreview } = req.body;
            const { bookingstatus, lmp, edd, gravidity, ega, lcb } = req.body;
            const reproductiveprofile = { bookingstatus, lmp, edd, gravidity, ega, lcb };
            const { pastobstetrichistory } = req.body;
            //validateinputfaulsyvalue({...vitals});
            var queryresult = yield (0, anc2_1.updateanc)(id, { reproductiveprofile, pastobstetrichistory, presentingcomplaints, historyofpresentingcomplaints, historyofindexpregnancy, gynaehistory, passsurgicalhistory, drughistory, familyandsocialhistory, systematicreview, staffname });
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
