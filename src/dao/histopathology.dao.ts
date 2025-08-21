import { NextFunction } from "express";
import mongoose from "mongoose";
import Histopathology from "../models/histopathology";
import { IOptions, QueryResult } from "../paginate/paginate";
export const findTestRequiredById = async (subdocId: string) => {
  const result = await Histopathology.findOne(
    { "testRequired._id": new mongoose.Types.ObjectId(subdocId) },
    { "testRequired.$": 1 } // project only the matching subdocument
  );

  return result;
};
export async function CreateHistopatholgyDao(body: any, next: NextFunction) {
    try {
        const histopathology = new Histopathology(body);
        return await histopathology.save();
    }
    catch (err) {
        return next(err);
    }
}
export const getHistopathologyByIdPopulate = async (
    id: mongoose.Types.ObjectId
): Promise<any | null> => Histopathology.findById(id).populate('patient');

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
export const getAllPaginatedHistopathologyRecords = async (
  query: any,
  page: number = 1,
  size: number = 150
) => {
  const skip = (page - 1) * size;

  const [docs, total] = await Promise.all([
    Histopathology.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size),
    Histopathology.countDocuments(query),
  ]);

  return {
    docs,
    total,
    page,
    totalPages: Math.ceil(total / size),
  };
};

export const getHistopatholofySubdocument = async (id: string) => {
      const result = await Histopathology.aggregate([
      { $match: { "testRequired._id": new mongoose.Types.ObjectId(id) } },
      // lookup patient
      {
        $lookup: {
          from: "patientsmanagements", // collection name (check exact name in MongoDB)
          localField: "patient",
          foreignField: "_id",
          as: "patient"
        }
      },
      { $unwind: "$patient" },
      {
        $project: {
          patient: 1,
          staffInfo: 1,
          amount: 1,
          status: 1,
          refNumber: 1,
          createdAt: 1,
          updatedAt: 1,
          testRequired: {
            $filter: {
              input: "$testRequired",
              as: "tr",
              cond: { $eq: ["$$tr._id", new mongoose.Types.ObjectId(id)] }
            }
          }
        }
      }
    ]);

    if (!result || result.length === 0)  throw new Error("TestRequired not found");
    return result;
     
    
  }