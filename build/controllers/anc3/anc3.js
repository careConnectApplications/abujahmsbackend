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
exports.createancsv3 = exports.readAllancByPatientv3 = exports.createancfollowupsv3 = exports.readAllancfollowupByAncv3 = exports.createAbujaAnc = void 0;
exports.updateancfollowupsv3 = updateancfollowupsv3;
exports.updateancsv3 = updateancsv3;
const anc3_1 = require("../../dao/anc3");
const ancfollowup3_1 = require("../../dao/ancfollowup3");
const otherservices_1 = require("../../utils/otherservices");
const patientmanagement_1 = require("../../dao/patientmanagement");
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const errors_1 = require("../../errors");
const mongoose_1 = __importDefault(require("mongoose"));
///////////////////////////Abuja Anc/////////////////////////
/**
 * Create new Abuja ANC
 * @param req
 * @param res
 * @param next
 */
exports.createAbujaAnc = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { lmp, edd, gravida, cycle, breasts, height, weight, cvs, rs, pelvis, abdomen, retroviral, bp, urine, hb, bloodGroup, groupRh, genotype, ega, VDRL, others, comments, bleeding, discharge, swellingAnkles, urinarySymptoms, bookingDate, indication, specialPoint, consultant, postmedicalorsurgicalhistory, previouspregnancy, historyofpresentpregnancy } = req.body;
    const { firstName, lastName, _id: userId } = (req.user).user;
    const staffname = `${firstName} ${lastName}`;
    if (!id)
        return next(new errors_1.ApiError(400, "Patient Id is not provided!"));
    const _patientId = new mongoose_1.default.Types.ObjectId(id);
    const patientrecord = yield (0, patientmanagement_1.readonepatient)({ _id: _patientId }, {}, '', '');
    if (!patientrecord)
        return next(new errors_1.ApiError(404, `Patient do not ${config_1.default.error.erroralreadyexit}`));
    const newAnc3 = {
        patient: _patientId,
        postmedicalorsurgicalhistory: postmedicalorsurgicalhistory || [],
        bookingInformation: {
            bookingDate: (0, otherservices_1.parseDate)(bookingDate),
            lmp: (0, otherservices_1.parseDate)(lmp),
            edd: (0, otherservices_1.parseDate)(edd),
            gravida,
            indication,
            specialPoint,
            consultant,
            ega
        },
        previouspregnancy: previouspregnancy || [],
        presentPregnancy: {
            bleeding,
            discharge,
            swellingAnkles,
            urinarySymptoms,
        },
        generalexamination: {
            cycle,
            breasts,
            height,
            weight,
            cvs,
            rs,
            pelvis,
            abdomen,
            retroviral,
            bp,
            urine,
            hb,
            bloodGroup,
            groupRh,
            genotype,
            VDRL,
            others,
            comments,
        },
        staffname,
        staffInfo: userId,
        historyofpresentpregnancy: historyofpresentpregnancy || []
    };
    const queryresult = yield (0, anc3_1.createanc)(newAnc3);
    res.status(201).json({
        status: true,
        message: "anc created successfully",
        data: queryresult
    });
}));
//get lab order by patient
///////////////////////////anc followup/////////////////////////
const readAllancfollowupByAncv3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { anc } = req.params;
        const queryresult = yield (0, ancfollowup3_1.readallancfollowup)({ anc }, {}, '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllancfollowupByAncv3 = readAllancfollowupByAncv3;
const createancfollowupsv3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { anc } = req.params;
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        var { heightoffundus, presentationandposition, presentingpart, foetalheight, bp, hb, protein, glucose, weight, oedema, tetanustoxoid, sulfadoxinepyrimethamine, albendazole, remark, staffname } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ heightoffundus, presentationandposition, presentingpart, foetalheight, bp, hb, protein, glucose, weight, oedema, tetanustoxoid, sulfadoxinepyrimethamine, albendazole, remark, staffname });
        //frequency must inlcude
        //route must contain allowed options
        const ancrecord = yield (0, anc3_1.readoneanc)({ _id: anc }, {}, '');
        //console.log(admissionrecord);   
        if (!ancrecord) {
            throw new Error(`ANC donot ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, ancfollowup3_1.createancfollowup)({ anc: ancrecord._id, heightoffundus, presentationandposition, presentingpart, foetalheight, bp, hb, protein, glucose, weight, oedema, tetanustoxoid, sulfadoxinepyrimethamine, albendazole, remark, staffname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createancfollowupsv3 = createancfollowupsv3;
function updateancfollowupsv3(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { heightoffundus, presentationandposition, presentingpart, foetalheight, bp, hb, protein, glucose, weight, oedema, tetanustoxoid, sulfadoxinepyrimethamine, albendazole, remark, staffname } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ heightoffundus, presentationandposition, presentingpart, foetalheight, bp, hb, protein, glucose, weight, oedema, tetanustoxoid, sulfadoxinepyrimethamine, albendazole, remark, staffname });
            var queryresult = yield (0, ancfollowup3_1.updateancfollowup)(id, { heightoffundus, presentationandposition, presentingpart, foetalheight, bp, hb, protein, glucose, weight, oedema, tetanustoxoid, sulfadoxinepyrimethamine, albendazole, remark, staffname });
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
const readAllancByPatientv3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { patient } = req.params;
        const queryresult = yield (0, anc3_1.readallanc)({ patient }, {}, 'patient');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllancByPatientv3 = readAllancByPatientv3;
const createancsv3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName } = (req.user).user;
        const staffname = `${firstName} ${lastName}`;
        const { postmedicalorsurgicalhistory, previouspregnancy, historyofpresentpregnancy } = req.body;
        const { lmp, edd, gravidity, breasts, height, cvs, rs, pelvis, abdomen } = req.body;
        const pregnancysummary = { lmp, edd, gravidity };
        const generalexamination = { breasts, height, cvs, rs, pelvis, abdomen };
        /////////// validation for anc followup /////////////////////////
        var { 
        //heightoffundus, 
        presentationandposition, presentingpart, foetalheight, bp, hb, protein, glucose, weight, oedema, tetanustoxoid, sulfadoxinepyrimethamine, albendazole, remark } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({
            // heightoffundus, 
            presentationandposition, presentingpart, foetalheight, bp, hb, protein, glucose, weight, oedema, tetanustoxoid, sulfadoxinepyrimethamine, albendazole, remark, staffname
        });
        //frequency must inlcude
        //route must contain allowed options
        const patientrecord = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, '', '');
        //console.log(admissionrecord);   
        if (!patientrecord) {
            throw new Error(`Patient donot ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, anc3_1.createanc)({ patient: patientrecord._id, pregnancysummary, generalexamination, postmedicalorsurgicalhistory, previouspregnancy, historyofpresentpregnancy, staffname });
        /////////////////////////////create first followup ////////////////////////////
        //create first followup
        yield (0, ancfollowup3_1.createancfollowup)({
            anc: queryresult._id,
            // heightoffundus, 
            presentationandposition, presentingpart, foetalheight, bp, hb, protein, glucose, weight, oedema, tetanustoxoid, sulfadoxinepyrimethamine, albendazole, remark, staffname
        });
        ///////////////////end first  follow up/////////////////////////////////
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createancsv3 = createancsv3;
function updateancsv3(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            const staffname = `${firstName} ${lastName}`;
            const { postmedicalorsurgicalhistory, previouspregnancy, historyofpresentpregnancy } = req.body;
            const { lmp, edd, gravidity, breasts, height, cvs, rs, pelvis, abdomen } = req.body;
            const pregnancysummary = { lmp, edd, gravidity };
            const generalexamination = { breasts, height, cvs, rs, pelvis, abdomen };
            //validateinputfaulsyvalue({...vitals});
            var queryresult = yield (0, anc3_1.updateanc)(id, { pregnancysummary, generalexamination, postmedicalorsurgicalhistory, previouspregnancy, historyofpresentpregnancy, staffname });
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
