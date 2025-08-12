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
exports.readOneDentalEncounterController = exports.updateDentalEncounterController = exports.createDentalEncounterController = exports.readAllDentalByPatient = void 0;
const otherservices_1 = require("../../utils/otherservices");
const mongoose_1 = __importDefault(require("mongoose"));
const dentalencounter_1 = require("../../dao/dentalencounter");
const patientmanagement_1 = require("../../dao/patientmanagement");
const appointment_1 = require("../../dao/appointment");
const admissions_1 = require("../../dao/admissions");
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const { ObjectId } = mongoose_1.default.Types;
// 🔍 Read all dental encounters by patient
exports.readAllDentalByPatient = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patient } = req.params;
    const { page = 1, limit = 150 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { patientId: patient };
    const select = {};
    const populate = "patientId";
    const secondpopulate = "appointmentId";
    const queryresult = yield (0, dentalencounter_1.readAllDentalEncounters)(query, select, populate, secondpopulate, skip, parseInt(limit));
    res.status(200).json({ queryresult, status: true });
}));
exports.createDentalEncounterController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // patient ID
    const { firstName, lastName } = req.user.user;
    const staffname = `${firstName} ${lastName}`;
    const { chiefComplaint, dentalHistoryNotes, previousDentalProcedure, allergies, lastDentalVisit, currentMedications, additionalComplaints, otherDentalHistory, firstQuadrantNote, secondQuadrantNote, thirdQuadrantNote, fourthQuadrantNote, medicalConditions, gingivalAssessment, alerts, periodontalProbing, xrayRadiographicFindings, cariesDetection, occlusalAnalysis, oralCancerScreening, tmjAssessment, teethPresent, missingTeeth, mobileTeeth, cariousTeeth, retainedRoots, fracturedTeeth, impactedTeeth, tenderToPercussion, filledTeeth, periodontalPockets, cervicalAbrasions, crownBridgeRestoration, dentures, calculus, otherFindings, notes, intraOral, tongue, mucosa, otherIntraOral, overallImpression, provisionalDiagnosis, diagnosisList, diagnosisNotes, proposedTreatments, priorityAndUrgency, procedureDate, descriptionOfProcedure, toothNumbersTreated, anesthesiaDetails, materialsUsed, procedureNotes, postProcedureCareInstructions, appointmentoradmissionunderscoreid } = req.body;
    (0, otherservices_1.validateinputfaulsyvalue)({ id, appointmentoradmissionunderscoreid });
    const patient = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, '', '');
    if (!patient) {
        return next(new Error(`Patient does not exist ${config_1.default.error.erroralreadyexit}`));
    }
    const checkappointmentId = new ObjectId(appointmentoradmissionunderscoreid);
    const appointment = yield (0, appointment_1.readoneappointment)({ _id: checkappointmentId }, {}, '');
    var appointmentId;
    var admissionId;
    var checkadimmison = yield (0, admissions_1.readoneadmission)({ _id: checkappointmentId }, {}, '');
    if (checkadimmison) {
        admissionId = checkappointmentId;
    }
    if (appointment) {
        appointmentId = checkappointmentId;
    }
    const input = {
        patientId: patient._id,
        appointmentId,
        admissionId,
        chiefComplaint,
        dentalHistoryNotes,
        previousDentalProcedure,
        allergies,
        lastDentalVisit,
        currentMedications,
        additionalComplaints,
        otherDentalHistory,
        quadrant: {
            firstQuadrantNote,
            secondQuadrantNote,
            thirdQuadrantNote,
            fourthQuadrantNote
        },
        medicalHistory: {
            medicalConditions,
            alerts
        },
        examinations: {
            gingivalAssessment,
            periodontalProbing,
            xrayRadiographicFindings,
            cariesDetection,
            occlusalAnalysis,
            oralCancerScreening,
            tmjAssessment,
            teethPresent,
            missingTeeth,
            mobileTeeth,
            cariousTeeth,
            retainedRoots,
            fracturedTeeth,
            impactedTeeth,
            tenderToPercussion,
            filledTeeth,
            periodontalPockets,
            cervicalAbrasions,
            crownBridgeRestoration,
            dentures,
            calculus,
            otherFindings
        },
        generalOralExam: {
            notes,
            intraOral,
            tongue,
            mucosa,
            otherIntraOral
        },
        impression: {
            overallImpression,
            provisionalDiagnosis
        },
        diagnosis: {
            diagnosisList,
            diagnosisNotes
        },
        treatmentPlan: {
            proposedTreatments,
            priorityAndUrgency
        },
        procedurePerformed: {
            procedureDate,
            descriptionOfProcedure,
            toothNumbersTreated,
            anesthesiaDetails,
            materialsUsed,
            procedureNotes,
            postProcedureCareInstructions,
            patientId: patient._id
        },
        createdBy: staffname
    };
    const queryresult = yield (0, dentalencounter_1.createDentalEncounter)(input);
    res.status(200).json({ queryresult, status: true });
}));
// 🔄 Update dental encounter by ID
exports.updateDentalEncounterController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { firstName, lastName } = req.user.user;
    const staffname = `${firstName} ${lastName}`;
    const { chiefComplaint, dentalHistoryNotes, previousDentalProcedure, allergies, lastDentalVisit, currentMedications, additionalComplaints, otherDentalHistory, firstQuadrantNote, secondQuadrantNote, thirdQuadrantNote, fourthQuadrantNote, medicalConditions, gingivalAssessment, alerts, periodontalProbing, xrayRadiographicFindings, cariesDetection, occlusalAnalysis, oralCancerScreening, tmjAssessment, teethPresent, missingTeeth, mobileTeeth, cariousTeeth, retainedRoots, fracturedTeeth, impactedTeeth, tenderToPercussion, filledTeeth, periodontalPockets, cervicalAbrasions, crownBridgeRestoration, dentures, calculus, otherFindings, notes, intraOral, tongue, mucosa, otherIntraOral, overallImpression, provisionalDiagnosis, diagnosisList, diagnosisNotes, proposedTreatments, priorityAndUrgency, procedureDate, descriptionOfProcedure, toothNumbersTreated, anesthesiaDetails, materialsUsed, procedureNotes, postProcedureCareInstructions } = req.body;
    const updates = {
        chiefComplaint,
        dentalHistoryNotes,
        previousDentalProcedure,
        allergies,
        lastDentalVisit,
        currentMedications,
        additionalComplaints,
        otherDentalHistory,
        quadrant: {
            firstQuadrantNote,
            secondQuadrantNote,
            thirdQuadrantNote,
            fourthQuadrantNote
        },
        medicalHistory: {
            medicalConditions,
            alerts
        },
        examinations: {
            gingivalAssessment,
            periodontalProbing,
            xrayRadiographicFindings,
            cariesDetection,
            occlusalAnalysis,
            oralCancerScreening,
            tmjAssessment,
            teethPresent,
            missingTeeth,
            mobileTeeth,
            cariousTeeth,
            retainedRoots,
            fracturedTeeth,
            impactedTeeth,
            tenderToPercussion,
            filledTeeth,
            periodontalPockets,
            cervicalAbrasions,
            crownBridgeRestoration,
            dentures,
            calculus,
            otherFindings
        },
        generalOralExam: {
            notes,
            intraOral,
            tongue,
            mucosa,
            otherIntraOral
        },
        impression: {
            overallImpression,
            provisionalDiagnosis
        },
        diagnosis: {
            diagnosisList,
            diagnosisNotes
        },
        treatmentPlan: {
            proposedTreatments,
            priorityAndUrgency
        },
        procedurePerformed: {
            procedureDate,
            descriptionOfProcedure,
            toothNumbersTreated,
            anesthesiaDetails,
            materialsUsed,
            procedureNotes,
            postProcedureCareInstructions
        },
        updatedBy: staffname
    };
    const queryresult = yield (0, dentalencounter_1.updateDentalEncounterById)(id, updates);
    res.status(200).json({ queryresult, status: true });
}));
// 🔍 Read one dental encounter
exports.readOneDentalEncounterController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const queryresult = yield (0, dentalencounter_1.readOneDentalEncounter)({ _id: id }, {});
    res.status(200).json({ queryresult, status: true });
}));
