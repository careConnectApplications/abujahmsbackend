import { Request, Response } from "express";
import mortalityRegisterDao from "../../dao/mortalityregister";
import config from "../../config";
import { validateinputfaulsyvalue } from "../../utils/otherservices";

const createMortalityRegister = async (req: Request, res: Response) => {
  try {
    const { body, user } = req as any;
    const { _id } = user.user;
    
    // Validate required fields for mortality register
    const { name, sex } = body;
    validateinputfaulsyvalue({ name, sex });
    
    const mortalityRegisterData = {
      ...body,
      // Note: Mortality register doesn't have patient/doctor references
    };

    const result = await mortalityRegisterDao.createMortalityRegister(mortalityRegisterData);
    
    res.status(result.status).json({
      status: true,
      msg: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || config.messages.general.serverError,
    });
  }
};

const getMortalityRegister = async (req: Request, res: Response) => {
  try {
    const { limit, skip, searchText } = req.query;
    
    const result = await mortalityRegisterDao.readAllMortalityRegister(
      Number(limit) || undefined,
      Number(skip) || undefined,
      searchText as string
    );
    
    res.status(result.status).json({
      queryresult: {
        data: result.data,
        totalCount: result.totalCount || 0,
        status: true
      }
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || config.messages.general.serverError,
    });
  }
};

const getMortalityRegisterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await mortalityRegisterDao.getMortalityRegisterById(id);
    
    res.status(result.status).json({
      status: true,
      msg: result.message,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || config.messages.general.serverError,
    });
  }
};

const getMortalityRegisterByPatientId = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    
    const result = await mortalityRegisterDao.getMortalityRegisterByPatientId(patientId);
    
    res.status(result.status).json({
      status: true,
      msg: result.message,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || config.messages.general.serverError,
    });
  }
};

const updateMortalityRegister = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const { firstName, lastName } = (req as any).user.user;
    
    const updateData = {
      ...body,
      updatedBy: `${firstName} ${lastName}`,
    };
    
    const result = await mortalityRegisterDao.updateMortalityRegister(id, updateData);
    
    res.status(result.status).json({
      status: true,
      msg: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || config.messages.general.serverError,
    });
  }
};

// Delete function commented out as per pattern
// const deleteMortalityRegister = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
    
//     const result = await mortalityRegisterDao.deleteMortalityRegister(id);
    
//     res.status(result.status).json({
//       error: result.error,
//       message: result.message,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       error: true,
//       message: error.message || config.messages.general.serverError,
//     });
//   }
// };

const getMortalityRegisterPaginated = async (req: Request, res: Response) => {
  try {
    const { page, limit, searchText, ...filters } = req.query;
    
    const result = await mortalityRegisterDao.getMortalityRegisterPaginated(
      Number(page) || 1,
      Number(limit) || 10,
      searchText as string,
      filters
    );
    
    res.status(result.status).json({
      queryresult: {
        data: result.data,
        //totalCount: result.data?.totalCount || 0,
        status: true
      }
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || config.messages.general.serverError,
    });
  }
};

const aggregateMortalityRegister = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, groupBy } = req.query;
    
    const result = await mortalityRegisterDao.aggregateMortalityRegister(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
      (groupBy as "day" | "month" | "year") || "month"
    );
    
    res.status(result.status).json({
      status: true,
      msg: result.message,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || config.messages.general.serverError,
    });
  }
};

const countMortalityRegister = async (req: Request, res: Response) => {
  try {
    const result = await mortalityRegisterDao.countMortalityRegister();
    
    res.status(result.status).json({
      status: true,
      msg: result.message,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || config.messages.general.serverError,
    });
  }
};

const getMortalityStatistics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const result = await mortalityRegisterDao.getMortalityStatistics(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    
    res.status(result.status).json({
      status: true,
      msg: result.message,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || config.messages.general.serverError,
    });
  }
};

export default {
  createMortalityRegister,
  getMortalityRegister,
  getMortalityRegisterById,
  getMortalityRegisterByPatientId,
  updateMortalityRegister,
  // deleteMortalityRegister,
  getMortalityRegisterPaginated,
  aggregateMortalityRegister,
  countMortalityRegister,
  getMortalityStatistics,
};
