import { NextFunction } from "express";
import configuration from "../config";
import EyeModule from "../models/eye-module/eye-module.model";
import { ApiError } from "../errors";
import { IOptions, QueryResult } from "../paginate/paginate";

export async function getallEyeModules(query: any, selectquery: any, populatequery: any, next: NextFunction) {
    try {
        const eyedetails = await EyeModule.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
        const totaleyedetails = await EyeModule.find(query).countDocuments();
        return { eyedetails, totaleyedetails };
    } catch (err) {
        console.log(err);
        return next(new ApiError(401, "Failed to retrieve eye module data"));
    }
};

export async function createEyeService(input: any) {
    const doc = new EyeModule(input);
    return await doc.save();
}

//find one
export async function findOneEyeModule(query: any, selectquery: any) {
    return await EyeModule.findOne(query).select(selectquery);
}

//update eye module by id
export async function updateEyeModule(id: any, reqbody: any, next: NextFunction) {
    try {
        const doc = await EyeModule.findOneAndUpdate({ _id: id }, reqbody, {
            upsert: true, new: true
        });

        if (!doc) {
            //return json  false response
            return next(new ApiError(401, configuration.error.errorinvalidcredentials));
        }

        return doc;
    } catch (err) {
        return next(new ApiError(401, "Failed to update eye module"))
    }

}
//update eye module by query
export async function updateappointmentbyquery(query: any, reqbody: any, next: NextFunction) {
    try {
        const doc = await EyeModule.findOneAndUpdate(query, reqbody, {
            upsert: true,
            new: true
        });
        if (!doc) {
            //return json  false response
            return next(new ApiError(400, configuration.error.errorinvalidcredentials));
        }
        return doc;
    } catch (err) {
        console.log(err);
        return next(new ApiError(409, "Failed to update eye module"));
    }
}

export async function getAllEyeRecordpaginated(input: any, page: any, size: any) {
    const skip = (page - 1) * size;
    const eyedetails: any = await EyeModule.aggregate(input).skip(skip).limit(size).sort({ createdAt: -1 });
    const totalEyeDocs = (await EyeModule.aggregate(input)).length;
    const totalPages = Math.ceil(eyedetails / size);
    return { totalEyeDocs, totalPages, eyedetails, size, page };
}

/**
 * Query for eye records
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryEyeRecordsPaginated = async (
    filter: Record<string, any>,
    options: IOptions
): Promise<QueryResult> => {
    const docs = await EyeModule.paginate(filter, options);
    return docs;
};


export async function findEyeModule(query: any, selectquery: any) {
    return await EyeModule.find(query).select(selectquery);
}
