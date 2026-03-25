import { Request, Response } from "express";
import birthRegisterDao from "../../dao/birthregister";
import config from "../../config";
import { validateinputfaulsyvalue } from "../../utils/otherservices";

const createBirthRegister = async (req: Request, res: Response) => {
  try {
    const { body, user } = req as any;
    const { _id } = user.user;
    
    // Validate required fields for birth registration
    const { dateOfChildRegistration, sex } = body;
    validateinputfaulsyvalue({ dateOfChildRegistration, sex });
    
    const birthRegisterData = {
      ...body,
      // Note: Birth register doesn't have a doctor field, just patient reference
    };

    const result = await birthRegisterDao.createBirthRegister(birthRegisterData);
    
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

const getBirthRegister = async (req: Request, res: Response) => {
  try {
    const { limit, skip, searchText } = req.query;
    
    const result = await birthRegisterDao.readAllBirthRegister(
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
      status: false,
      msg: error.message,
    });
  }
};

const getBirthRegisterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await birthRegisterDao.getBirthRegisterById(id);
    
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

const getBirthRegisterByPatientId = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    
    const result = await birthRegisterDao.getBirthRegisterByPatientId(patientId);
    
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

const updateBirthRegister = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const { firstName, lastName } = (req as any).user.user;
    
    const updateData = {
      ...body,
      updatedBy: `${firstName} ${lastName}`,
    };
    
    const result = await birthRegisterDao.updateBirthRegister(id, updateData);
    
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

// Delete function commented out as per pattern
// const deleteBirthRegister = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
    
//     const result = await birthRegisterDao.deleteBirthRegister(id);
    
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

const getBirthRegisterPaginated = async (req: Request, res: Response) => {
  try {
    const { page, limit, searchText, ...filters } = req.query;
    
    const result = await birthRegisterDao.getBirthRegisterPaginated(
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

/*
const countBirthRegister = async (req: Request, res: Response) => {
  try {
    const result = await birthRegisterDao.countBirthRegister();
    
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
*/
export default {
  createBirthRegister,
  getBirthRegister,
  getBirthRegisterById,
  getBirthRegisterByPatientId,
  updateBirthRegister,
  // deleteBirthRegister,
  getBirthRegisterPaginated,
  //countBirthRegister,
};
