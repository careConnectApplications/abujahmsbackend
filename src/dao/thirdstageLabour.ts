import { Types } from "mongoose";
import config from "../config";
import { ThirdStageLabour } from "../models/maternity";

const countThirdStageLabour = async () => {
  const thirdStageLabourCount = await ThirdStageLabour.countDocuments({
    deletedAt: { $exists: false },
  });
  
  return {
    error: false,
    data: thirdStageLabourCount,
    status: 200,
  };
};

const readAllThirdStageLabour = async (limit?: number, skip?: number, searchText?: string) => {
  try {
    const filter: any = { deletedAt: { $exists: false } };
    
    if (searchText) {
      filter.$or = [
        { "mother.statusAfterDelivery": { $regex: searchText, $options: "i" } },
        { "newBorn.newBornStatus": { $regex: searchText, $options: "i" } },
        { "delivery.deliveryComment": { $regex: searchText, $options: "i" } },
        { "delivery.deliveredBy": { $regex: searchText, $options: "i" } },
      ];
    }

    const thirdStageLabour = await ThirdStageLabour.find(filter)
      .populate("doctor")
      .limit(limit || 10)
      .skip(skip || 0)
      .sort({ createdAt: -1 });

    const totalCount = await ThirdStageLabour.countDocuments(filter);

    return {
      error: false,
      data: thirdStageLabour,
      totalCount,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const createThirdStageLabour = async (thirdStageLabourData: any) => {
  try {
    const newThirdStageLabour = new ThirdStageLabour(thirdStageLabourData);
    const savedThirdStageLabour = await newThirdStageLabour.save();
  

    return {
      error: false,
      message: "Third stage labour created successfully",
      status: 201,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const updateThirdStageLabour = async (thirdStageLabourId: string, updateData: any) => {
  try {
    const updatedThirdStageLabour = await ThirdStageLabour.findByIdAndUpdate(
      thirdStageLabourId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate("patient")
      .populate("doctor");

    if (!updatedThirdStageLabour) {
      throw new Error("Third stage labour not found");
    }

    return {
      error: false,
      message: "Third stage labour updated successfully",
      data: updatedThirdStageLabour,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const deleteThirdStageLabour = async (thirdStageLabourId: string) => {
  try {
    const deletedThirdStageLabour = await ThirdStageLabour.findByIdAndUpdate(
      thirdStageLabourId,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedThirdStageLabour) {
      throw new Error("Third stage labour not found");
    }

    return {
      error: false,
      message: "Third stage labour deleted successfully",
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const getThirdStageLabourById = async (thirdStageLabourId: string) => {
  try {
    const thirdStageLabour = await ThirdStageLabour.findOne({
      _id: thirdStageLabourId,
      deletedAt: { $exists: false },
    })
      .populate("patient")
      .populate("doctor");

    if (!thirdStageLabour) {
      throw new Error("Third stage labour not found");
    }

    return {
      error: false,
      data: thirdStageLabour,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const getThirdStageLabourByPatientId = async (patientId: string) => {
  try {
    const thirdStageLabourRecords = await ThirdStageLabour.find({
      patientsId: patientId,
      deletedAt: { $exists: false },
    })
      .populate("patient")
      .populate("doctor")
      .sort({ createdAt: -1 });

    return {
      error: false,
      //message: config.messages.general.dataRetrieved,
      data: thirdStageLabourRecords,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const aggregateThirdStageLabour = async (
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
      liveBirths: {
        $sum: { $cond: [{ $eq: ["$newBorn.newBornStatus", "Live Birth"] }, 1, 0] },
      },
      stillBirths: {
        $sum: { 
          $cond: [
            { $in: ["$newBorn.newBornStatus", ["Fresh Still Birth", "Macerated Still Birth"]] },
            1,
            0
          ]
        },
      },
      mothersAlive: {
        $sum: { $cond: [{ $eq: ["$mother.statusAfterDelivery", "Alive"] }, 1, 0] },
      },
      complications: {
        $sum: { $cond: [{ $ne: ["$delivery.obstetricComplication", null] }, 1, 0] },
      },
      averageApgar1Min: { $avg: "$newBorn.apgarScore1Min" },
      averageApgar5Min: { $avg: "$newBorn.apgarScore5Min" },
      averageBloodLoss: { $avg: { $toDouble: "$delivery.bloodLoss" } },
    };

    if (groupBy === "day") {
      groupStage._id = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    } else if (groupBy === "month") {
      groupStage._id = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    } else {
      groupStage._id = { $year: "$createdAt" };
    }

    const aggregateResult = await ThirdStageLabour.aggregate([
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

const getThirdStageLabourPaginated = async (
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
        { "mother.statusAfterDelivery": { $regex: searchText, $options: "i" } },
        { "newBorn.newBornStatus": { $regex: searchText, $options: "i" } },
        { "delivery.deliveryComment": { $regex: searchText, $options: "i" } },
      ];
    }

    if (filters) {
      if (filters.motherStatus) filter["mother.statusAfterDelivery"] = filters.motherStatus;
      if (filters.newBornStatus) filter["newBorn.newBornStatus"] = filters.newBornStatus;
      if (filters.startDate && filters.endDate) {
        filter.createdAt = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate),
        };
      }
    }

    const [data, totalCount] = await Promise.all([
      ThirdStageLabour.find(filter)
        .populate("patient")
        .populate("doctor")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      ThirdStageLabour.countDocuments(filter),
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
  countThirdStageLabour,
  readAllThirdStageLabour,
  createThirdStageLabour,
  updateThirdStageLabour,
  deleteThirdStageLabour,
  getThirdStageLabourById,
  getThirdStageLabourByPatientId,
  aggregateThirdStageLabour,
  getThirdStageLabourPaginated
};
