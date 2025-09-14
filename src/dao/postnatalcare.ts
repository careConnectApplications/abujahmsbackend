import { Types } from "mongoose";
import config from "../config";
import { PostnatalCare } from "../models/maternity";

const countPostnatalCare = async () => {
  const postnatalCareCount = await PostnatalCare.countDocuments({
    deletedAt: { $exists: false },
  });
  
  return {
    error: false,
    data: postnatalCareCount,
    status: 200,
  };
};

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
    return {
      error: true,
      message: error.message,
      status: 500,
    };
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
    return {
      error: true,
      message: error.message,
      status: 500,
    };
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
      return {
        error: true,
        message: "Postnatal care not found",
        status: 404,
      };
    }

    return {
      error: false,
      message: "Postnatal care updated successfully",
      data: updatedPostnatalCare,
      status: 200,
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message || config.messages.general.serverError,
      status: 500,
    };
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
      return {
        error: true,
        message: "Postnatal care not found",
        status: 404,
      };
    }

    return {
      error: false,
      message: "Postnatal care deleted successfully",
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

const getPostnatalCareById = async (postnatalCareId: string) => {
  try {
    const postnatalCare = await PostnatalCare.findOne({
      _id: postnatalCareId,
      deletedAt: { $exists: false },
    })
      .populate("patient")
      .populate("doctor");

    if (!postnatalCare) {
      return {
        error: true,
        message: "Postnatal care not found",
        status: 404,
      };
    }

    return {
      error: false,
      data: postnatalCare,
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
    return {
      error: true,
      message: error.message,
      status: 500,
    };
  }
};

const aggregatePostnatalCare = async (
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
      newVisits: {
        $sum: { $cond: [{ $eq: ["$typeOfVisit", "New"] }, 1, 0] },
      },
      revisits: {
        $sum: { $cond: [{ $eq: ["$typeOfVisit", "Revisit"] }, 1, 0] },
      },
      maleChildren: {
        $sum: { $cond: [{ $eq: ["$sexOfChild", "Male"] }, 1, 0] },
      },
      femaleChildren: {
        $sum: { $cond: [{ $eq: ["$sexOfChild", "Female"] }, 1, 0] },
      },
      kangarooRequired: {
        $sum: { $cond: [{ $eq: ["$kangarooMotherCare", "Required"] }, 1, 0] },
      },
      averageBabiesDelivered: { $avg: "$numberOfBabiesDelivered" },
    };

    if (groupBy === "day") {
      groupStage._id = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    } else if (groupBy === "month") {
      groupStage._id = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    } else {
      groupStage._id = { $year: "$createdAt" };
    }

    const aggregateResult = await PostnatalCare.aggregate([
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
    return {
      error: true,
      message: error.message,
      status: 500,
    };
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
        .populate("patient")
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
    return {
      error: true,
      message: error.message,
      status: 500,
    };
  }
};

const getPostnatalCareStatistics = async (patientId?: string) => {
  try {
    const filter: any = { deletedAt: { $exists: false } };
    if (patientId) {
      filter.patientsId = patientId;
    }

    const statistics = await PostnatalCare.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalVisits: { $sum: 1 },
          newVisits: {
            $sum: { $cond: [{ $eq: ["$typeOfVisit", "New"] }, 1, 0] },
          },
          revisits: {
            $sum: { $cond: [{ $eq: ["$typeOfVisit", "Revisit"] }, 1, 0] },
          },
          averageBabiesDelivered: { $avg: "$numberOfBabiesDelivered" },
          totalBabiesDelivered: { $sum: "$numberOfBabiesDelivered" },
          kangarooCareRequired: {
            $sum: { $cond: [{ $eq: ["$kangarooMotherCare", "Required"] }, 1, 0] },
          },
          servicesProvided: { $push: "$services" },
          counsellingProvided: { $push: "$counselling" },
          neonatalComplications: { $push: "$neonatalComplications" },
        },
      },
      {
        $project: {
          _id: 0,
          totalVisits: 1,
          newVisits: 1,
          revisits: 1,
          averageBabiesDelivered: { $round: ["$averageBabiesDelivered", 2] },
          totalBabiesDelivered: 1,
          kangarooCareRequired: 1,
          uniqueServices: {
            $size: {
              $reduce: {
                input: "$servicesProvided",
                initialValue: [],
                in: { $setUnion: ["$$value", "$$this"] },
              },
            },
          },
          uniqueCounselling: {
            $size: {
              $reduce: {
                input: "$counsellingProvided",
                initialValue: [],
                in: { $setUnion: ["$$value", "$$this"] },
              },
            },
          },
          totalComplications: {
            $size: {
              $reduce: {
                input: "$neonatalComplications",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
          },
        },
      },
    ]);

    return {
      error: false,
      data: statistics[0] || {
        totalVisits: 0,
        newVisits: 0,
        revisits: 0,
        averageBabiesDelivered: 0,
        totalBabiesDelivered: 0,
        kangarooCareRequired: 0,
        uniqueServices: 0,
        uniqueCounselling: 0,
        totalComplications: 0,
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
  countPostnatalCare,
  readAllPostnatalCare,
  createPostnatalCare,
  updatePostnatalCare,
  deletePostnatalCare,
  getPostnatalCareById,
  getPostnatalCareByPatientId,
  aggregatePostnatalCare,
  getPostnatalCarePaginated,
  getPostnatalCareStatistics,
};
