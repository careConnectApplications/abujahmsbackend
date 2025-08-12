import { NextFunction } from "express";
import mongoose from "mongoose";
import DoctorWardRound from "../models/doctor-ward-round";
import { QueryResult } from "../paginate/paginate";

export async function CreateDoctorWardRoundDao(body: any, next: NextFunction) {
    try {
        const histopathology = new DoctorWardRound(body);
        return await histopathology.save();
    }
    catch (err) {
        return next(err);
    }
}

export const getDoctorWardRoundById = async (
    id: mongoose.Types.ObjectId
): Promise<any | null> => DoctorWardRound.findById(id);

export const getAllDoctorWardRoundRecords = async (query: any, populate: any) => {
    const docs = await DoctorWardRound.find(query).populate(populate).sort({ createdAt: -1 });
    return docs
};

export const queryDoctorWardRoundRecord = async (query: any, selectquery: any, populatequery: any) => {
    return await DoctorWardRound.findOne(query).select(selectquery).populate(populatequery);
}

/**
 * Query for histopathology records
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
// export const queryDocs = async (
//     filter: Record<string, any>,
//     options: IOptions
// ): Promise<QueryResult> => {
//     const docs = await Histopathology.paginate(filter, options);
//     return docs;
// };

export const updateDoctorWardRecordById = async (query: any, reqbody: any) => {
    const doc = await DoctorWardRound.findOneAndUpdate(query, reqbody, {
        new: true
    });

    return doc;
}