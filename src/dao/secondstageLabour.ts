import { Types } from "mongoose";
import config from "../config";
import { SecondStageLabour } from "../models/maternity";

const countSecondStageLabour = async () => {
  const secondStageLabourCount = await SecondStageLabour.countDocuments({
    deletedAt: { $exists: false },
  });
  
  return {
    error: false,
    data: secondStageLabourCount,
    status: 200,
  };
};

const readAllSecondStageLabour = async (limit?: number, skip?: number, searchText?: string) => {
  try {
    const filter: any = { deletedAt: { $exists: false } };
    
    if (searchText) {
      filter.$or = [
        { modeOfDelivery: { $regex: searchText, $options: "i" } },
        { contraction: { $regex: searchText, $options: "i" } },
        { preferredDrugs: { $regex: searchText, $options: "i" } },
        { comments: { $regex: searchText, $options: "i" } },
      ];
    }

    const secondStageLabour = await SecondStageLabour.find(filter)
      .populate("doctor")
      .limit(limit || 10)
      .skip(skip || 0)
      .sort({ createdAt: -1 });

    const totalCount = await SecondStageLabour.countDocuments(filter);

    return {
      error: false,
      data: secondStageLabour,
      totalCount,
      status: 200,
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      status: 500,
    };
  }
};

const createSecondStageLabour = async (secondStageLabourData: any) => {
  try {
    const newSecondStageLabour = new SecondStageLabour(secondStageLabourData);
    const savedSecondStageLabour = await newSecondStageLabour.save();
  

    return {
      error: false,
      message: "Second stage labour created successfully",
      status: 201,
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      status: 500,
    };
  }
};

const updateSecondStageLabour = async (secondStageLabourId: string, updateData: any) => {
  
  try {
    const updatedSecondStageLabour = await SecondStageLabour.findByIdAndUpdate(
      secondStageLabourId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      
    if (!updatedSecondStageLabour) {
      throw new Error("Second stage labour not found");
    }

    return {
      error: false,
      message: "Second stage labour updated successfully",
      data: updatedSecondStageLabour,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  
  }
};

const deleteSecondStageLabour = async (secondStageLabourId: string) => {
  try {
    const deletedSecondStageLabour = await SecondStageLabour.findByIdAndUpdate(
      secondStageLabourId,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedSecondStageLabour) {
      return {
        error: true,
        message: "Second stage labour not found",
        status: 404,
      };
    }

    return {
      error: false,
      message: "Second stage labour deleted successfully",
      status: 200,
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      status: 500,
    };
  }
};

const getSecondStageLabourById = async (secondStageLabourId: string) => {
  try {
    const secondStageLabour = await SecondStageLabour.findOne({
      _id: secondStageLabourId,
      deletedAt: { $exists: false },
    })
      .populate("patient")
      .populate("doctor");

    if (!secondStageLabour) {
      return {
        error: true,
        message: "Second stage labour not found",
        status: 404,
      };
    }

    return {
      error: false,
      data: secondStageLabour,
      status: 200,
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      status: 500,
    };
  }
};

const getSecondStageLabourByPatientId = async (patientId: string) => {
  try {
    const secondStageLabourRecords = await SecondStageLabour.find({
      patient: patientId
    })
      .populate("patient")
      .populate("doctor")
      .sort({ createdAt: -1 });

    return {
      error: false,
      data: secondStageLabourRecords,
      status: 200,
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      status: 500,
    };
  }
};


const getSecondStageLabourPaginated = async (
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
        { modeOfDelivery: { $regex: searchText, $options: "i" } },
        { contraction: { $regex: searchText, $options: "i" } },
        { comments: { $regex: searchText, $options: "i" } },
      ];
    }

    if (filters) {
      if (filters.modeOfDelivery) filter.modeOfDelivery = filters.modeOfDelivery;
      if (filters.startDate && filters.endDate) {
        filter.createdAt = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate),
        };
      }
    }

    const [data, totalCount] = await Promise.all([
      SecondStageLabour.find(filter)
        .populate("doctor")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      SecondStageLabour.countDocuments(filter),
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
    return {
      error: true,
      message: error.message,
      status: 500,
    };
  }
};

export default {
  countSecondStageLabour,
  readAllSecondStageLabour,
  createSecondStageLabour,
  updateSecondStageLabour,
  deleteSecondStageLabour,
  getSecondStageLabourById,
  getSecondStageLabourByPatientId,
  getSecondStageLabourPaginated
};
