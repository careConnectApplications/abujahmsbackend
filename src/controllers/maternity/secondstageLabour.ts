import { Request, Response } from "express";
import secondStageLabourDao from "../../dao/secondstageLabour";
import config from "../../config";
import { validateinputfaulsyvalue } from "../../utils/otherservices";


const createSecondStageLabour = async (req: any, res: Response) => {
  try {
    const { body, user } = req;
    const { modeOfDelivery, deliveryDate } = body;
    validateinputfaulsyvalue({ modeOfDelivery, deliveryDate });
    const { _id } = user.user;
    
    const secondStageLabourData = {
      ...body,
      doctor: _id
    };

    const result = await secondStageLabourDao.createSecondStageLabour(secondStageLabourData);
    
    res.status(result.status).json({
      status: true,
      msg: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      msg: error.message,
    });
  }
};

const getSecondStageLabour = async (req: Request, res: Response) => {
  try {
    const { limit, skip, searchText } = req.query;
    
    const result = await secondStageLabourDao.readAllSecondStageLabour(
      Number(limit) || undefined,
      Number(skip) || undefined,
      searchText as string
    );
    
    res.status(result.status).json({
      queryresult: {
        data: result.data,
        totalCount: result.totalCount,
        status: true
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      msg: error.message,
    });
  }
};

const getSecondStageLabourById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await secondStageLabourDao.getSecondStageLabourById(id);
    
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

const getSecondStageLabourByPatientId = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    
    const result = await secondStageLabourDao.getSecondStageLabourByPatientId(patientId);
    
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

const updateSecondStageLabour = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = (req.user).user;
    req.body.updatedBy = `${firstName} ${lastName}`;
    const { body } = req;
    const updateData = {
      ...body
    };
    
    const result = await secondStageLabourDao.updateSecondStageLabour(id, updateData);
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
const deleteSecondStageLabour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await secondStageLabourDao.deleteSecondStageLabour(id);
    
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

const getSecondStageLabourPaginated = async (req: Request, res: Response) => {
  try {
    const { page, limit, searchText, ...filters } = req.query;
    
    const result = await secondStageLabourDao.getSecondStageLabourPaginated(
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
  createSecondStageLabour,
  getSecondStageLabour,
  getSecondStageLabourById,
  getSecondStageLabourByPatientId,
  updateSecondStageLabour,
  //deleteSecondStageLabour,
  getSecondStageLabourPaginated,
 
};
