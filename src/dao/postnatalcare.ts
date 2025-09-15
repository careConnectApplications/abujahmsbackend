import { Types } from "mongoose";
import config from "../config";
import { PostnatalCare } from "../models/maternity";



const readAllPostnatalCare = async (limit?: number, skip?: number, searchText?: string) => {
  try {
    const filter: any = { deletedAt: { $exists: false } };
    
    if (searchText) {
      filter.$or = [
        { visitFor: { $regex: searchText, $options: "i" } },
        { associatedProblems: { $regex: searchText, $options: "i" } },
        { typeOfVisit: { $regex: searchText, $options: "i" } },
        { sexOfChild: { $regex: searchText, $options: "i" } },
      ];
    }

    const postnatalCare = await PostnatalCare.find(filter)
      .populate("patient")
      .populate("doctor")
      .limit(limit || 10)
      .skip(skip || 0)
      .sort({ createdAt: -1 });

    const totalCount = await PostnatalCare.countDocuments(filter);

    return {
      error: false,
      data: postnatalCare,
      totalCount,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const createPostnatalCare = async (postnatalCareData: any) => {
  try {
    const newPostnatalCare = new PostnatalCare(postnatalCareData);
    const savedPostnatalCare = await newPostnatalCare.save();

    return {
      error: false,
      message: "Postnatal care created successfully",
      status: 201,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const updatePostnatalCare = async (postnatalCareId: string, updateData: any) => {
  try {
    const updatedPostnatalCare = await PostnatalCare.findByIdAndUpdate(
      postnatalCareId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate("patient")
      .populate("doctor");

    if (!updatedPostnatalCare) {
      throw new Error("Postnatal care not found");
    }

    return {
      error: false,
      message: "Postnatal care updated successfully",
      data: updatedPostnatalCare,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const deletePostnatalCare = async (postnatalCareId: string) => {
  try {
    const deletedPostnatalCare = await PostnatalCare.findByIdAndUpdate(
      postnatalCareId,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedPostnatalCare) {
      throw new Error("Postnatal care not found");
    }

    return {
      error: false,
      message: "Postnatal care deleted successfully",
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const getPostnatalCareById = async (postnatalCareId: string) => {
  try {
    const postnatalCare = await PostnatalCare.findOne({
      _id: postnatalCareId,
      deletedAt: { $exists: false },
    })
      .populate("patient")
      .populate("doctor");

    if (!postnatalCare) {
      throw new Error("Postnatal care not found");
    }

    return {
      error: false,
      data: postnatalCare,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const getPostnatalCareByPatientId = async (patientId: string) => {
  try {
    const postnatalCareRecords = await PostnatalCare.find({
      patientsId: patientId,
      deletedAt: { $exists: false },
    })
      .populate("patient")
      .populate("doctor")
      .sort({ createdAt: -1 });

    return {
      error: false,
      //message: config.messages.general.dataRetrieved,
      data: postnatalCareRecords,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};



const getPostnatalCarePaginated = async (
  page: number = 1,
  limit: number = 10,
  searchText?: string,
  filters?: any
) => {
  try {
    const skip = (page - 1) * limit;
    const filter: any = { deletedAt: { $exists: false } };

    if (searchText) {
      filter.$or = [
        { visitFor: { $regex: searchText, $options: "i" } },
        { associatedProblems: { $regex: searchText, $options: "i" } },
        { typeOfVisit: { $regex: searchText, $options: "i" } },
      ];
    }

    if (filters) {
      if (filters.typeOfVisit) filter.typeOfVisit = filters.typeOfVisit;
      if (filters.sexOfChild) filter.sexOfChild = filters.sexOfChild;
      if (filters.outcomeOfVisit) filter.outcomeOfVisit = filters.outcomeOfVisit;
      if (filters.startDate && filters.endDate) {
        filter.createdAt = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate),
        };
      }
    }

    const [data, totalCount] = await Promise.all([
      PostnatalCare.find(filter)
        .populate("doctor")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      PostnatalCare.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      error: false,
      data: {
        records: data,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords: totalCount,
          recordsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};


export default {

  readAllPostnatalCare,
  createPostnatalCare,
  updatePostnatalCare,
  deletePostnatalCare,
  getPostnatalCareById,
  getPostnatalCareByPatientId,
  getPostnatalCarePaginated,
 
};
