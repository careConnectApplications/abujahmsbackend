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
exports.updatePhysiotherapyAssessment = exports.readOnePhysiotherapyAssessments = exports.readAllPhysiotherapyAssessmentByPatient = exports.createPhysiotherapyAssessments = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const config_1 = __importDefault(require("../../config"));
const otherservices_1 = require("../../utils/otherservices");
const patientmanagement_1 = require("../../dao/patientmanagement");
const appointment_1 = require("../../dao/appointment");
const physiotherapyassessment_1 = require("../../dao/physiotherapyassessment");
const admissions_1 = require("../../dao/admissions");
const { ObjectId } = mongoose_1.default.Types;
exports.createPhysiotherapyAssessments = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // patient ID
    const { firstName, lastName } = req.user.user;
    const staffname = `${firstName} ${lastName}`;
    const { appointmentoradmissionunderscoreid, chiefComplaint, historyOfPresentCondition, medicalHistory, surgicalHistory, medications, previousTreatments, bloodPressure, pulse, respiratoryRate, temperature, muscleStrengthTesting, posturalAssessment, gaitAnalysis, palpationFindings, specialTests, functionalLimitations, visualAnalogScaleForPain, oswestryDisabilityIndex, timeUpAndGoTest, sixMinutesWalkTest, outcomeMeasureNotes, diagnosisICDEleven, primaryDiagnosisNotes, secondaryDiagnosisNotes, clinicalImpressions, shortTermGoals, longTermGoals, intervention, affectedBodyPart, slideOfBody, jointName, movementType, activeRangeOfMotion, passiveRangeOfMotion, normalRangeOfMotion, ROMDeficit, painLevelDuringMovement, endFeel, assessmentToolUsed, functionalImpact, progressNotes, notes } = req.body;
    (0, otherservices_1.validateinputfaulsyvalue)({ id, appointmentoradmissionunderscoreid });
    //const appointmentId = new ObjectId(appointmentunderscoreid);
    const patient = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, '', '');
    if (!patient)
        return next(new Error(`Patient does not exist ${config_1.default.error.erroralreadyexit}`));
    var checkappointmentId = new ObjectId(appointmentoradmissionunderscoreid);
    const appointment = yield (0, appointment_1.readoneappointment)({ _id: checkappointmentId }, {}, '');
    var checkadimmison = yield (0, admissions_1.readoneadmission)({ _id: checkappointmentId }, {}, '');
    var appointmentId;
    var admissionId;
    if (checkadimmison) {
        admissionId = checkappointmentId;
    }
    if (appointment) {
        appointmentId = checkappointmentId;
    }
    //if (!appointment) return next(new Error(`Appointment does not exist ${configuration.error.erroralreadyexit}`));
    const input = {
        patientId: patient._id,
        appointmentId,
        admissionId,
        createdBy: staffname,
        rangeofmotion: {
            affectedBodyPart,
            slideOfBody,
            jointName,
            movementType,
            activeRangeOfMotion,
            passiveRangeOfMotion,
            normalRangeOfMotion,
            ROMDeficit,
            painLevelDuringMovement,
            endFeel,
            assessmentToolUsed,
            functionalImpact,
            progressNotes,
            notes
        },
        clinicalassessment: {
            chiefComplaint,
            historyOfPresentCondition,
            medicalHistory,
            surgicalHistory,
            medications,
            previousTreatments
        },
        physicalexamination: {
            bloodPressure,
            pulse,
            respiratoryRate,
            temperature,
            muscleStrengthTesting,
            posturalAssessment,
            gaitAnalysis,
            palpationFindings,
            specialTests
        },
        functionalLimitations,
        outcomeMeasures: {
            visualAnalogScaleForPain,
            oswestryDisabilityIndex,
            timeUpAndGoTest,
            sixMinutesWalkTest,
            outcomeMeasureNotes
        },
        diagnosisandclinicalImpression: {
            diagnosisICDEleven,
            primaryDiagnosisNotes,
            secondaryDiagnosisNotes,
            clinicalImpressions
        },
        treatmentplanandgoals: {
            shortTermGoals,
            longTermGoals,
            intervention,
        }
    };
    const queryresult = yield (0, physiotherapyassessment_1.createPhysiotherapyAssessment)(input);
    res.status(201).json({ queryresult, status: true });
}));
exports.readAllPhysiotherapyAssessmentByPatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patient } = req.params;
    const { page = 1, limit = 150 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const queryresult = yield (0, physiotherapyassessment_1.readAllPhysiotherapyAssessments)({ patientId: patient }, {}, "patientId", "appointmentId", skip, parseInt(limit));
    res.status(200).json({ queryresult, status: true });
}));
exports.readOnePhysiotherapyAssessments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const queryresult = yield (0, physiotherapyassessment_1.readOnePhysiotherapyAssessment)({ _id: id }, {});
    res.status(200).json({ queryresult, status: true });
}));
exports.updatePhysiotherapyAssessment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { firstName, lastName } = req.user.user;
    const staffname = `${firstName} ${lastName}`;
    const { chiefComplaint, historyOfPresentCondition, medicalHistory, surgicalHistory, medications, previousTreatments, bloodPressure, pulse, respiratoryRate, temperature, muscleStrengthTesting, posturalAssessment, gaitAnalysis, palpationFindings, specialTests, functionalLimitations, visualAnalogScaleForPain, oswestryDisabilityIndex, timeUpAndGoTest, sixMinutesWalkTest, outcomeMeasureNotes, diagnosisICDEleven, primaryDiagnosisNotes, secondaryDiagnosisNotes, clinicalImpressions, shortTermGoals, longTermGoals, intervention, affectedBodyPart, slideOfBody, jointName, movementType, activeRangeOfMotion, passiveRangeOfMotion, normalRangeOfMotion, ROMDeficit, painLevelDuringMovement, endFeel, assessmentToolUsed, functionalImpact, progressNotes, notes } = req.body;
    const updates = {
        rangeofmotion: {
            affectedBodyPart,
            slideOfBody,
            jointName,
            movementType,
            activeRangeOfMotion,
            passiveRangeOfMotion,
            normalRangeOfMotion,
            ROMDeficit,
            painLevelDuringMovement,
            endFeel,
            assessmentToolUsed,
            functionalImpact,
            progressNotes,
            notes
        },
        clinicalassessment: {
            chiefComplaint,
            historyOfPresentCondition,
            medicalHistory,
            surgicalHistory,
            medications,
            previousTreatments
        },
        physicalexamination: {
            bloodPressure,
            pulse,
            respiratoryRate,
            temperature,
            muscleStrengthTesting,
            posturalAssessment,
            gaitAnalysis,
            palpationFindings,
            specialTests
        },
        functionalLimitations,
        outcomeMeasures: {
            visualAnalogScaleForPain,
            oswestryDisabilityIndex,
            timeUpAndGoTest,
            sixMinutesWalkTest,
            outcomeMeasureNotes
        },
        diagnosisandclinicalImpression: {
            diagnosisICDEleven,
            primaryDiagnosisNotes,
            secondaryDiagnosisNotes,
            clinicalImpressions
        },
        treatmentplanandgoals: {
            shortTermGoals,
            longTermGoals,
            intervention,
        },
        updatedBy: staffname
    };
    const queryresult = yield (0, physiotherapyassessment_1.updatePhysiotherapyAssessmentById)(id, updates);
    res.status(200).json({ queryresult, status: true });
}));
