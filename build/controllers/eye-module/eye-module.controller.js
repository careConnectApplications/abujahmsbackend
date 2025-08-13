"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getEyeRecordByPatientId = exports.updateOperationalTest = exports.updateExamination = exports.updatePreliminaryTest = exports.updateLensPrescription = exports.getAllEyeRecordsPaginatedHandler = exports.getAllEyeUtilData = exports.getAllEyeRecords = exports.getEyeRecordById = exports.getEyeRecordByAppointmentIdAndPatientId = exports.createOperationalNotes = exports.createPreliminaryTest = exports.createExamination = exports.createLensPrescription = exports.createEyeModule = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const errors_1 = require("../../errors");
const config_1 = __importDefault(require("../../config"));
const patientmanagement_1 = require("../../dao/patientmanagement");
const appointment_1 = require("../../dao/appointment");
const otherservices_1 = require("../../utils/otherservices");
const eye_module_dao_1 = require("../../dao/eye-module.dao");
const eye_modules_1 = require("../../config/eye-modules");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
const pick_1 = __importDefault(require("../../utils/pick"));
const validatePatientAndAppointment = (patientId, appointmentId, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!patientId)
        return next(new errors_1.ApiError(400, "Patient ID is required"));
    if (!appointmentId)
        return next(new errors_1.ApiError(400, "Appointment ID is required"));
    const patient = yield (0, patientmanagement_1.readonepatient)({ _id: patientId }, {}, "", "");
    if (!patient)
        return next(new errors_1.ApiError(404, "Patient does not exist"));
    const appointment = yield (0, appointment_1.readoneappointment)({ _id: appointmentId }, {}, "");
    if (!appointment)
        return next(new errors_1.ApiError(404, "Appointment does not exist"));
    return { patient, appointment };
});
const generateRefNumber = () => {
    const uniqueId = (0, uuid_1.v4)();
    return `Eye-${new Date().getFullYear()}-${uniqueId}`;
};
exports.createEyeModule = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, lensPrescription, examination, preliminaryTest, operationalTest } = req.body;
    const { _id: userId } = (req.user).user;
    if (!patientId)
        return next(new errors_1.ApiError(400, config_1.default.error.errorPatientIdIsRequiredF));
    const _patientId = new mongoose_1.default.Types.ObjectId(patientId);
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new errors_1.ApiError(404, `Patient do not ${config_1.default.error.erroralreadyexit}`));
    }
    const newEyeModule = {
        patient: patientId,
        optometryLensPrescription: lensPrescription,
        examination,
        preliminaryTest,
        operationalTest,
        createdBy: userId
    };
}));
exports.createLensPrescription = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, appointmentId, rightsphere, rightcyl, rightaxis, rightprism, rightva, leftsphere, leftcyl, leftaxis, leftprism, leftva, addright, addleft, ipdnear, ipddist, lensTint, lensSize, segHt, temple, lensType, frame, colour, remarks, nextExamDate, nextAppointmentDate } = req.body;
    const { _id: userId } = (req.user).user;
    if (!patientId)
        return next(new errors_1.ApiError(400, config_1.default.error.errorPatientIdIsRequired));
    if (!appointmentId)
        return next(new errors_1.ApiError(400, "appointment id is required"));
    const _patientId = new mongoose_1.default.Types.ObjectId(patientId);
    const _appointmentId = new mongoose_1.default.Types.ObjectId(appointmentId);
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new errors_1.ApiError(404, `Patient do not ${config_1.default.error.erroralreadyexit}`));
    }
    const foundAppointment = yield (0, appointment_1.readoneappointment)({ _id: appointmentId }, {}, '');
    if (!foundAppointment) {
        return next(new errors_1.ApiError(404, `appointment do not ${config_1.default.error.erroralreadyexit}`));
    }
    /// first check if eye module instance aleady exist if not create one
    /// if it do check if eyeModule.optometryLensPrescription is null if its null update but if it exist ask user to update lens prescription
    const existingEyeModule = yield (0, eye_module_dao_1.findOneEyeModule)({ patient: patientId, appointment: appointmentId }, {});
    let eyeDoc = {};
    const lensPrescriptionData = {
        distance: {
            right: {
                sphere: rightsphere,
                cyl: rightcyl,
                axis: rightaxis,
                prism: rightprism,
                va: rightva
            },
            left: {
                sphere: leftsphere,
                cyl: leftcyl,
                axis: leftaxis,
                prism: leftprism,
                va: leftva
            }
        },
        add: {
            right: addright,
            left: addleft
        },
        ipd: {
            near: ipdnear,
            dist: ipddist
        },
        lensTint,
        lensSize,
        segHt,
        temple,
        lensType,
        frame,
        colour,
        remarks,
        nextExamDate: nextExamDate ? (0, otherservices_1.parseDate)(nextExamDate) : null,
        nextAppointmentDate: nextAppointmentDate ? (0, otherservices_1.parseDate)(nextAppointmentDate) : null
    };
    if (existingEyeModule) {
        if (existingEyeModule.optometryLensPrescription) {
            return next(new errors_1.ApiError(400, "Lens prescription already exists. Please use schedule another one."));
        }
        eyeDoc = yield (0, eye_module_dao_1.updateEyeModule)(existingEyeModule._id, {
            optometryLensPrescription: lensPrescriptionData,
            updatedBy: userId
        }, next);
    }
    else {
        const refNumber = generateRefNumber();
        const newEyeModule = {
            patient: patientId,
            ref: refNumber,
            appointment: _appointmentId,
            appointmentid: foundAppointment.appointmentid,
            optometryLensPrescription: lensPrescriptionData,
            createdBy: userId
        };
        eyeDoc = yield (0, eye_module_dao_1.createEyeService)(newEyeModule);
    }
    if (!eyeDoc)
        return next(new errors_1.ApiError(404, "something went wrong"));
    return res.status(201).json({
        status: "success",
        data: eyeDoc
    });
}));
exports.createExamination = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, appointmentId, 
    // Slit Lamp
    adnexaOd, adnexaOs, lidsOd, lidsOs, tearBreakOd, tearBreakOs, conjunctivaOd, conjunctivaOs, corneaOd, corneaOs, antChamberOd, antChamberOs, depthOd, depthOs, cellsOd, cellsOs, flareOd, flareOs, irisOd, irisOs, colourOd, colourOs, anglesOd, anglesOs, pupilOd, pupilOs, lensOd, lensOs, clarityOd, clarityOs, antCapsOd, antCapsOs, postCapsOd, postCapsOs, cortexOd, cortexOs, nucleusOd, nucleusOs, 
    // Ophthalmoscopy
    opticDiscOd, opticDiscOs, sizeOd, sizeOs, ratioOd, ratioOs, appearanceOd, appearanceOs, nerveFiberOd, nerveFiberOs, retinaOd, retinaOs, maculaOd, maculaOs, postRetinaOd, postRetinaOs, vesselsOd, vesselsOs, peripheryOd, peripheryOs, vitreousOd, vitreousOs, 
    // Refraction
    sphereOd, sphereOs, cylOd, cylOs, axisOd, axisOs, addOd, addOs, hPrismOd, hPrismOs, hBaseOd, hBaseOs, vPrismOd, vPrismOs, vBaseOd, vBaseOs, vcOd, vcOs, bcvaOd, bcvaOs, 
    // Phorias
    distAtUnnamed, distAtHorizontal, distAtVertical, distAtBase, distAtRefEye, nearAtUnnamed, nearAtHorizontal, nearAtVertical, nearAtBase, nearAtRefEye, phoriaMethodInput1, phoriaMethodInput2, 
    // Dates
    nextAppointmentDate } = req.body;
    const { _id: userId } = req.user.user;
    if (!patientId)
        return next(new errors_1.ApiError(400, config_1.default.error.errorPatientIdIsRequired));
    if (!appointmentId)
        return next(new errors_1.ApiError(400, "Appointment ID is required"));
    let _patientId, _appointmentId;
    try {
        _patientId = new mongoose_1.default.Types.ObjectId(patientId);
        _appointmentId = new mongoose_1.default.Types.ObjectId(appointmentId);
    }
    catch (err) {
        return next(new errors_1.ApiError(400, "Invalid ID format"));
    }
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: _patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new errors_1.ApiError(404, `Patient does not exist.`));
    }
    const foundAppointment = yield (0, appointment_1.readoneappointment)({ _id: _appointmentId }, {}, '');
    if (!foundAppointment) {
        return next(new errors_1.ApiError(404, `Appointment does not exist.`));
    }
    // Build structured examination data
    const examinationData = {
        slitLamp: {
            adnexa: { OD: adnexaOd, OS: adnexaOs },
            lids: { OD: lidsOd, OS: lidsOs },
            tearBreak: { OD: tearBreakOd, OS: tearBreakOs },
            conjunctiva: { OD: conjunctivaOd, OS: conjunctivaOs },
            cornea: { OD: corneaOd, OS: corneaOs },
            antChamber: { OD: antChamberOd, OS: antChamberOs },
            depth: { OD: depthOd, OS: depthOs },
            cells: { OD: cellsOd, OS: cellsOs },
            flare: { OD: flareOd, OS: flareOs },
            iris: { OD: irisOd, OS: irisOs },
            colour: { OD: colourOd, OS: colourOs },
            angles: { OD: anglesOd, OS: anglesOs },
            pupil: { OD: pupilOd, OS: pupilOs },
            lens: { OD: lensOd, OS: lensOs },
            clarity: { OD: clarityOd, OS: clarityOs },
            antCaps: { OD: antCapsOd, OS: antCapsOs },
            postCaps: { OD: postCapsOd, OS: postCapsOs },
            cortex: { OD: cortexOd, OS: cortexOs },
            nucleus: { OD: nucleusOd, OS: nucleusOs }
        },
        ophthalmoscopy: {
            opticDisc: { OD: opticDiscOd, OS: opticDiscOs },
            size: { OD: sizeOd, OS: sizeOs },
            ratio: { OD: ratioOd, OS: ratioOs },
            appearance: { OD: appearanceOd, OS: appearanceOs },
            nerveFiber: { OD: nerveFiberOd, OS: nerveFiberOs },
            retina: { OD: retinaOd, OS: retinaOs },
            macula: { OD: maculaOd, OS: maculaOs },
            postRetina: { OD: postRetinaOd, OS: postRetinaOs },
            vessels: { OD: vesselsOd, OS: vesselsOs },
            periphery: { OD: peripheryOd, OS: peripheryOs },
            vitreous: { OD: vitreousOd, OS: vitreousOs }
        },
        refraction: {
            sphere: { OD: sphereOd, OS: sphereOs },
            cyl: { OD: cylOd, OS: cylOs },
            axis: { OD: axisOd, OS: axisOs },
            add: { OD: addOd, OS: addOs },
            hPrism: { OD: hPrismOd, OS: hPrismOs },
            hBase: { OD: hBaseOd, OS: hBaseOs },
            vPrism: { OD: vPrismOd, OS: vPrismOs },
            vBase: { OD: vBaseOd, OS: vBaseOs },
            vc: { OD: vcOd, OS: vcOs },
            bcva: { OD: bcvaOd, OS: bcvaOs }
        },
        phorias: {
            distAt: {
                unnamed: distAtUnnamed,
                horizontal: distAtHorizontal,
                vertical: distAtVertical,
                base: distAtBase,
                refEye: distAtRefEye
            },
            nearAt: {
                unnamed: nearAtUnnamed,
                horizontal: nearAtHorizontal,
                vertical: nearAtVertical,
                base: nearAtBase,
                refEye: nearAtRefEye
            },
            method: {
                input1: phoriaMethodInput1,
                input2: phoriaMethodInput2
            }
        },
        nextAppointmentDate: nextAppointmentDate ? (0, otherservices_1.parseDate)(nextAppointmentDate) : null
    };
    // Check if EyeModule exists
    const existingEyeModule = yield (0, eye_module_dao_1.findOneEyeModule)({ patient: _patientId, appointment: _appointmentId }, {});
    let eyeDoc;
    if (existingEyeModule) {
        // If examination already exists, prevent overwrite unless you want update logic
        if (existingEyeModule.examination) {
            return next(new errors_1.ApiError(400, "Examination already exists. schedule another."));
        }
        // Update existing module
        eyeDoc = yield (0, eye_module_dao_1.updateEyeModule)(existingEyeModule._id, {
            examination: examinationData,
            updatedBy: userId
        }, next);
    }
    else {
        const refNumber = generateRefNumber();
        // Create new EyeModule
        const newEyeModule = {
            patient: _patientId,
            ref: refNumber,
            appointment: _appointmentId,
            appointmentid: foundAppointment.appointmentid,
            examination: examinationData,
            createdBy: userId,
        };
        eyeDoc = yield (0, eye_module_dao_1.createEyeService)(newEyeModule);
    }
    if (!eyeDoc) {
        return next(new errors_1.ApiError(500, "Failed to save examination."));
    }
    res.status(201).json({
        status: "success",
        message: "Ophthalmology examination saved successfully",
        eyeDoc
    });
}));
exports.createPreliminaryTest = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, appointmentId, 
    // Visual Acuity Unaided - Far
    vaFarDist, vaFarOd, vaFarOs, vaFarOu, 
    // Visual Acuity Unaided - Near
    vaNearDist, vaNearOd, vaNearOs, vaNearOu, 
    // Visual Acuity Unaided - pH
    vaPhDist, vaPhOd, vaPhOs, vaPhOu, 
    // Visual Acuity Aided - Far
    vaAidedFarOd, vaAidedFarOs, vaAidedFarOu, 
    // Visual Acuity Aided - Near
    vaAidedNearOd, vaAidedNearOs, vaAidedNearOu, 
    // Visual Acuity Aided - pH
    vaAidedPhOd, vaAidedPhOs, vaAidedPhOu, 
    // Counting Fingers
    cfOd, cfOs, 
    // Hand Movement
    hmOd, hmOs, 
    // Light Perception
    lpOd, lpOs, 
    // No Light Perception
    nlpOd, nlpOs, 
    // Light Projection - OD
    lpTopOd, lpBottomOd, lpLeftOd, lpRightOd, 
    // Light Projection - OS
    lpTopOs, lpBottomOs, lpLeftOs, lpRightOs, 
    // Pachymetry
    pachymetryOdName, pachymetryOdDate, pachymetryOsName, pachymetryOsDate, 
    // Tonometry
    tonometryOdName, tonometryOdMethodOrTime, tonometryOsName, tonometryOsMethodOrTime, 
    // Glaucoma Flow Sheet
    glaucomaVisualFieldsOd, glaucomaVisualFieldsOs, glaucomaCupDiskRatioOd, glaucomaCupDiskRatioOs, glaucomaIopOd, glaucomaIopOs, 
    // Pupillary Distance
    pdFarOd, pdFarOs, pdFarOu, pdNearOd, pdNearOs, pdNearOu, 
    // Fields
    fieldsFullOd, fieldsFullOs, fieldsRestrictedOd, fieldsRestrictedOs, 
    // Distance
    distanceReading, distanceWork, 
    // Other fields
    eyeColour, hyperEye, npc, stereopsis, 
    // Dates
    nextAppointmentDate } = req.body;
    const { _id: userId } = req.user.user;
    // Validate required IDs
    if (!patientId)
        return next(new errors_1.ApiError(400, config_1.default.error.errorPatientIdIsRequired));
    if (!appointmentId)
        return next(new errors_1.ApiError(400, "Appointment ID is required"));
    let _patientId, _appointmentId;
    try {
        _patientId = new mongoose_1.default.Types.ObjectId(patientId);
        _appointmentId = new mongoose_1.default.Types.ObjectId(appointmentId);
    }
    catch (err) {
        return next(new errors_1.ApiError(400, "Invalid ID format"));
    }
    // Check if patient and appointment exist
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: _patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new errors_1.ApiError(404, "Patient does not exist."));
    }
    const foundAppointment = yield (0, appointment_1.readoneappointment)({ _id: _appointmentId }, {}, '');
    if (!foundAppointment) {
        return next(new errors_1.ApiError(404, "Appointment does not exist."));
    }
    const preliminaryTestData = {
        visualAcuityUnaided: {
            far: { DIST: vaFarDist, OD: vaFarOd, OS: vaFarOs, OU: vaFarOu },
            near: { DIST: vaNearDist, OD: vaNearOd, OS: vaNearOs, OU: vaNearOu },
            pH: { DIST: vaPhDist, OD: vaPhOd, OS: vaPhOs, OU: vaPhOu },
        },
        visualAcuityAided: {
            far: { OD: vaAidedFarOd, OS: vaAidedFarOs, OU: vaAidedFarOu },
            near: { OD: vaAidedNearOd, OS: vaAidedNearOs, OU: vaAidedNearOu },
            pH: { OD: vaAidedPhOd, OS: vaAidedPhOs, OU: vaAidedPhOu },
        },
        countingFingers: { OD: cfOd, OS: cfOs },
        handMovement: { OD: hmOd, OS: hmOs },
        lightPerception: { OD: lpOd, OS: lpOs },
        noLightPerception: { OD: nlpOd, OS: nlpOs },
        lightProjection: {
            OD: { top: lpTopOd, bottom: lpBottomOd, left: lpLeftOd, right: lpRightOd },
            OS: { top: lpTopOs, bottom: lpBottomOs, left: lpLeftOs, right: lpRightOs }
        },
        pachymetry: {
            OD: { name: pachymetryOdName, date: pachymetryOdDate ? (0, otherservices_1.parseDate)(pachymetryOdDate) : null },
            OS: { name: pachymetryOsName, date: pachymetryOsDate ? (0, otherservices_1.parseDate)(pachymetryOsDate) : null }
        },
        tonometry: {
            OD: { name: tonometryOdName, methodOrTime: tonometryOdMethodOrTime ? tonometryOdMethodOrTime : null },
            OS: { name: tonometryOsName, methodOrTime: tonometryOsMethodOrTime ? tonometryOsMethodOrTime : null }
        },
        glaucomaFlowsheet: {
            visualFields: { OD: glaucomaVisualFieldsOd, OS: glaucomaVisualFieldsOs },
            cupDiskRatio: { OD: glaucomaCupDiskRatioOd, OS: glaucomaCupDiskRatioOs },
            iop: { OD: glaucomaIopOd, OS: glaucomaIopOs }
        },
        pupillaryDistance: {
            far: { OD: pdFarOd, OS: pdFarOs, OU: pdFarOu },
            near: { OD: pdNearOd, OS: pdNearOs, OU: pdNearOu }
        },
        fieldsFull: { OD: fieldsFullOd, OS: fieldsFullOs },
        fieldsRestricted: { OD: fieldsRestrictedOd, OS: fieldsRestrictedOs },
        distance: {
            reading: distanceReading,
            work: distanceWork
        },
        eyeColour,
        hyperEye,
        npc,
        stereopsis,
        nextAppointmentDate: nextAppointmentDate ? (0, otherservices_1.parseDate)(nextAppointmentDate) : null
    };
    // Check if EyeModule exists
    const existingEyeModule = yield (0, eye_module_dao_1.findOneEyeModule)({ patient: _patientId, appointment: _appointmentId }, {});
    let eyeDoc;
    if (existingEyeModule) {
        // Prevent overwrite if test already exists (optional — you may allow update)
        if (existingEyeModule.preliminaryTest) {
            return next(new errors_1.ApiError(400, "Preliminary test already exists. schedule another one."));
        }
        // Update existing module
        eyeDoc = yield (0, eye_module_dao_1.updateEyeModule)(existingEyeModule._id, {
            preliminaryTest: preliminaryTestData,
            updatedBy: userId
        }, next);
    }
    else {
        const refNumber = generateRefNumber();
        // Create new EyeModule
        const newEyeModule = {
            patient: _patientId,
            ref: refNumber,
            appointment: _appointmentId,
            appointmentid: foundAppointment.appointmentid,
            preliminaryTest: preliminaryTestData,
            createdBy: userId,
            updatedBy: userId
        };
        eyeDoc = yield (0, eye_module_dao_1.createEyeService)(newEyeModule);
    }
    if (!eyeDoc) {
        return next(new errors_1.ApiError(500, "Failed to save preliminary test."));
    }
    res.status(201).json({
        status: "success",
        message: "Preliminary test recorded successfully",
        data: eyeDoc
    });
}));
exports.createOperationalNotes = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /// this is for the media files
    const { patientId, appointmentId } = req.params;
    const files = req.files;
    const { _id: userId } = (req.user).user;
    // Validate required IDs
    if (!patientId)
        return next(new errors_1.ApiError(400, config_1.default.error.errorPatientIdIsRequired));
    if (!appointmentId)
        return next(new errors_1.ApiError(400, "Appointment ID is required"));
    let _patientId, _appointmentId;
    try {
        _patientId = new mongoose_1.default.Types.ObjectId(patientId);
        _appointmentId = new mongoose_1.default.Types.ObjectId(appointmentId);
    }
    catch (err) {
        return next(new errors_1.ApiError(400, "Invalid ID format"));
    }
    // Check if patient and appointment exist
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: _patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new errors_1.ApiError(404, "Patient does not exist."));
    }
    const foundAppointment = yield (0, appointment_1.readoneappointment)({ _id: _appointmentId }, {}, '');
    if (!foundAppointment) {
        return next(new errors_1.ApiError(404, "Appointment does not exist."));
    }
    if (!files || files.length === 0) {
        return next(new errors_1.ApiError(400, "no files uploaed"));
    }
    const allowedTypes = eye_modules_1.OperationalNotesFileName.map(el => el.name);
    const uploadedTests = [];
    const uploadPath = path.join(process.cwd(), config_1.default.useruploaddirectory);
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
    yield promises_1.default.mkdir(uploadPath, { recursive: true });
    for (const [resultType, fileEntry] of Object.entries(files)) {
        // Validate resultType
        if (!allowedTypes.includes(resultType)) {
            return next(new errors_1.ApiError(400, `Invalid test type: ${resultType}`));
        }
        // Normalize: handle single file or array
        const fileList = Array.isArray(fileEntry) ? fileEntry : [fileEntry];
        for (const file of fileList) {
            const { name: originalName } = file;
            const newFileName = !originalName ? `anon_${resultType}` : originalName.replace(/\s+/g, '');
            // Generate unique filename
            const filename = `${newFileName}_${(0, uuid_1.v4)()}`;
            const extension = path.extname(originalName).toLowerCase();
            try {
                // Use your existing upload function
                yield (0, otherservices_1.uploaddocument)(file, filename, allowedExtensions, uploadPath);
                // Build public URL
                const fileUrl = `/${config_1.default.useruploaddirectory}/${filename}${extension}`;
                // Add to operational test list
                uploadedTests.push({
                    resultType,
                    fileUrl,
                    uploadedBy: userId,
                    uploadedAt: new Date()
                });
            }
            catch (uploadError) {
                // Log error if needed
                return next(new errors_1.ApiError(500, `File upload failed: ${uploadError.message}`));
            }
        }
    }
    //console.log(uploadedTests);
    //console.log(files);
    const existingEyeModule = yield (0, eye_module_dao_1.findOneEyeModule)({ patient: _patientId, appointment: _appointmentId }, {});
    let updatedDoc;
    if (existingEyeModule) {
        // Append new tests
        updatedDoc = yield (0, eye_module_dao_1.updateEyeModule)(existingEyeModule._id, {
            $push: {
                operationalTest: { $each: uploadedTests }
            },
            updatedBy: userId
        }, next);
    }
    else {
        const refNumber = generateRefNumber();
        // Create new EyeModule
        updatedDoc = yield (0, eye_module_dao_1.createEyeService)({
            patient: _patientId,
            ref: refNumber,
            appointment: _appointmentId,
            appointmentid: foundAppointment.appointmentid,
            operationalTest: uploadedTests,
            createdBy: userId,
            updatedBy: userId
        });
    }
    if (!updatedDoc) {
        return next(new errors_1.ApiError(500, "Failed to save operational notes"));
    }
    res.status(201).json({
        status: "success",
        message: "Operational notes and files uploaded successfully",
        data: updatedDoc
    });
}));
exports.getEyeRecordByAppointmentIdAndPatientId = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, appointmentId } = req.params;
    // Validate required IDs
    if (!patientId)
        return next(new errors_1.ApiError(400, config_1.default.error.errorPatientIdIsRequired));
    if (!appointmentId)
        return next(new errors_1.ApiError(400, "Appointment ID is required"));
    let _patientId, _appointmentId;
    try {
        _patientId = new mongoose_1.default.Types.ObjectId(patientId);
        _appointmentId = new mongoose_1.default.Types.ObjectId(appointmentId);
    }
    catch (err) {
        return next(new errors_1.ApiError(400, "Invalid ID format"));
    }
    // Check if patient and appointment exist
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: _patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new errors_1.ApiError(404, "Patient does not exist."));
    }
    const foundAppointment = yield (0, appointment_1.readoneappointment)({ _id: _appointmentId }, {}, '');
    if (!foundAppointment) {
        return next(new errors_1.ApiError(404, "Appointment does not exist."));
    }
    const doc = yield (0, eye_module_dao_1.findOneEyeModule)({ patient: _patientId, appointment: _appointmentId }, {});
    if (!doc)
        return next(new errors_1.ApiError(404, `no record was found with patient id ${patientId} and appointmentId`));
    res.status(200).json({
        status: "success",
        message: "Eye record fetched successfully",
        data: doc
    });
}));
exports.getEyeRecordById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { Id } = req.params;
    // Validate required IDs
    if (!Id)
        return next(new errors_1.ApiError(400, config_1.default.error.errorIdIsRequired));
    let _id;
    try {
        _id = new mongoose_1.default.Types.ObjectId(Id);
    }
    catch (err) {
        return next(new errors_1.ApiError(400, "Invalid ID format"));
    }
    const doc = yield (0, eye_module_dao_1.findOneEyeModule)({ _id: _id }, {});
    if (!doc)
        return next(new errors_1.ApiError(404, `no eye record was found with id ${Id}`));
    res.status(200).json({
        status: "success",
        message: "Eye record fetched successfully",
        data: doc
    });
}));
exports.getAllEyeRecords = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page || '1') || 1;
    const limit = parseInt(req.query.limit || '100') || 100;
    const doc = yield (0, eye_module_dao_1.getAllEyeRecordpaginated)([], page, limit);
    res.status(200).json({
        status: "success",
        message: "all Eye record fetched successfully",
        data: doc
    });
}));
exports.getAllEyeUtilData = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        status: "success",
        message: "eye module config",
        data: {
            OperationalNotesFileName: eye_modules_1.OperationalNotesFileName, LensTint: eye_modules_1.LensTint, lensType: eye_modules_1.lensType, slitLamp: eye_modules_1.slitLamp, opthalmoscopy: eye_modules_1.opthalmoscopy, refraction: eye_modules_1.refraction
        }
    });
}));
exports.getAllEyeRecordsPaginatedHandler = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.default)(req.query, [
        "sortBy",
        "limit",
        "page",
        "projectBy",
    ]);
    let { status } = req.query;
    let queryCriteria = {};
    if (status)
        queryCriteria.status = status;
    const result = yield (0, eye_module_dao_1.queryEyeRecordsPaginated)(queryCriteria, options);
    res.status(200).json({
        status: true,
        data: result,
    });
}));
exports.updateLensPrescription = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eyeModuleId } = req.params;
    const { rightsphere, rightcyl, rightaxis, rightprism, rightva, leftsphere, leftcyl, leftaxis, leftprism, leftva, addright, addleft, ipdnear, ipddist, lensTint, lensSize, segHt, temple, lensType, frame, colour, remarks, nextExamDate, nextAppointmentDate } = req.body;
    const { _id: userId } = (req.user).user;
    // Validate ID
    if (!mongoose_1.default.Types.ObjectId.isValid(eyeModuleId)) {
        return next(new errors_1.ApiError(400, "Invalid EyeModule ID"));
    }
    // Build update object
    const updateData = {
        optometryLensPrescription: {
            distance: {
                right: { sphere: rightsphere, cyl: rightcyl, axis: rightaxis, prism: rightprism, va: rightva },
                left: { sphere: leftsphere, cyl: leftcyl, axis: leftaxis, prism: leftprism, va: leftva }
            },
            add: { right: addright, left: addleft },
            ipd: { near: ipdnear, dist: ipddist },
            lensTint,
            lensSize,
            segHt,
            temple,
            lensType,
            frame,
            colour,
            remarks,
            nextExamDate: nextExamDate ? (0, otherservices_1.parseDate)(nextExamDate) : null,
            nextAppointmentDate: nextAppointmentDate ? (0, otherservices_1.parseDate)(nextAppointmentDate) : null
        },
        updatedBy: userId
    };
    const updatedDoc = yield (0, eye_module_dao_1.updateEyeModule)(eyeModuleId, updateData, next);
    if (!updatedDoc) {
        return next(new errors_1.ApiError(404, "EyeModule not found"));
    }
    res.status(200).json({
        status: "success",
        message: "Lens prescription updated successfully",
        data: updatedDoc
    });
}));
exports.updatePreliminaryTest = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eyeModuleId } = req.params;
    const { 
    // Visual Acuity Unaided - Far
    vaFarDist, vaFarOd, vaFarOs, vaFarOu, 
    // Visual Acuity Unaided - Near
    vaNearDist, vaNearOd, vaNearOs, vaNearOu, 
    // Visual Acuity Unaided - pH
    vaPhDist, vaPhOd, vaPhOs, vaPhOu, 
    // Visual Acuity Aided - Far
    vaAidedFarOd, vaAidedFarOs, vaAidedFarOu, 
    // Visual Acuity Aided - Near
    vaAidedNearOd, vaAidedNearOs, vaAidedNearOu, 
    // Visual Acuity Aided - pH
    vaAidedPhOd, vaAidedPhOs, vaAidedPhOu, 
    // Counting Fingers
    cfOd, cfOs, 
    // Hand Movement
    hmOd, hmOs, 
    // Light Perception
    lpOd, lpOs, 
    // No Light Perception
    nlpOd, nlpOs, 
    // Light Projection - OD
    lpTopOd, lpBottomOd, lpLeftOd, lpRightOd, 
    // Light Projection - OS
    lpTopOs, lpBottomOs, lpLeftOs, lpRightOs, 
    // Pachymetry
    pachymetryOdName, pachymetryOdDate, pachymetryOsName, pachymetryOsDate, 
    // Tonometry
    tonometryOdName, tonometryOdMethodOrTime, tonometryOsName, tonometryOsMethodOrTime, 
    // Glaucoma Flow Sheet
    glaucomaVisualFieldsOd, glaucomaVisualFieldsOs, glaucomaCupDiskRatioOd, glaucomaCupDiskRatioOs, glaucomaIopOd, glaucomaIopOs, 
    // Pupillary Distance
    pdFarOd, pdFarOs, pdFarOu, pdNearOd, pdNearOs, pdNearOu, 
    // Fields
    fieldsFullOd, fieldsFullOs, fieldsRestrictedOd, fieldsRestrictedOs, 
    // Distance
    distanceReading, distanceWork, 
    // Other fields
    eyeColour, hyperEye, npc, stereopsis, 
    // Dates
    nextAppointmentDate } = req.body;
    const { _id: userId } = (req.user).user;
    if (!mongoose_1.default.Types.ObjectId.isValid(eyeModuleId)) {
        return next(new errors_1.ApiError(400, "Invalid EyeModule ID"));
    }
    const updateData = {
        preliminaryTest: {
            visualAcuityUnaided: {
                far: { DIST: vaFarDist, OD: vaFarOd, OS: vaFarOs, OU: vaFarOu },
                near: { DIST: vaNearDist, OD: vaNearOd, OS: vaNearOs, OU: vaNearOu },
                pH: { DIST: vaPhDist, OD: vaPhOd, OS: vaPhOs, OU: vaPhOu },
            },
            visualAcuityAided: {
                far: { OD: vaAidedFarOd, OS: vaAidedFarOs, OU: vaAidedFarOu },
                near: { OD: vaAidedNearOd, OS: vaAidedNearOs, OU: vaAidedNearOu },
                pH: { OD: vaAidedPhOd, OS: vaAidedPhOs, OU: vaAidedPhOu },
            },
            countingFingers: { OD: cfOd, OS: cfOs },
            handMovement: { OD: hmOd, OS: hmOs },
            lightPerception: { OD: lpOd, OS: lpOs },
            noLightPerception: { OD: nlpOd, OS: nlpOs },
            lightProjection: {
                OD: { top: lpTopOd, bottom: lpBottomOd, left: lpLeftOd, right: lpRightOd },
                OS: { top: lpTopOs, bottom: lpBottomOs, left: lpLeftOs, right: lpRightOs }
            },
            pachymetry: {
                OD: { name: pachymetryOdName, date: pachymetryOdDate ? (0, otherservices_1.parseDate)(pachymetryOdDate) : null },
                OS: { name: pachymetryOsName, date: pachymetryOsDate ? (0, otherservices_1.parseDate)(pachymetryOsDate) : null }
            },
            tonometry: {
                OD: { name: tonometryOdName, methodOrTime: tonometryOdMethodOrTime ? tonometryOdMethodOrTime : null },
                OS: { name: tonometryOsName, methodOrTime: tonometryOsMethodOrTime ? tonometryOsMethodOrTime : null }
            },
            glaucomaFlowsheet: {
                visualFields: { OD: glaucomaVisualFieldsOd, OS: glaucomaVisualFieldsOs },
                cupDiskRatio: { OD: glaucomaCupDiskRatioOd, OS: glaucomaCupDiskRatioOs },
                iop: { OD: glaucomaIopOd, OS: glaucomaIopOs }
            },
            pupillaryDistance: {
                far: { OD: pdFarOd, OS: pdFarOs, OU: pdFarOu },
                near: { OD: pdNearOd, OS: pdNearOs, OU: pdNearOu }
            },
            fieldsFull: { OD: fieldsFullOd, OS: fieldsFullOs },
            fieldsRestricted: { OD: fieldsRestrictedOd, OS: fieldsRestrictedOs },
            distance: {
                reading: distanceReading,
                work: distanceWork
            },
            eyeColour,
            hyperEye,
            npc,
            stereopsis,
            nextAppointmentDate: nextAppointmentDate ? (0, otherservices_1.parseDate)(nextAppointmentDate) : null
        },
        updatedBy: userId
    };
    const updatedDoc = yield (0, eye_module_dao_1.updateEyeModule)(eyeModuleId, updateData, next);
    if (!updatedDoc) {
        return next(new errors_1.ApiError(404, "EyeModule not found"));
    }
    res.status(200).json({
        status: "success",
        message: "Preliminary test updated successfully",
        data: updatedDoc
    });
}));
exports.updateExamination = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eyeModuleId } = req.params;
    const { 
    // Slit Lamp
    adnexaOd, adnexaOs, lidsOd, lidsOs, tearBreakOd, tearBreakOs, conjunctivaOd, conjunctivaOs, corneaOd, corneaOs, antChamberOd, antChamberOs, depthOd, depthOs, cellsOd, cellsOs, flareOd, flareOs, irisOd, irisOs, colourOd, colourOs, anglesOd, anglesOs, pupilOd, pupilOs, lensOd, lensOs, clarityOd, clarityOs, antCapsOd, antCapsOs, postCapsOd, postCapsOs, cortexOd, cortexOs, nucleusOd, nucleusOs, 
    // Ophthalmoscopy
    opticDiscOd, opticDiscOs, sizeOd, sizeOs, ratioOd, ratioOs, appearanceOd, appearanceOs, nerveFiberOd, nerveFiberOs, retinaOd, retinaOs, maculaOd, maculaOs, postRetinaOd, postRetinaOs, vesselsOd, vesselsOs, peripheryOd, peripheryOs, vitreousOd, vitreousOs, 
    // Refraction
    sphereOd, sphereOs, cylOd, cylOs, axisOd, axisOs, addOd, addOs, hPrismOd, hPrismOs, hBaseOd, hBaseOs, vPrismOd, vPrismOs, vBaseOd, vBaseOs, vcOd, vcOs, bcvaOd, bcvaOs, 
    // Phorias
    distAtUnnamed, distAtHorizontal, distAtVertical, distAtBase, distAtRefEye, nearAtUnnamed, nearAtHorizontal, nearAtVertical, nearAtBase, nearAtRefEye, phoriaMethodInput1, phoriaMethodInput2, 
    // Dates
    nextAppointmentDate } = req.body;
    const { _id: userId } = (req.user).user;
    if (!mongoose_1.default.Types.ObjectId.isValid(eyeModuleId)) {
        return next(new errors_1.ApiError(400, "Invalid EyeModule ID"));
    }
    const updateData = {
        examination: {
            slitLamp: {
                adnexa: { OD: adnexaOd, OS: adnexaOs },
                lids: { OD: lidsOd, OS: lidsOs },
                tearBreak: { OD: tearBreakOd, OS: tearBreakOs },
                conjunctiva: { OD: conjunctivaOd, OS: conjunctivaOs },
                cornea: { OD: corneaOd, OS: corneaOs },
                antChamber: { OD: antChamberOd, OS: antChamberOs },
                depth: { OD: depthOd, OS: depthOs },
                cells: { OD: cellsOd, OS: cellsOs },
                flare: { OD: flareOd, OS: flareOs },
                iris: { OD: irisOd, OS: irisOs },
                colour: { OD: colourOd, OS: colourOs },
                angles: { OD: anglesOd, OS: anglesOs },
                pupil: { OD: pupilOd, OS: pupilOs },
                lens: { OD: lensOd, OS: lensOs },
                clarity: { OD: clarityOd, OS: clarityOs },
                antCaps: { OD: antCapsOd, OS: antCapsOs },
                postCaps: { OD: postCapsOd, OS: postCapsOs },
                cortex: { OD: cortexOd, OS: cortexOs },
                nucleus: { OD: nucleusOd, OS: nucleusOs }
            },
            ophthalmoscopy: {
                opticDisc: { OD: opticDiscOd, OS: opticDiscOs },
                size: { OD: sizeOd, OS: sizeOs },
                ratio: { OD: ratioOd, OS: ratioOs },
                appearance: { OD: appearanceOd, OS: appearanceOs },
                nerveFiber: { OD: nerveFiberOd, OS: nerveFiberOs },
                retina: { OD: retinaOd, OS: retinaOs },
                macula: { OD: maculaOd, OS: maculaOs },
                postRetina: { OD: postRetinaOd, OS: postRetinaOs },
                vessels: { OD: vesselsOd, OS: vesselsOs },
                periphery: { OD: peripheryOd, OS: peripheryOs },
                vitreous: { OD: vitreousOd, OS: vitreousOs }
            },
            refraction: {
                sphere: { OD: sphereOd, OS: sphereOs },
                cyl: { OD: cylOd, OS: cylOs },
                axis: { OD: axisOd, OS: axisOs },
                add: { OD: addOd, OS: addOs },
                hPrism: { OD: hPrismOd, OS: hPrismOs },
                hBase: { OD: hBaseOd, OS: hBaseOs },
                vPrism: { OD: vPrismOd, OS: vPrismOs },
                vBase: { OD: vBaseOd, OS: vBaseOs },
                vc: { OD: vcOd, OS: vcOs },
                bcva: { OD: bcvaOd, OS: bcvaOs }
            },
            phorias: {
                distAt: {
                    unnamed: distAtUnnamed,
                    horizontal: distAtHorizontal,
                    vertical: distAtVertical,
                    base: distAtBase,
                    refEye: distAtRefEye
                },
                nearAt: {
                    unnamed: nearAtUnnamed,
                    horizontal: nearAtHorizontal,
                    vertical: nearAtVertical,
                    base: nearAtBase,
                    refEye: nearAtRefEye
                },
                method: {
                    input1: phoriaMethodInput1,
                    input2: phoriaMethodInput2
                }
            },
            nextAppointmentDate: nextAppointmentDate ? (0, otherservices_1.parseDate)(nextAppointmentDate) : null
        },
        updatedBy: userId
    };
    const updatedDoc = yield (0, eye_module_dao_1.updateEyeModule)(eyeModuleId, updateData, next);
    if (!updatedDoc) {
        return next(new errors_1.ApiError(404, "EyeModule not found"));
    }
    res.status(200).json({
        status: "success",
        message: "Examination updated successfully",
        data: updatedDoc
    });
}));
exports.updateOperationalTest = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eyeModuleId } = req.params;
    const files = req.files;
    const { _id: userId } = (req.user).user;
    if (!mongoose_1.default.Types.ObjectId.isValid(eyeModuleId)) {
        return next(new errors_1.ApiError(400, "Invalid EyeModule ID"));
    }
    const allowedTypes = eye_modules_1.OperationalNotesFileName.map(el => el.name);
    const uploadedTests = [];
    const uploadPath = path.join(process.cwd(), config_1.default.useruploaddirectory);
    yield promises_1.default.mkdir(uploadPath, { recursive: true });
    for (const [resultType, fileEntry] of Object.entries(files)) {
        if (!allowedTypes.includes(resultType))
            continue;
        const fileList = Array.isArray(fileEntry) ? fileEntry : [fileEntry];
        for (const file of fileList) {
            const { name: originalName } = file;
            const newFileName = !originalName ? `anon_${resultType}` : originalName.replace(/\s+/g, '');
            // Generate unique filename
            const filename = `${newFileName}_${(0, uuid_1.v4)()}`;
            const extension = path.extname(file.name).toLowerCase();
            try {
                yield (0, otherservices_1.uploaddocument)(file, filename, ['.jpg', '.jpeg', '.png', '.pdf'], uploadPath);
                uploadedTests.push({
                    resultType,
                    fileUrl: `/${config_1.default.useruploaddirectory}/${filename}${extension}`,
                    uploadedBy: userId
                });
            }
            catch (err) {
                return next(new errors_1.ApiError(500, `Upload failed: ${err.message}`));
            }
        }
    }
    const updatedDoc = yield (0, eye_module_dao_1.updateEyeModule)(eyeModuleId, { operationalTest: uploadedTests, updatedBy: userId }, next);
    if (!updatedDoc) {
        return next(new errors_1.ApiError(404, "EyeModule not found"));
    }
    res.status(200).json({
        status: "success",
        message: "Operational tests updated successfully",
        data: updatedDoc
    });
}));
exports.getEyeRecordByPatientId = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId } = req.params;
    // Validate required IDs
    if (!patientId)
        return next(new errors_1.ApiError(400, config_1.default.error.errorPatientIdIsRequired));
    let _patientId;
    try {
        _patientId = new mongoose_1.default.Types.ObjectId(patientId);
    }
    catch (err) {
        return next(new errors_1.ApiError(400, "Invalid ID format"));
    }
    // Check if patient and appointment exist
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: _patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new errors_1.ApiError(404, "Patient does not exist."));
    }
    const doc = yield (0, eye_module_dao_1.findEyeModule)({ patient: _patientId }, {});
    if (!doc)
        return next(new errors_1.ApiError(404, `no record was found with patient id ${patientId} and appointmentId`));
    res.status(200).json({
        status: "success",
        message: "Eye record fetched successfully",
        data: doc
    });
}));
