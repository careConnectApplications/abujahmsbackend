import { Types } from "mongoose";
import config from "../config";
import { BirthRegister } from "../models/maternity";

const countBirthRegister = async () => {
  const birthRegisterCount = await BirthRegister.countDocuments({
    deletedAt: { $exists: false },
  });
  
  return {
    error: false,
    data: birthRegisterCount,
    status: 200,
  };
};

const readAllBirthRegister = async (limit?: number, skip?: number, searchText?: string) => {
  try {
    const filter: any = { deletedAt: { $exists: false } };
    
    if (searchText) {
      filter.$or = [
        { "childName.firstName": { $regex: searchText, $options: "i" } },
        { "childName.lastName": { $regex: searchText, $options: "i" } },
        { "motherName.firstName": { $regex: searchText, $options: "i" } },
        { "motherName.lastName": { $regex: searchText, $options: "i" } },
        { "fatherName.firstName": { $regex: searchText, $options: "i" } },
        { "fatherName.lastName": { $regex: searchText, $options: "i" } },
        { phoneNumber: { $regex: searchText, $options: "i" } },
      ];
    }

    const birthRegisters = await BirthRegister.find(filter)
      .limit(limit || 10)
      .skip(skip || 0)
      .sort({ createdAt: -1 });

    const totalCount = await BirthRegister.countDocuments(filter);

    return {
      error: false,
      data: birthRegisters,
      totalCount,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const createBirthRegister = async (birthRegisterData: any) => {
  try {
    const newBirthRegister = new BirthRegister(birthRegisterData);
    const savedBirthRegister = await newBirthRegister.save();

    return {
      error: false,
      message: "Birth register created successfully",
      status: 201,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const updateBirthRegister = async (birthRegisterId: string, updateData: any) => {
  try {
    const updatedBirthRegister = await BirthRegister.findByIdAndUpdate(
      birthRegisterId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate("patient");

    if (!updatedBirthRegister) {
      throw new Error("Birth register not found");
    }

    return {
      error: false,
      message: "Birth register updated successfully",
      data: updatedBirthRegister,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const deleteBirthRegister = async (birthRegisterId: string) => {
  try {
    const deletedBirthRegister = await BirthRegister.findByIdAndUpdate(
      birthRegisterId,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!deletedBirthRegister) {
      throw new Error("Birth register not found");
    }

    return {
      error: false,
      message: "Birth register deleted successfully",
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const getBirthRegisterById = async (birthRegisterId: string) => {
  try {
    const birthRegister = await BirthRegister.findOne({
      _id: birthRegisterId,
      deletedAt: { $exists: false },
    })
      .populate("patient");

    if (!birthRegister) {
      throw new Error("Birth register not found");
    }

    return {
      error: false,
      data: birthRegister,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const getBirthRegisterByPatientId = async (patientId: string) => {
  try {
    const birthRegisters = await BirthRegister.find({
      patientsId: patientId,
      deletedAt: { $exists: false },
    })
      .populate("patient")
      .sort({ createdAt: -1 });

    return {
      error: false,
      //message: config.messages.general.dataRetrieved,
      data: birthRegisters,
      status: 200,
    };
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

const aggregateBirthRegister = async (
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
      under1YearCount: {
        $sum: { $cond: ["$under1YearRegistration", 1, 0] },
      },
    };

    if (groupBy === "day") {
      groupStage._id = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    } else if (groupBy === "month") {
      groupStage._id = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    } else {
      groupStage._id = { $year: "$createdAt" };
    }

    const aggregateResult = await BirthRegister.aggregate([
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

const getBirthRegisterPaginated = async (
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
        { "childName.firstName": { $regex: searchText, $options: "i" } },
        { "childName.lastName": { $regex: searchText, $options: "i" } },
        { "motherName.firstName": { $regex: searchText, $options: "i" } },
        { phoneNumber: { $regex: searchText, $options: "i" } },
      ];
    }

    if (filters) {
      if (filters.sex) filter.sex = filters.sex;
      if (filters.startDate && filters.endDate) {
        filter.dateOfChildRegistration = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate),
        };
      }
    }

    const [data, totalCount] = await Promise.all([
      BirthRegister.find(filter)
        .populate("patient")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      BirthRegister.countDocuments(filter),
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
  countBirthRegister,
  readAllBirthRegister,
  createBirthRegister,
  updateBirthRegister,
  deleteBirthRegister,
  getBirthRegisterById,
  getBirthRegisterByPatientId,
  aggregateBirthRegister,
  getBirthRegisterPaginated,
};
