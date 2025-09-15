import { Types } from "mongoose";
import { MortalityRegister } from "../models/maternity";

const countMortalityRegister = async () => {
  const mortalityRegisterCount = await MortalityRegister.countDocuments({
    deletedAt: { $exists: false },
  });
  
  return {
    error: false,
    message: "Data retrieved successfully",
    data: mortalityRegisterCount,
    status: 200,
  };
};

const readAllMortalityRegister = async (limit?: number, skip?: number, searchText?: string) => {
  try {
    const filter: any = { deletedAt: { $exists: false } };
    
    if (searchText) {
      filter.$or = [
        { name: { $regex: searchText, $options: "i" } },
        { patientCardNumber: { $regex: searchText, $options: "i" } },
        { healthFacility: { $regex: searchText, $options: "i" } },
        { ward: { $regex: searchText, $options: "i" } },
        { state: { $regex: searchText, $options: "i" } },
        { lga: { $regex: searchText, $options: "i" } },
      ];
    }

    const mortalityRegisters = await MortalityRegister.find(filter)
      .limit(limit || 10)
      .skip(skip || 0)
      .sort({ createdAt: -1 });

    const totalCount = await MortalityRegister.countDocuments(filter);

    return {
      error: false,
      message: "Data retrieved successfully",
      data: mortalityRegisters,
      totalCount,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const createMortalityRegister = async (mortalityRegisterData: any) => {
  try {
    const newMortalityRegister = new MortalityRegister(mortalityRegisterData);
    const savedMortalityRegister = await newMortalityRegister.save();

    return {
      error: false,
      message: "Mortality register created successfully",
      data: savedMortalityRegister,
      status: 201,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const updateMortalityRegister = async (mortalityRegisterId: string, updateData: any) => {
  try {
    const updatedMortalityRegister = await MortalityRegister.findByIdAndUpdate(
      mortalityRegisterId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedMortalityRegister) {
      throw new Error("Mortality register not found");
    }

    return {
      error: false,
      message: "Mortality register updated successfully",
      data: updatedMortalityRegister,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const deleteMortalityRegister = async (mortalityRegisterId: string) => {
  try {
    const deletedMortalityRegister = await MortalityRegister.findByIdAndUpdate(
      mortalityRegisterId,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedMortalityRegister) {
      throw new Error("Mortality register not found");
    }

    return {
      error: false,
      message: "Mortality register deleted successfully",
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const getMortalityRegisterById = async (mortalityRegisterId: string) => {
  try {
    const mortalityRegister = await MortalityRegister.findOne({
      _id: mortalityRegisterId,
      deletedAt: { $exists: false },
    });

    if (!mortalityRegister) {
      throw new Error("Mortality register not found");
    }

    return {
      error: false,
      message: "Data retrieved successfully",
      data: mortalityRegister,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const getMortalityRegisterByPatientId = async (patientId: string) => {
  try {
    const mortalityRegisters = await MortalityRegister.find({
      patient: patientId,
      deletedAt: { $exists: false },
    })
      .sort({ createdAt: -1 });

    return {
      error: false,
      message: "Data retrieved successfully",
      data: mortalityRegisters,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const aggregateMortalityRegister = async (
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
      maleCount: {
        $sum: { $cond: [{ $eq: ["$sex", "Male"] }, 1, 0] },
      },
      femaleCount: {
        $sum: { $cond: [{ $eq: ["$sex", "Female"] }, 1, 0] },
      },
      maternalMortalityCount: {
        $sum: { $cond: ["$maternalMortality", 1, 0] },
      },
      neonatalDeathCount: {
        $sum: { $cond: ["$neonatalDeath", 1, 0] },
      },
      averageAge: { $avg: "$age" },
    };

    if (groupBy === "day") {
      groupStage._id = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    } else if (groupBy === "month") {
      groupStage._id = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    } else {
      groupStage._id = { $year: "$createdAt" };
    }

    const aggregateResult = await MortalityRegister.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { _id: 1 } },
    ]);

    return {
      error: false,
      message: "Data retrieved successfully",
      data: aggregateResult,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const getMortalityRegisterPaginated = async (
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
        { name: { $regex: searchText, $options: "i" } },
        { patientCardNumber: { $regex: searchText, $options: "i" } },
        { healthFacility: { $regex: searchText, $options: "i" } },
        { ward: { $regex: searchText, $options: "i" } },
      ];
    }

    if (filters) {
      if (filters.sex) filter.sex = filters.sex;
      if (filters.maternalMortality !== undefined) filter.maternalMortality = filters.maternalMortality;
      if (filters.neonatalDeath !== undefined) filter.neonatalDeath = filters.neonatalDeath;
      if (filters.maternalDeath) filter.maternalDeath = filters.maternalDeath;
      if (filters.startDate && filters.endDate) {
        filter.createdAt = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate),
        };
      }
    }

    const [data, totalCount] = await Promise.all([
      MortalityRegister.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      MortalityRegister.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      error: false,
      message: "Data retrieved successfully",
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

const getMortalityStatistics = async (
  startDate?: Date,
  endDate?: Date
) => {
  try {
    const matchStage: any = { deletedAt: { $exists: false } };
    
    if (startDate && endDate) {
      matchStage.createdAt = { $gte: startDate, $lte: endDate };
    }

    const statistics = await MortalityRegister.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalDeaths: { $sum: 1 },
          maleDeaths: {
            $sum: { $cond: [{ $eq: ["$sex", "Male"] }, 1, 0] },
          },
          femaleDeaths: {
            $sum: { $cond: [{ $eq: ["$sex", "Female"] }, 1, 0] },
          },
          maternalMortality: {
            $sum: { $cond: ["$maternalMortality", 1, 0] },
          },
          neonatalDeaths: {
            $sum: { $cond: ["$neonatalDeath", 1, 0] },
          },
          averageAge: { $avg: "$age" },
          minAge: { $min: "$age" },
          maxAge: { $max: "$age" },
        },
      },
      {
        $project: {
          _id: 0,
          totalDeaths: 1,
          maleDeaths: 1,
          femaleDeaths: 1,
          maternalMortality: 1,
          neonatalDeaths: 1,
          averageAge: { $round: ["$averageAge", 2] },
          minAge: 1,
          maxAge: 1,
          sexRatio: {
            $cond: [
              { $eq: ["$femaleDeaths", 0] },
              "N/A",
              { $round: [{ $divide: ["$maleDeaths", "$femaleDeaths"] }, 2] },
            ],
          },
        },
      },
    ]);

    // Get maternal death causes breakdown
    const maternalDeathCauses = await MortalityRegister.aggregate([
      {
        $match: {
          ...matchStage,
          maternalMortality: true,
          maternalDeath: { $exists: true },
        },
      },
      {
        $group: {
          _id: "$maternalDeath",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return {
      error: false,
      message: "Data retrieved successfully",
      data: {
        statistics: statistics[0] || {
          totalDeaths: 0,
          maleDeaths: 0,
          femaleDeaths: 0,
          maternalMortality: 0,
          neonatalDeaths: 0,
          averageAge: 0,
          minAge: 0,
          maxAge: 0,
          sexRatio: "N/A",
        },
        maternalDeathCauses,
      },
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

export default {
  countMortalityRegister,
  readAllMortalityRegister,
  createMortalityRegister,
  updateMortalityRegister,
  deleteMortalityRegister,
  getMortalityRegisterById,
  getMortalityRegisterByPatientId,
  aggregateMortalityRegister,
  getMortalityRegisterPaginated,
  getMortalityStatistics,
};
