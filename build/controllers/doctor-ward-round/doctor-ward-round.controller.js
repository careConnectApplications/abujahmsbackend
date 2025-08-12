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
exports.updateDoctorWardAdmissionNote = exports.getDoctorWardNoteById = exports.getAllDoctorWardNotes = exports.createDoctorWardNote = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const errors_1 = require("../../errors");
const doctor_ward_round_dao_1 = require("../../dao/doctor-ward-round.dao");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const admissions_1 = require("../../dao/admissions");
exports.createDoctorWardNote = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { admissionId, admissionNote } = req.body;
    const { _id: userId } = (req.user).user;
    if (!admissionId || !admissionNote) {
        return next(new errors_1.ApiError(400, 'Admission ID and note are required'));
    }
    const admissionrecord = yield (0, admissions_1.readoneadmission)({ _id: admissionId }, {}, '');
    //console.log(admissionrecord);   
    if (!admissionrecord) {
        throw new Error(`Admission do not ${config_1.default.error.erroralreadyexit}`);
    }
    const note = yield (0, doctor_ward_round_dao_1.CreateDoctorWardRoundDao)({
        admissionId,
        admissionNote,
        createdBy: userId
    }, next);
    res.status(201).json({
        status: true,
        message: 'Admission note for doctor ward round created successfully',
        data: note
    });
}));
exports.getAllDoctorWardNotes = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = {};
    if (req.query.admissionId) {
        filter.admissionId = req.query.admissionId;
    }
    if (req.query.userId)
        filter.createdBy = req.query.userId;
    const notes = yield (0, doctor_ward_round_dao_1.getAllDoctorWardRoundRecords)(filter, "admissionId createdBy");
    res.status(200).json({
        status: true,
        results: notes.length,
        data: notes
    });
}));
exports.getDoctorWardNoteById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        return next(new errors_1.ApiError(400, config_1.default.error.errorIdIsRequired));
    }
    const note = yield (0, doctor_ward_round_dao_1.getDoctorWardRoundById)(new mongoose_1.default.Types.ObjectId(id));
    if (!note) {
        return next(new errors_1.ApiError(404, 'Admission note not found'));
    }
    res.status(200).json({
        status: 'success',
        data: note
    });
}));
exports.updateDoctorWardAdmissionNote = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { admissionNote } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return next(new errors_1.ApiError(400, 'Invalid ID'));
    }
    const noteExist = yield (0, doctor_ward_round_dao_1.getDoctorWardRoundById)(new mongoose_1.default.Types.ObjectId(id));
    if (!noteExist) {
        return next(new errors_1.ApiError(404, 'Admission note not found'));
    }
    if (admissionNote === undefined) {
        return next(new errors_1.ApiError(400, 'Admission note is required'));
    }
    const note = yield (0, doctor_ward_round_dao_1.updateDoctorWardRecordById)({ _id: id }, req.body);
    if (!note) {
        return next(new errors_1.ApiError(404, 'Admission note not found'));
    }
    res.status(200).json({
        status: 'success',
        message: 'Admission note updated successfully',
        data: note
    });
}));
