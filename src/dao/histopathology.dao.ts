import { NextFunction } from "express";
import mongoose from "mongoose";
import Histopathology from "../models/histopathology";
import { IOptions, QueryResult } from "../paginate/paginate";

export async function CreateHistopatholgyDao(body: any, next: NextFunction) {
    try {
        const histopathology = new Histopathology(body);
        return await histopathology.save();
    }
    catch (err) {
        return next(err);
    }
}

export const getHistopathologyById = async (
    id: mongoose.Types.ObjectId
): Promise<any | null> => Histopathology.findById(id);

export const getAllHistopathologyRecords = async (query: any) => {
    const docs = await Histopathology.find(query).sort({ createdAt: -1 });
    return docs
};

export const queryHistopathologyRecord = async (query: any, selectquery: any, populatequery: any) => {
    return await Histopathology.findOne(query).select(selectquery).populate(populatequery);
}

/**
 * Query for histopathology records
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryDocs = async (
    filter: Record<string, any>,
    options: IOptions
): Promise<QueryResult> => {
    const docs = await Histopathology.paginate(filter, options);
    return docs;
};

export const updateHistopathologyRecord = async (query: any, reqbody: any) => {
    const doc = await Histopathology.findOneAndUpdate(query, reqbody, {
        new: true
    });

    return doc;
}