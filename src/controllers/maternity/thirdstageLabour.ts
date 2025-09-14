import { Request, Response } from "express";
import thirdStageLabourDao from "../../dao/thirdstageLabour";
import config from "../../config";
import { validateinputfaulsyvalue } from "../../utils/otherservices";

const createThirdStageLabour = async (req: Request, res: Response) => {
  try {
    const { body, user } = req as any;
    const { _id } = user.user;
    
    // Validate required fields for third stage labour
    const { mother, newBorn } = body;
    validateinputfaulsyvalue({ mother, newBorn });
    
    const thirdStageLabourData = {
      ...body,
      doctor: _id,
    };

    const result = await thirdStageLabourDao.createThirdStageLabour(thirdStageLabourData);
    
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

const getThirdStageLabour = async (req: Request, res: Response) => {
  try {
    const { limit, skip, searchText } = req.query;
    const result = await thirdStageLabourDao.readAllThirdStageLabour(  
      Number(limit) || undefined,
      Number(skip) || undefined,
      searchText as string);
    
    res.status(result.status).json({
      queryresult: {
        data: result.data,
        totalCount: result.data?.length || 0,
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

const getThirdStageLabourById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await thirdStageLabourDao.getThirdStageLabourById(id);
    
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

const getThirdStageLabourByPatientId = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    
    const result = await thirdStageLabourDao.getThirdStageLabourByPatientId(patientId);
    
    res.status(result.status).json({
      status: true,
      msg: result.message,
      queryresult: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      msg: error.message,
    });
  }
};

const updateThirdStageLabour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const { firstName, lastName } = (req as any).user.user;
    
    const updateData = {
      ...body,
      updatedBy: `${firstName} ${lastName}`,
    };
    
    const result = await thirdStageLabourDao.updateThirdStageLabour(id, updateData);
    
    res.status(result.status).json({
      status: true,
      msg: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      msg: error.message ,
    });
  }
};

// Delete function commented out as per pattern
// const deleteThirdStageLabour = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
    
//     const result = await thirdStageLabourDao.deleteThirdStageLabour(id);
    
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

const getThirdStageLabourPaginated = async (req: Request, res: Response) => {
  try {
    const { page, limit, searchText, ...filters } = req.query;
    
   
    
    
    const result = await thirdStageLabourDao.getThirdStageLabourPaginated(
      Number(page) || 1,
      Number(limit) || 10,
      searchText as string,
      filters
    );
    
    res.status(result.status).json({
    
        queryresult: result.data,
        //totalCount: result.data?.totalCount || 0,
        status: true
      
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      msg: error.message,
    });
  }
};

export default {
  createThirdStageLabour,
  getThirdStageLabour,
  getThirdStageLabourById,
  getThirdStageLabourByPatientId,
  updateThirdStageLabour,
  // deleteThirdStageLabour,
  getThirdStageLabourPaginated,

};
