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
exports.createancs = exports.readAllancByPatient = exports.createancfollowups = exports.readAllancfollowupByAnc = void 0;
exports.updateancfollowups = updateancfollowups;
exports.updateancs = updateancs;
const anc_1 = require("../../dao/anc");
const ancfollowup_1 = require("../../dao/ancfollowup");
const otherservices_1 = require("../../utils/otherservices");
const patientmanagement_1 = require("../../dao/patientmanagement");
const config_1 = __importDefault(require("../../config"));
//get lab order by patient
///////////////////////////anc followup/////////////////////////
const readAllancfollowupByAnc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.readAllancfollowupByAnc = readAllancfollowupByAnc;
const createancfollowups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { anc } = req.params;
        console.log('anc', anc);
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        var { ga, sfh, wf, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ ga, sfh, wf, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname });
        //frequency must inlcude
        //route must contain allowed options
        const ancrecord = yield (0, anc_1.readoneanc)({ _id: anc }, {}, '');
        //console.log(admissionrecord);   
        if (!ancrecord) {
            throw new Error(`ANC donot ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, ancfollowup_1.createancfollowup)({ anc: ancrecord._id, ga, sfh, wf, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createancfollowups = createancfollowups;
//insulin
function updateancfollowups(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { ga, sfh, wf, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ ga, sfh, wf, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname });
            var queryresult = yield (0, ancfollowup_1.updateancfollowup)(id, { ga, sfh, wf, lie, presentation, position, fhr, urine, bp, remark, followup, riskidentified, currentmedication, staffname });
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
const readAllancByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { patient } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, anc_1.readallanc)({ patient }, {}, 'patient');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllancByPatient = readAllancByPatient;
const createancs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName } = (req.user).user;
        const staffname = `${firstName} ${lastName}`;
        //if(!(isObjectAvailable(req.body.pregnancysummary))) req.body.pregnancysummary={};
        if (!((0, otherservices_1.isObjectAvailable)(req.body.medicalobsterichistory)))
            req.body.medicalobsterichistory = {};
        if (!((0, otherservices_1.isObjectAvailable)(req.body.currenthistory)))
            req.body.currenthistory = {};
        if (!((0, otherservices_1.isObjectAvailable)(req.body.generalmedicalhistory)))
            req.body.generalmedicalhistory = {};
        if (!((0, otherservices_1.isObjectAvailable)(req.body.physicalexamination)))
            req.body.physicalexamination = {};
        if (!((0, otherservices_1.isObjectAvailable)(req.body.laboratory)))
            req.body.laboratory = {};
        if (!((0, otherservices_1.isObjectAvailable)(req.body.healtheducationtopicscovered)))
            req.body.healtheducationtopicscovered = {};
        if (!((0, otherservices_1.isObjectAvailable)(req.body.tetanustoxod)))
            req.body.tetanustoxod = {};
        if (!((0, otherservices_1.isObjectAvailable)(req.body.ipt)))
            req.body.ipt = {};
        if (!((0, otherservices_1.isObjectAvailable)(req.body.ironfolategiven)))
            req.body.ironfolategiven = {};
        const { currentmedication, allergies } = req.body;
        const { lmp, cycle, edd, gravida, term, preterm, abortions, ectopic, stillbirths, noliving } = req.body;
        const { previousstillbirthornewbornloss, historyofthreeormoreconsecutivespontaneousabortions, birthweightoflastbabylessthan450, birthweightoflastbabygreaterthan450, lastpregnancyhospitaladmissionforpeteclampsia, previoussurgeryonreproductivetract } = (req.body).medicalobsterichistory;
        const { diagnosedsuspectedmultipleprenancy, agelessthan16, agemorethan40, rhesusnegative, vaginalbleeding, pelvicmass, diastolicbpgreaterthan90 } = (req.body).currenthistory;
        const { diabetesmellitus, renaldisease, cardiacdisease, sicklecelldisease, hivpositive, anyotherseveremedicaldeseaseorconditionspecify } = (req.body).generalmedicalhistory;
        const { weight, bloodpressure, pulse, headteetheyesnosethroat, thyroid, chest, breasts, cardiovascular, abdomen, varicoseveins, neurologicalexam, externalgenitalia, cervixvigina, uterus, adnexa, anythingabnormal, additionalcomment } = (req.body).physicalexamination;
        const { haemoglobinhaematocrit, urinalysisprotientsugar, vdrlorrprotientsugar, boodgroupandrhesusstatus, hivtest, urinnemicroscopic, haemoglobin, others } = (req.body).laboratory;
        const { nutrition, restandexercise, malariainpregnancy, safersexinpregnancy, vctforpreventionofmotertochildtrnsmissionofhiv, birthandemergencyreadnessplanning, alcohotobaccoorotherdrugsysed, familyplanningbirthspacing, infantfeedingoptions } = (req.body).healtheducationtopicscovered;
        const { tetanusfirstdose, tetanusfirstdosedate, tetanusseconddose, tetatusseonddosedate, tetanusthirddose, tetanusthirddosedate, tetatusfourthdose, tetanusfourthdosedate, tetanusfifthdose, tetanusfifthdosedate } = (req.body).tetanustoxod;
        const { iptfirstdose, iptfirstdosedate, iptseconddose, iptseconddosedate, iptthirddose, iptthirddosedate, iptfourthdose, iptfourthdosedate, iptfifthdose, iptfifthdosedate, iptsixthdose, iptsixthdosedate, } = (req.body).ipt;
        const { prescription, tablets, ironfolategivendate } = (req.body).ironfolategiven;
        //general physical examination
        const pregnancysummary = { lmp, cycle, edd, gravida, term, preterm, abortions, ectopic, stillbirths, noliving };
        const medicalobsterichistory = { previousstillbirthornewbornloss, historyofthreeormoreconsecutivespontaneousabortions, birthweightoflastbabylessthan450, birthweightoflastbabygreaterthan450, lastpregnancyhospitaladmissionforpeteclampsia, previoussurgeryonreproductivetract };
        const currenthistory = { diagnosedsuspectedmultipleprenancy, agelessthan16, agemorethan40, rhesusnegative, vaginalbleeding, pelvicmass, diastolicbpgreaterthan90 };
        const generalmedicalhistory = { diabetesmellitus, renaldisease, cardiacdisease, sicklecelldisease, hivpositive, anyotherseveremedicaldeseaseorconditionspecify };
        const physicalexamination = { weight, bloodpressure, pulse, headteetheyesnosethroat, thyroid, chest, breasts, cardiovascular, abdomen, varicoseveins, neurologicalexam, externalgenitalia, cervixvigina, uterus, adnexa, anythingabnormal, additionalcomment };
        const laboratory = { haemoglobinhaematocrit, urinalysisprotientsugar, vdrlorrprotientsugar, boodgroupandrhesusstatus, hivtest, urinnemicroscopic, haemoglobin, others };
        const healtheducationtopicscovered = { nutrition, restandexercise, malariainpregnancy, safersexinpregnancy, vctforpreventionofmotertochildtrnsmissionofhiv, birthandemergencyreadnessplanning, alcohotobaccoorotherdrugsysed, familyplanningbirthspacing, infantfeedingoptions };
        const tetanustoxod = { tetanusfirstdose, tetanusfirstdosedate, tetanusseconddose, tetatusseonddosedate, tetanusthirddose, tetanusthirddosedate, tetatusfourthdose, tetanusfourthdosedate, tetanusfifthdose, tetanusfifthdosedate };
        const ipt = { iptfirstdose, iptfirstdosedate, iptseconddose, iptseconddosedate, iptthirddose, iptthirddosedate, iptfourthdose, iptfourthdosedate, iptfifthdose, iptfifthdosedate, iptsixthdose, iptsixthdosedate };
        const ironfolategiven = { prescription, tablets, ironfolategivendate };
        const { obstetrichistory } = req.body;
        //frequency must inlcude
        //route must contain allowed options
        const patientrecord = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, '', '');
        //console.log(admissionrecord);   
        if (!patientrecord) {
            throw new Error(`Patient donot ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, anc_1.createanc)({ patient: patientrecord._id, obstetrichistory, pregnancysummary, medicalobsterichistory, currenthistory, generalmedicalhistory, physicalexamination, laboratory, healtheducationtopicscovered, tetanustoxod, ironfolategiven, ipt, currentmedication, allergies, staffname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createancs = createancs;
function updateancs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            const staffname = `${firstName} ${lastName}`;
            //validate empty object and initialize
            if (!((0, otherservices_1.isObjectAvailable)(req.body.pregnancysummary)))
                req.body.pregnancysummary = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.medicalobsterichistory)))
                req.body.medicalobsterichistory = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.currenthistory)))
                req.body.currenthistory = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.generalmedicalhistory)))
                req.body.generalmedicalhistory = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.physicalexamination)))
                req.body.physicalexamination = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.laboratory)))
                req.body.laboratory = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.healtheducationtopicscovered)))
                req.body.healtheducationtopicscovered = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.tetanustoxod)))
                req.body.tetanustoxod = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.ipt)))
                req.body.ipt = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.ironfolategiven)))
                req.body.ironfolategiven = {};
            const { currentmedication, allergies } = req.body;
            const { lmp, cycle, edd, gravida, term, preterm, abortions, ectopic, stillbirths, noliving } = (req.body).pregnancysummary;
            const { previousstillbirthornewbornloss, historyofthreeormoreconsecutivespontaneousabortions, birthweightoflastbabylessthan450, birthweightoflastbabygreaterthan450, lastpregnancyhospitaladmissionforpeteclampsia, previoussurgeryonreproductivetract } = (req.body).medicalobsterichistory;
            const { diagnosedsuspectedmultipleprenancy, agelessthan16, agemorethan40, rhesusnegative, vaginalbleeding, pelvicmass, diastolicbpgreaterthan90 } = (req.body).currenthistory;
            const { diabetesmellitus, renaldisease, cardiacdisease, sicklecelldisease, hivpositive, anyotherseveremedicaldeseaseorconditionspecify } = (req.body).generalmedicalhistory;
            const { weight, bloodpressure, pulse, headteetheyesnosethroat, thyroid, chest, breasts, cardiovascular, abdomen, varicoseveins, neurologicalexam, externalgenitalia, cervixvigina, uterus, adnexa, anythingabnormal, additionalcomment } = (req.body).physicalexamination;
            const { haemoglobinhaematocrit, urinalysisprotientsugar, vdrlorrprotientsugar, boodgroupandrhesusstatus, hivtest, urinnemicroscopic, haemoglobin, others } = (req.body).laboratory;
            const { nutrition, restandexercise, malariainpregnancy, safersexinpregnancy, vctforpreventionofmotertochildtrnsmissionofhiv, brthandemergencyreadnessplanning, alcohotobaccoorotherdrugsysed, familyplanningbirthspacing, infantfeedingoptions } = (req.body).healtheducationtopicscovered;
            const { tetanusfirstdose, tetanusfirstdosedate, tetanusseconddose, tetatusseonddosedate, tetanusthirddose, tetanusthirddosedate, tetatusfourthdose, tetanusfourthdosedate, tetanusfifthdose, tetanusfifthdosedate } = (req.body).tetanustoxod;
            const { iptfirstdose, iptfirstdosedate, iptseconddose, iptseconddosedate, iptthirddose, iptthirddosedate, iptfourthdose, iptfourthdosedate, iptfifthdose, iptfifthdosedate, iptsixthdose, iptsixthdosedate, } = (req.body).ipt;
            const { prescription, tablets, ironfolategivendate } = (req.body).ironfolategiven;
            //general physical examination
            const pregnancysummary = { lmp, cycle, edd, gravida, term, preterm, abortions, ectopic, stillbirths, noliving };
            const medicalobsterichistory = { previousstillbirthornewbornloss, historyofthreeormoreconsecutivespontaneousabortions, birthweightoflastbabylessthan450, birthweightoflastbabygreaterthan450, lastpregnancyhospitaladmissionforpeteclampsia, previoussurgeryonreproductivetract };
            const currenthistory = { diagnosedsuspectedmultipleprenancy, agelessthan16, agemorethan40, rhesusnegative, vaginalbleeding, pelvicmass, diastolicbpgreaterthan90 };
            const generalmedicalhistory = { diabetesmellitus, renaldisease, cardiacdisease, sicklecelldisease, hivpositive, anyotherseveremedicaldeseaseorconditionspecify };
            const physicalexamination = { weight, bloodpressure, pulse, headteetheyesnosethroat, thyroid, chest, breasts, cardiovascular, abdomen, varicoseveins, neurologicalexam, externalgenitalia, cervixvigina, uterus, adnexa, anythingabnormal, additionalcomment };
            const laboratory = { haemoglobinhaematocrit, urinalysisprotientsugar, vdrlorrprotientsugar, boodgroupandrhesusstatus, hivtest, urinnemicroscopic, haemoglobin, others };
            const healtheducationtopicscovered = { nutrition, restandexercise, malariainpregnancy, safersexinpregnancy, vctforpreventionofmotertochildtrnsmissionofhiv, brthandemergencyreadnessplanning, alcohotobaccoorotherdrugsysed, familyplanningbirthspacing, infantfeedingoptions };
            const tetanustoxod = { tetanusfirstdose, tetanusfirstdosedate, tetanusseconddose, tetatusseonddosedate, tetanusthirddose, tetanusthirddosedate, tetatusfourthdose, tetanusfourthdosedate, tetanusfifthdose, tetanusfifthdosedate };
            const ipt = { iptfirstdose, iptfirstdosedate, iptseconddose, iptseconddosedate, iptthirddose, iptthirddosedate, iptfourthdose, iptfourthdosedate, iptfifthdose, iptfifthdosedate, iptsixthdose, iptsixthdosedate };
            const ironfolategiven = { prescription, tablets, ironfolategivendate };
            const { obstetrichistory } = req.body;
            //validateinputfaulsyvalue({...vitals});
            var queryresult = yield (0, anc_1.updateanc)(id, { pregnancysummary, obstetrichistory, medicalobsterichistory, currenthistory, generalmedicalhistory, physicalexamination, laboratory, healtheducationtopicscovered, tetanustoxod, ironfolategiven, ipt, currentmedication, allergies, staffname });
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
