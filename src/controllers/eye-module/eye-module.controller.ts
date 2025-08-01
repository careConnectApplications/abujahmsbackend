import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import catchAsync from "../../utils/catchAsync";
import { ApiError } from "../../errors";
import configuration from "../../config";
import { readonepatient } from "../../dao/patientmanagement";

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

});

export const createExamination = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

});

export const createPreliminaryTest = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

});

export const createOperationalNotes = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

});