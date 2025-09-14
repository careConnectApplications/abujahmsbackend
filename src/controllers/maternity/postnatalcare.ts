import { Request, Response } from "express";
import postnatalCareDao from "../../dao/postnatalcare";
import config from "../../config";
import { validateinputfaulsyvalue } from "../../utils/otherservices";

const createPostnatalCare = async (req: Request, res: Response) => {
  try {
    const { body, user } = req as any;
    const { _id } = user.user;
    
    // Validate required fields for postnatal care
    const { typeOfVisit } = body;
    validateinputfaulsyvalue({ typeOfVisit });
    
    const postnatalCareData = {
      ...body,
      doctor: _id,
    };

    const result = await postnatalCareDao.createPostnatalCare(postnatalCareData);
    
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

const getPostnatalCare = async (req: Request, res: Response) => {
  try {
    const { limit, skip, searchText } = req.query;
    
    const result = await postnatalCareDao.readAllPostnatalCare(
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

const getPostnatalCareById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await postnatalCareDao.getPostnatalCareById(id);
    
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

const getPostnatalCareByPatientId = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    
    const result = await postnatalCareDao.getPostnatalCareByPatientId(patientId);
    
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

const updatePostnatalCare = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const { firstName, lastName } = (req as any).user.user;
    
    const updateData = {
      ...body,
      updatedBy: `${firstName} ${lastName}`,
    };
    
    const result = await postnatalCareDao.updatePostnatalCare(id, updateData);
    
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
// const deletePostnatalCare = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
    
//     const result = await postnatalCareDao.deletePostnatalCare(id);
    
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

const getPostnatalCarePaginated = async (req: Request, res: Response) => {
  try {
    const { page, limit, searchText, ...filters } = req.query;
    
    const result = await postnatalCareDao.getPostnatalCarePaginated(
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

const aggregatePostnatalCare = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, groupBy } = req.query;
    
    const result = await postnatalCareDao.aggregatePostnatalCare(
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

const countPostnatalCare = async (req: Request, res: Response) => {
  try {
    const result = await postnatalCareDao.countPostnatalCare();
    
    res.status(result.status).json({
      status: true,
      //msg: result.message,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || config.messages.general.serverError,
    });
  }
};

const getPostnatalCareStatistics = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.query;
    
    const result = await postnatalCareDao.getPostnatalCareStatistics(
      patientId as string | undefined
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
  createPostnatalCare,
  getPostnatalCare,
  getPostnatalCareById,
  getPostnatalCareByPatientId,
  updatePostnatalCare,
  // deletePostnatalCare,
  getPostnatalCarePaginated,
  aggregatePostnatalCare,
  countPostnatalCare,
  getPostnatalCareStatistics,
};
