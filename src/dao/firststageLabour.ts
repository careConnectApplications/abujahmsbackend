import { Types } from "mongoose";
import config from "../config";
import { FirstStageLabour } from "../models/maternity";

const countFirstStageLabour = async () => {
  const firstStageLabourCount = await FirstStageLabour.countDocuments({
    deletedAt: { $exists: false },
  });
  
  return {
    error: false,
    data: firstStageLabourCount,
    status: 200,
  };
};

const readAllFirstStageLabour = async (limit?: number, skip?: number, searchText?: string) => {
  try {
    const filter: any = { deletedAt: { $exists: false } };
    
    if (searchText) {
      filter.$or = [
        { phase: { $regex: searchText, $options: "i" } },
        { contraction: { $regex: searchText, $options: "i" } },
        { palpationExamination: { $regex: searchText, $options: "i" } },
        { notes: { $regex: searchText, $options: "i" } },
      ];
    }

    const firstStageLabour = await FirstStageLabour.find(filter)
      .populate("patient")
      .populate("doctor")
      .limit(limit || 10)
      .skip(skip || 0)
      .sort({ createdAt: -1 });

    const totalCount = await FirstStageLabour.countDocuments(filter);

    return {
      error: false,
      data: firstStageLabour,
      totalCount,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const createFirstStageLabour = async (firstStageLabourData: any) => {
  try {
    const newFirstStageLabour = new FirstStageLabour(firstStageLabourData);
    const savedFirstStageLabour = await newFirstStageLabour.save();
  

    return {
      error: false,
      message:  "First stage labour created successfully",
      status: 201,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const updateFirstStageLabour = async (firstStageLabourId: string, updateData: any) => {
  try {
    const updatedFirstStageLabour = await FirstStageLabour.findByIdAndUpdate(
      firstStageLabourId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate("patient")
      .populate("doctor");

    if (!updatedFirstStageLabour) {
      throw new Error("First stage labour not found");
    }

    return {
      error: false,
      message:  "First stage labour updated successfully",
      data: updatedFirstStageLabour,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const deleteFirstStageLabour = async (firstStageLabourId: string) => {
  try {
    const deletedFirstStageLabour = await FirstStageLabour.findByIdAndUpdate(
      firstStageLabourId,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedFirstStageLabour) {
      throw new Error("First stage labour not found");
    }

    return {
      error: false,
      message:  "First stage labour deleted successfully",
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const getFirstStageLabourById = async (firstStageLabourId: string) => {
  try {
    const firstStageLabour = await FirstStageLabour.findOne({
      _id: firstStageLabourId,
      deletedAt: { $exists: false },
    })
      .populate("patient")
      .populate("doctor");

    if (!firstStageLabour) {
      throw new Error("First stage labour not found");
    }

    return {
      error: false,
      data: firstStageLabour,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const getFirstStageLabourByPatientId = async (patientId: string) => {
  try {
    const firstStageLabourRecords = await FirstStageLabour.find({
      patient: patientId
    })
      .populate("patient")
      .populate("doctor")
      .sort({ createdAt: -1 });

    return {
      error: false,
      //message: config.messages.general.dataRetrieved,
      data: firstStageLabourRecords,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const aggregateFirstStageLabour = async (
  startDate?: Date,
  endDate?: Date,
  groupBy: "day" | "month" | "year" = "month"
) => {
  try {
    const matchStage: any = { deletedAt: { $exists: false } };
    
    if (startDate && endDate) {
      matchStage.createdAt = { $gte: startDate, $lte: endDate };
    }

    const groupStage: any = {
      _id: null,
      total: { $sum: 1 },
      activePhase: {
        $sum: { $cond: [{ $eq: ["$phase", "Active"] }, 1, 0] },
      },
      latentPhase: {
        $sum: { $cond: [{ $eq: ["$phase", "Latent"] }, 1, 0] },
      },
      inducedLabour: {
        $sum: { $cond: [{ $eq: ["$inducedLabour", true] }, 1, 0] },
      },
      averageCervicalDilation: { $avg: "$cervicalDilation" },
      complicationCount: { $sum: { $cond: [{ $ne: ["$obstetricComplication", null] }, 1, 0] } },
    };

    if (groupBy === "day") {
      groupStage._id = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    } else if (groupBy === "month") {
      groupStage._id = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    } else {
      groupStage._id = { $year: "$createdAt" };
    }

    const aggregateResult = await FirstStageLabour.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { _id: 1 } },
    ]);

    return {
      error: false,
      data: aggregateResult,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const getFirstStageLabourPaginated = async (
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
        { phase: { $regex: searchText, $options: "i" } },
        { contraction: { $regex: searchText, $options: "i" } },
        { notes: { $regex: searchText, $options: "i" } },
      ];
    }

    if (filters) {
      if (filters.phase) filter.phase = filters.phase;
      if (filters.inducedLabour !== undefined) filter.inducedLabour = filters.inducedLabour;
      if (filters.startDate && filters.endDate) {
        filter.createdAt = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate),
        };
      }
    }

    const [data, totalCount] = await Promise.all([
      FirstStageLabour.find(filter)
        .populate("doctor")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      FirstStageLabour.countDocuments(filter),
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
  countFirstStageLabour,
  readAllFirstStageLabour,
  createFirstStageLabour,
  updateFirstStageLabour,
  deleteFirstStageLabour,
  getFirstStageLabourById,
  getFirstStageLabourByPatientId,
  aggregateFirstStageLabour,
  getFirstStageLabourPaginated,
};
