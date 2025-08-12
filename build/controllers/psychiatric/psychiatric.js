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
exports.readOnePsychiatricEvaluationController = exports.updatePsychiatricEvaluationController = exports.createPsychiatricEvaluationController = exports.readAllPsychiatricByPatient = void 0;
const otherservices_1 = require("../../utils/otherservices");
const mongoose_1 = __importDefault(require("mongoose"));
const psychiatric_1 = require("../../dao/psychiatric");
const patientmanagement_1 = require("../../dao/patientmanagement");
const config_1 = __importDefault(require("../../config"));
const appointment_1 = require("../../dao/appointment");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const admissions_1 = require("../../dao/admissions");
const { ObjectId } = mongoose_1.default.Types;
// 🔍 Read all evaluations by patient
exports.readAllPsychiatricByPatient = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patient } = req.params;
    const { page = 1, limit = 150 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { patientId: patient };
    const select = {};
    const populate = "patientId";
    const secondpopulate = "appointmentId";
    const queryresult = yield (0, psychiatric_1.readAllPsychiatricEvaluations)(query, select, populate, secondpopulate, skip, parseInt(limit));
    res.status(200).json({ queryresult, status: true });
}));
// ➕ Create new psychiatric evaluation
exports.createPsychiatricEvaluationController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //export const createPsychiatricEvaluationController = async (req: any, res: any) => {
    const { id } = req.params; // patient ID
    const { firstName, lastName } = (req.user).user;
    const staffname = `${firstName} ${lastName}`;
    const { presentingcomplaints, historyofpresentingcomplaints, pastpsychiatrichistory, pastmedicalandsurgicalhistory, familyhistory, personaldevelopmenthistory, educationhistory, occupationhistory, psychosocialhistory, substanceusehistory, forensichistory, premorbidhistory, assessmentdiagnosis, planmanagement, appointmentoradmissionunderscoreid } = req.body;
    (0, otherservices_1.validateinputfaulsyvalue)({ id, appointmentoradmissionunderscoreid });
    const patient = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, '', '');
    if (!patient) {
        next(new Error(`Patient does not exist ${config_1.default.error.erroralreadyexit}`));
    }
    var checkappointmentId = new ObjectId(appointmentoradmissionunderscoreid);
    //validate appointment id
    var appointment = yield (0, appointment_1.readoneappointment)({ _id: checkappointmentId }, {}, '');
    var checkadimmison = yield (0, admissions_1.readoneadmission)({ _id: checkappointmentId }, {}, '');
    var appointmentId;
    var admissionId;
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
        presentingcomplaints,
        historyofpresentingcomplaints,
        pastpsychiatrichistory,
        pastmedicalandsurgicalhistory,
        familyhistory,
        personaldevelopmenthistory,
        educationhistory,
        occupationhistory,
        psychosocialhistory,
        substanceusehistory,
        forensichistory,
        premorbidhistory,
        assessmentdiagnosis,
        planmanagement,
        createdBy: staffname
    };
    const queryresult = yield (0, psychiatric_1.createPsychiatricEvaluation)(input);
    res.status(200).json({ queryresult, status: true });
}));
// 🔄 Update psychiatric evaluation by ID
exports.updatePsychiatricEvaluationController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { firstName, lastName } = (req.user).user;
    const staffname = `${firstName} ${lastName}`;
    const { presentingcomplaints, historyofpresentingcomplaints, pastpsychiatrichistory, pastmedicalandsurgicalhistory, familyhistory, personaldevelopmenthistory, educationhistory, occupationhistory, psychosocialhistory, substanceusehistory, forensichistory, premorbidhistory, assessmentdiagnosis, planmanagement } = req.body;
    const updates = {
        presentingcomplaints,
        historyofpresentingcomplaints,
        pastpsychiatrichistory,
        pastmedicalandsurgicalhistory,
        familyhistory,
        personaldevelopmenthistory,
        educationhistory,
        occupationhistory,
        psychosocialhistory,
        substanceusehistory,
        forensichistory,
        premorbidhistory,
        assessmentdiagnosis,
        planmanagement,
        updatedBy: staffname
    };
    const queryresult = yield (0, psychiatric_1.updatePsychiatricEvaluationById)(id, updates);
    res.status(200).json({ queryresult, status: true });
}));
// Optional: Read one by ID
exports.readOnePsychiatricEvaluationController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const queryresult = yield (0, psychiatric_1.readOnePsychiatricEvaluation)({ _id: id }, {});
    res.status(200).json({ queryresult, status: true });
}));
