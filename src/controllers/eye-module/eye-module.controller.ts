import fs from 'fs/promises';
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import catchAsync from "../../utils/catchAsync";
import { ApiError } from "../../errors";
import configuration from "../../config";
import { readonepatient } from "../../dao/patientmanagement";
import { readoneappointment } from "../../dao/appointment";
import { parseDate, uploaddocument } from "../../utils/otherservices";
import { createEyeService, findOneEyeModule, updateEyeModule, getAllEyeRecordpaginated, queryEyeRecordsPaginated } from "../../dao/eye-module.dao";
import { OperationalNotesFileName, LensTint, lensType } from "../../config/eye-modules";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { IOptions } from '../../paginate/paginate';
import pick from '../../utils/pick';

const validatePatientAndAppointment = async (patientId: string, appointmentId: string, next: NextFunction) => {
    if (!patientId) return next(new ApiError(400, "Patient ID is required"));
    if (!appointmentId) return next(new ApiError(400, "Appointment ID is required"));

    const patient = await readonepatient({ _id: patientId }, {}, "", "");
    if (!patient) return next(new ApiError(404, "Patient does not exist"));

    const appointment = await readoneappointment({ _id: appointmentId }, {}, "");
    if (!appointment) return next(new ApiError(404, "Appointment does not exist"));

    return { patient, appointment };
};

export const createEyeModule = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const { patientId, lensPrescription, examination, preliminaryTest, operationalTest } = req.body;

    const { _id: userId } = (req.user).user;
    if (!patientId) return next(new ApiError(400, configuration.error.errorPatientIdIsRequiredF));

    const _patientId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(patientId);

    const foundPatient: any = await readonepatient({ _id: patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new ApiError(404, `Patient do not ${configuration.error.erroralreadyexit}`));
    }
    const newEyeModule = {
        patient: patientId,
        optometryLensPrescription: lensPrescription,
        examination,
        preliminaryTest,
        operationalTest,
        createdBy: userId
    }
});

export const createLensPrescription = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const { patientId, appointmentId,
        rightsphere, rightcyl, rightaxis, rightprism, rightva,
        leftsphere, leftcyl, leftaxis, leftprism, leftva,
        addright, addleft,
        ipdnear, ipddist,
        lensTint, lensSize, segHt, temple, lensType, frame, colour, remarks,
        nextExamDate, nextAppointmentDate
    } = req.body;

    const { _id: userId } = (req.user).user;
    if (!patientId) return next(new ApiError(400, configuration.error.errorPatientIdIsRequired));
    if (!appointmentId) return next(new ApiError(400, "appointment id is required"));

    const _patientId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(patientId);
    const _appointmentId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(appointmentId);

    const foundPatient: any = await readonepatient({ _id: patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new ApiError(404, `Patient do not ${configuration.error.erroralreadyexit}`));
    }

    const foundAppointment: any = await readoneappointment({ _id: appointmentId }, {}, '');
    if (!foundAppointment) {
        return next(new ApiError(404, `appointment do not ${configuration.error.erroralreadyexit}`));
    }

    /// first check if eye module instance aleady exist if not create one
    /// if it do check if eyeModule.optometryLensPrescription is null if its null update but if it exist ask user to update lens prescription
    const existingEyeModule = await findOneEyeModule({ patient: patientId, appointment: appointmentId }, {});

    let eyeDoc: any = {};

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
        nextExamDate: nextExamDate ? parseDate(nextExamDate) : null,
        nextAppointmentDate: nextAppointmentDate ? parseDate(nextAppointmentDate) : null
    };

    if (existingEyeModule) {
        if (existingEyeModule.optometryLensPrescription) {
            return next(new ApiError(400, "Lens prescription already exists. Please use the update function instead."));
        }

        eyeDoc = await updateEyeModule(
            existingEyeModule._id,
            {
                optometryLensPrescription: lensPrescriptionData,
                updatedBy: userId
            },
            next
        );
    } else {
        const newEyeModule = {
            patient: patientId,
            appointment: _appointmentId,
            appointmentid: foundAppointment.appointmentid,
            optometryLensPrescription: lensPrescriptionData,
            createdBy: userId
        }

        eyeDoc = await createEyeService(newEyeModule);
    }

    if (!eyeDoc) return next(new ApiError(404, "something went wrong"));

    return res.status(201).json({
        status: "success",
        data: eyeDoc
    });
});

export const createExamination = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const { patientId,
        appointmentId,
        // Slit Lamp
        adnexaOd, adnexaOs,
        lidsOd, lidsOs,
        tearBreakOd, tearBreakOs,
        conjunctivaOd, conjunctivaOs,
        corneaOd, corneaOs,
        antChamberOd, antChamberOs,
        depthOd, depthOs,
        cellsOd, cellsOs,
        flareOd, flareOs,
        irisOd, irisOs,
        colourOd, colourOs,
        anglesOd, anglesOs,
        pupilOd, pupilOs,
        lensOd, lensOs,
        clarityOd, clarityOs,
        antCapsOd, antCapsOs,
        postCapsOd, postCapsOs,
        cortexOd, cortexOs,
        nucleusOd, nucleusOs,

        // Ophthalmoscopy
        opticDiscOd, opticDiscOs,
        sizeOd, sizeOs,
        ratioOd, ratioOs,
        appearanceOd, appearanceOs,
        nerveFiberOd, nerveFiberOs,
        retinaOd, retinaOs,
        maculaOd, maculaOs,
        postRetinaOd, postRetinaOs,
        vesselsOd, vesselsOs,
        peripheryOd, peripheryOs,
        vitreousOd, vitreousOs,

        // Refraction
        sphereOd, sphereOs,
        cylOd, cylOs,
        axisOd, axisOs,
        addOd, addOs,
        hPrismOd, hPrismOs,
        hBaseOd, hBaseOs,
        vPrismOd, vPrismOs,
        vBaseOd, vBaseOs,
        vcOd, vcOs,
        bcvaOd, bcvaOs,

        // Phorias
        distAtUnnamed, distAtHorizontal, distAtVertical, distAtBase, distAtRefEye,
        nearAtUnnamed, nearAtHorizontal, nearAtVertical, nearAtBase, nearAtRefEye,
        phoriaMethodInput1, phoriaMethodInput2,

        // Dates
        nextAppointmentDate
    } = req.body;

    const { _id: userId } = (req.user as any).user;

    if (!patientId) return next(new ApiError(400, configuration.error.errorPatientIdIsRequired));
    if (!appointmentId) return next(new ApiError(400, "Appointment ID is required"));

    let _patientId, _appointmentId;
    try {
        _patientId = new mongoose.Types.ObjectId(patientId);
        _appointmentId = new mongoose.Types.ObjectId(appointmentId);
    } catch (err) {
        return next(new ApiError(400, "Invalid ID format"));
    }

    const foundPatient = await readonepatient({ _id: _patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new ApiError(404, `Patient does not exist.`));
    }

    const foundAppointment = await readoneappointment({ _id: _appointmentId }, {}, '');
    if (!foundAppointment) {
        return next(new ApiError(404, `Appointment does not exist.`));
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
        nextAppointmentDate: nextAppointmentDate ? parseDate(nextAppointmentDate) : null
    };

    // Check if EyeModule exists
    const existingEyeModule = await findOneEyeModule({ patient: _patientId, appointment: _appointmentId }, {});

    let eyeDoc: any;

    if (existingEyeModule) {
        // If examination already exists, prevent overwrite unless you want update logic
        if (existingEyeModule.examination) {
            return next(new ApiError(400, "Examination already exists. Use update instead."));
        }

        // Update existing module
        eyeDoc = await updateEyeModule(existingEyeModule._id, {
            examination: examinationData,
            updatedBy: userId
        }, next);
    } else {
        // Create new EyeModule
        const newEyeModule = {
            patient: _patientId,
            appointment: _appointmentId,
            appointmentid: foundAppointment.appointmentid,
            examination: examinationData,
            createdBy: userId,
        };

        eyeDoc = await createEyeService(newEyeModule);
    }

    if (!eyeDoc) {
        return next(new ApiError(500, "Failed to save examination."));
    }

    res.status(201).json({
        status: "success",
        message: "Ophthalmology examination saved successfully",
        eyeDoc
    });

});

export const createPreliminaryTest = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const {
        patientId,
        appointmentId,

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
        pachymetryOdName, pachymetryOdDate,
        pachymetryOsName, pachymetryOsDate,

        // Tonometry
        tonometryOdName, tonometryOdMethodOrTime,
        tonometryOsName, tonometryOsMethodOrTime,

        // Glaucoma Flow Sheet
        glaucomaVisualFieldsOd, glaucomaVisualFieldsOs,
        glaucomaCupDiskRatioOd, glaucomaCupDiskRatioOs,
        glaucomaIopOd, glaucomaIopOs,

        // Pupillary Distance
        pdFarOd, pdFarOs, pdFarOu,
        pdNearOd, pdNearOs, pdNearOu,

        // Fields
        fieldsFullOd, fieldsFullOs,
        fieldsRestrictedOd, fieldsRestrictedOs,

        // Distance
        distanceReading, distanceWork,

        // Other fields
        eyeColour,
        hyperEye,
        npc,
        stereopsis,

        // Dates
        nextAppointmentDate
    } = req.body;

    const { _id: userId } = (req.user as any).user;

    // Validate required IDs
    if (!patientId) return next(new ApiError(400, configuration.error.errorPatientIdIsRequired));
    if (!appointmentId) return next(new ApiError(400, "Appointment ID is required"));

    let _patientId, _appointmentId;
    try {
        _patientId = new mongoose.Types.ObjectId(patientId);
        _appointmentId = new mongoose.Types.ObjectId(appointmentId);
    } catch (err) {
        return next(new ApiError(400, "Invalid ID format"));
    }

    // Check if patient and appointment exist
    const foundPatient = await readonepatient({ _id: _patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new ApiError(404, "Patient does not exist."));
    }

    const foundAppointment = await readoneappointment({ _id: _appointmentId }, {}, '');
    if (!foundAppointment) {
        return next(new ApiError(404, "Appointment does not exist."));
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
            OD: { name: pachymetryOdName, date: pachymetryOdDate ? parseDate(pachymetryOdDate) : null },
            OS: { name: pachymetryOsName, date: pachymetryOsDate ? parseDate(pachymetryOsDate) : null }
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
        nextAppointmentDate: nextAppointmentDate ? parseDate(nextAppointmentDate) : null
    };
    // Check if EyeModule exists
    const existingEyeModule = await findOneEyeModule({ patient: _patientId, appointment: _appointmentId }, {});

    let eyeDoc: any;

    if (existingEyeModule) {
        // Prevent overwrite if test already exists (optional — you may allow update)
        if (existingEyeModule.preliminaryTest) {
            return next(new ApiError(400, "Preliminary test already exists. Use update instead."));
        }

        // Update existing module
        eyeDoc = await updateEyeModule(existingEyeModule._id, {
            preliminaryTest: preliminaryTestData,
            updatedBy: userId
        }, next);
    } else {
        // Create new EyeModule
        const newEyeModule = {
            patient: _patientId,
            appointment: _appointmentId,
            appointmentid: foundAppointment.appointmentid,
            preliminaryTest: preliminaryTestData,
            createdBy: userId,
            updatedBy: userId
        };

        eyeDoc = await createEyeService(newEyeModule);
    }

    if (!eyeDoc) {
        return next(new ApiError(500, "Failed to save preliminary test."));
    }

    res.status(201).json({
        status: "success",
        message: "Preliminary test recorded successfully",
        data: eyeDoc
    });
});

export const createOperationalNotes = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    /// this is for the media files
    const { patientId, appointmentId } = req.params;

    const files = req.files as any;

    const { _id: userId } = (req.user).user;

    // Validate required IDs
    if (!patientId) return next(new ApiError(400, configuration.error.errorPatientIdIsRequired));
    if (!appointmentId) return next(new ApiError(400, "Appointment ID is required"));

    let _patientId, _appointmentId;
    try {
        _patientId = new mongoose.Types.ObjectId(patientId);
        _appointmentId = new mongoose.Types.ObjectId(appointmentId);
    } catch (err) {
        return next(new ApiError(400, "Invalid ID format"));
    }

    // Check if patient and appointment exist
    const foundPatient = await readonepatient({ _id: _patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new ApiError(404, "Patient does not exist."));
    }

    const foundAppointment = await readoneappointment({ _id: _appointmentId }, {}, '');
    if (!foundAppointment) {
        return next(new ApiError(404, "Appointment does not exist."));
    }

    if (!files || files.length === 0) {
        return next(new ApiError(400, "no files uploaed"));
    }

    const allowedTypes = OperationalNotesFileName.map(el => el.name);
    const uploadedTests = [];

    const protocol = req.get('X-Forwarded-Proto') || req.protocol;
    const baseUrl = `${protocol}://${req.get('Host')}`;
    const uploadPath = path.join(process.cwd(), configuration.useruploaddirectory);
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];

    await fs.mkdir(uploadPath, { recursive: true });

    for (const [resultType, fileEntry] of Object.entries(files)) {
        // Validate resultType
        if (!allowedTypes.includes(resultType)) {
            return next(new ApiError(400, `Invalid test type: ${resultType}`));
        }

        // Normalize: handle single file or array
        const fileList = Array.isArray(fileEntry) ? fileEntry : [fileEntry];

        for (const file of fileList) {
            const { name: originalName } = file;

            const newFileName = !originalName ? `anon_${resultType}` : originalName.replace(/\s+/g, '');

            // Generate unique filename
            const filename = `${newFileName}_${uuidv4()}`;
            const extension = path.extname(originalName).toLowerCase();

            try {
                // Use your existing upload function
                await uploaddocument(file, filename, allowedExtensions, uploadPath);

                // Build public URL
                const fileUrl = `${baseUrl}/api/v1/${configuration.useruploaddirectory}/${filename}${extension}`;

                // Add to operational test list
                uploadedTests.push({
                    resultType,
                    fileUrl,
                    uploadedBy: userId,
                    uploadedAt: new Date()
                });
            } catch (uploadError: any) {
                // Log error if needed
                return next(new ApiError(500, `File upload failed: ${uploadError.message}`));
            }
        }
    }

    //console.log(uploadedTests);
    //console.log(files);

    const existingEyeModule = await findOneEyeModule({ patient: _patientId, appointment: _appointmentId }, {});

    let updatedDoc;

    if (existingEyeModule) {
        // Append new tests
        updatedDoc = await updateEyeModule(existingEyeModule._id, {
            $push: {
                operationalTest: { $each: uploadedTests }
            },
            updatedBy: userId
        }, next);

    } else {
        // Create new EyeModule
        updatedDoc = await createEyeService({
            patient: _patientId,
            appointment: _appointmentId,
            appointmentid: foundAppointment.appointmentid,
            operationalTest: uploadedTests,
            createdBy: userId,
            updatedBy: userId
        });
    }

    if (!updatedDoc) {
        return next(new ApiError(500, "Failed to save operational notes"));
    }

    res.status(201).json({
        status: "success",
        message: "Operational notes and files uploaded successfully",
        data: updatedDoc
    });
});

export const getEyeRecordByAppointmentIdAndPatientId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { patientId, appointmentId } = req.params;

    // Validate required IDs
    if (!patientId) return next(new ApiError(400, configuration.error.errorPatientIdIsRequired));
    if (!appointmentId) return next(new ApiError(400, "Appointment ID is required"));

    let _patientId, _appointmentId;
    try {
        _patientId = new mongoose.Types.ObjectId(patientId);
        _appointmentId = new mongoose.Types.ObjectId(appointmentId);
    } catch (err) {
        return next(new ApiError(400, "Invalid ID format"));
    }

    // Check if patient and appointment exist
    const foundPatient = await readonepatient({ _id: _patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new ApiError(404, "Patient does not exist."));
    }

    const foundAppointment = await readoneappointment({ _id: _appointmentId }, {}, '');
    if (!foundAppointment) {
        return next(new ApiError(404, "Appointment does not exist."));
    }

    const doc = await findOneEyeModule({ patient: _patientId, appointment: _appointmentId }, {});

    if (!doc) return next(new ApiError(404, `no record was found with patient id ${patientId} and appointmentId`));

    res.status(200).json({
        status: "success",
        message: "Eye record fetched successfully",
        data: doc
    });
});

export const getEyeRecordById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { Id } = req.params;

    // Validate required IDs
    if (!Id) return next(new ApiError(400, configuration.error.errorIdIsRequired));

    let _id;
    try {
        _id = new mongoose.Types.ObjectId(Id);
    } catch (err) {
        return next(new ApiError(400, "Invalid ID format"));
    }

    const doc = await findOneEyeModule({ _id: _id }, {});

    if (!doc) return next(new ApiError(404, `no eye record was found with id ${Id}`));

    res.status(200).json({
        status: "success",
        message: "Eye record fetched successfully",
        data: doc
    });
});

export const getAllEyeRecords = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const page = parseInt((req.query.page as string) || '1') || 1;
    const limit = parseInt((req.query.limit as string) || '100') || 100;

    const doc = await getAllEyeRecordpaginated([], page, limit);

    res.status(200).json({
        status: "success",
        message: "all Eye record fetched successfully",
        data: doc
    });
});

export const getAllEyeUtilData = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    res.status(200).json({
        status: "success",
        message: "eye module config",
        data: {
            OperationalNotesFileName, LensTint, lensType
        }
    });
});
export const getAllEyeRecordsPaginatedHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const options: IOptions = pick(req.query, [
        "sortBy",
        "limit",
        "page",
        "projectBy",
    ]);

    let { status } = req.query;

    let queryCriteria: any = {}

    if (status) queryCriteria.status = status;

    const result = await queryEyeRecordsPaginated(queryCriteria, options);

    res.status(200).json({
        status: true,
        data: result,
    });
});