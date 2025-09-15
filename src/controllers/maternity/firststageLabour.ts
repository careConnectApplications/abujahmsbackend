import { Request, Response } from "express";
import firstStageLabourDao from "../../dao/firststageLabour";
import config from "../../config";
import { validateinputfaulsyvalue } from "../../utils/otherservices";

const createFirstStageLabour = async (req: any, res: Response) => {
  try {
    const { body,user } = req;
    const {dateExamined, phase} = body;
    validateinputfaulsyvalue({dateExamined, phase});  
    //const userId = (req as any).userId;
      const { _id } = user.user;
    //console.log(userId);
    
    const firstStageLabourData = {
      ...body,
      doctor: _id
    };

    const result = await firstStageLabourDao.createFirstStageLabour(firstStageLabourData);
    
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

const getFirstStageLabour = async (req: Request, res: Response) => {
  try {
    const { limit, skip, searchText } = req.query;
    
    const result = await firstStageLabourDao.readAllFirstStageLabour(
      Number(limit) || undefined,
      Number(skip) || undefined,
      searchText as string
    );
    
    res.status(result.status).json({
      queryresult:{
      data: result.data,
      totalCount: result.totalCount,
      status:true
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      msg: error.message,
    });
  }
};

const getFirstStageLabourById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await firstStageLabourDao.getFirstStageLabourById(id);
    
    res.status(result.status).json({
      status: true,
      queryresult: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      msg: error.message,
    });
  }
};

const getFirstStageLabourByPatientId = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    
    const result = await firstStageLabourDao.getFirstStageLabourByPatientId(patientId);
    
    res.status(result.status).json({
      status: true,
      queryresult: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      msg: error.message,
    });
  }
};

const updateFirstStageLabour = async (req:any, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName,lastName} = (req.user).user;
    req.body.updatedBy = `${firstName} ${lastName}`;
    const { body } = req;
    const updateData = {
      ...body
    };
    
    const result = await firstStageLabourDao.updateFirstStageLabour(id, updateData);
    
    res.status(result.status).json({
      status: true,
      queryresult: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      msg: error.message,
    });
  }
};
/*
const deleteFirstStageLabour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await firstStageLabourDao.deleteFirstStageLabour(id);
    
    res.status(result.status).json({
      error: result.error,
      message: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      error: true,
      message: error.message || config.messages.general.serverError,
    });
  }
};
*/
const getFirstStageLabourPaginated = async (req: Request, res: Response) => {
  try {
    const { page, limit, searchText, ...filters } = req.query;
    
    const result = await firstStageLabourDao.getFirstStageLabourPaginated(
      Number(page) || 1,
      Number(limit) || 10,
      searchText as string,
      filters
    );
    
    res.status(result.status).json({
      status: true,
      queryresult: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message 
    });
  }
};


export default {
  createFirstStageLabour,
  getFirstStageLabour,
  getFirstStageLabourById,
  getFirstStageLabourByPatientId,
  updateFirstStageLabour,
  getFirstStageLabourPaginated,
  
};
