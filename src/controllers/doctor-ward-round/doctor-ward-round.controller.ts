import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import { ApiError } from '../../errors';
import { CreateDoctorWardRoundDao, getAllDoctorWardRoundRecords, getDoctorWardRoundById, updateDoctorWardRecordById } from '../../dao/doctor-ward-round.dao';
import mongoose from 'mongoose';
import configuration from '../../config';
import { readoneadmission } from '../../dao/admissions';

export const createDoctorWardNote = catchAsync(
    async (req: Request | any, res: Response, next: NextFunction) => {
        const { admissionId, admissionNote } = req.body;
        const { _id: userId } = (req.user).user;

        if (!admissionId || !admissionNote) {
            return next(new ApiError(400, 'Admission ID and note are required'));
        }

        const admissionrecord: any = await readoneadmission({ _id: admissionId }, {}, '');
        //console.log(admissionrecord);   
        if (!admissionrecord) {
            throw new Error(`Admission do not already exists`);
        }

        const note = await CreateDoctorWardRoundDao({
            admissionId,
            admissionNote,
            createdBy: userId
        }, next);

        res.status(201).json({
            status: true,
            message: 'Admission note for doctor ward round created successfully',
            data: note
        });
    }
);

export const getAllDoctorWardNotes = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        let filter: any = {};

        if (req.query.admissionId) {
            filter.admissionId = req.query.admissionId;
        }

        if (req.query.userId) filter.createdBy = req.query.userId;

        const notes = await getAllDoctorWardRoundRecords(filter, "admissionId createdBy");

        res.status(200).json({
            status: true,
            results: notes.length,
            data: notes
        });
    }
);

export const getDoctorWardNoteById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, configuration.error.errorIdIsRequired));
        }

        const note = await getDoctorWardRoundById(new mongoose.Types.ObjectId(id));

        if (!note) {
            return next(new ApiError(404, 'Admission note not found'));
        }

        res.status(200).json({
            status: 'success',
            data: note
        });
    }
);

export const updateDoctorWardAdmissionNote = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { admissionNote } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, 'Invalid ID'));
        }

        const noteExist = await getDoctorWardRoundById(new mongoose.Types.ObjectId(id));

        if (!noteExist) {
            return next(new ApiError(404, 'Admission note not found'));
        }

        if (admissionNote === undefined) {
            return next(new ApiError(400, 'Admission note is required'));
        }

        const note = await updateDoctorWardRecordById(
            { _id: id },
            req.body,
        );

        if (!note) {
            return next(new ApiError(404, 'Admission note not found'));
        }

        res.status(200).json({
            status: 'success',
            message: 'Admission note updated successfully',
            data: note
        });
    }
);