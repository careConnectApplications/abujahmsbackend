import { NextFunction, Request, Response } from "express";
import { validateinputfaulsyvalue, uploaddocument } from "../../utils/otherservices";
import mongoose from 'mongoose';
import {
  readAllPsychiatricEvaluations,
  createPsychiatricEvaluation,
  readOnePsychiatricEvaluation,
  updatePsychiatricEvaluationById
} from "../../dao/psychiatric";
import { readonepatient } from "../../dao/patientmanagement";
import configuration from "../../config";
import { readoneappointment } from "../../dao/appointment";
import catchAsync from "../../utils/catchAsync";
const { ObjectId } = mongoose.Types;


// 🔍 Read all evaluations by patient
export const readAllPsychiatricByPatient = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
 
    const { patient } = req.params;
    const query = { patientId: patient };
    const select = {};
    const populate = "patientId";
    const secondpopulate = "appointmentId";

    const queryresult = await readAllPsychiatricEvaluations(query, select, populate, secondpopulate);

    res.status(200).json({ queryresult, status: true });
 
});

// ➕ Create new psychiatric evaluation
export const createPsychiatricEvaluationController = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
//export const createPsychiatricEvaluationController = async (req: any, res: any) => {
  
    const { id } = req.params; // patient ID
    const { firstName, lastName } = (req.user).user;
    const staffname = `${firstName} ${lastName}`;

    const {
      presentingcomplaints,
      historyofpresentingcomplaints,
      pastpsychiatrichistory,
      pastmedicalandsurgicalhistory,
      familyhistory,
      personaldevelopmenthistory,
      educationhistory,
      occupationhistory,
      psychosocialhistory,
      substanceusehistory,
      forensichistory,
      premorbidhistory,
      assessmentdiagnosis,
      planmanagement,
      appointmentunderscoreid
    } = req.body;
    validateinputfaulsyvalue({ id, appointmentunderscoreid});
    const patient:any = await readonepatient({ _id: id }, {}, '', '');
    if (!patient) {
      next(new Error(`Patient does not exist ${configuration.error.erroralreadyexit}`));
    }
    var appointmentId=new ObjectId(appointmentunderscoreid);
    //validate appointment id
    var appointment:any = await readoneappointment({ _id:appointmentId }, {}, '');
    if (!appointment) {
            //create an appointment
        next(Error(`Appointment donot ${configuration.error.erroralreadyexit}`));
    
    }


    const input = {
      patientId: patient._id,
      appointmentId,
      presentingcomplaints,
      historyofpresentingcomplaints,
      pastpsychiatrichistory,
      pastmedicalandsurgicalhistory,
      familyhistory,
      personaldevelopmenthistory,
      educationhistory,
      occupationhistory,
      psychosocialhistory,
      substanceusehistory,
      forensichistory,
      premorbidhistory,
      assessmentdiagnosis,
      planmanagement,
      createdBy: staffname
    };

    const queryresult = await createPsychiatricEvaluation(input);
    res.status(200).json({ queryresult, status: true });

  
});

// 🔄 Update psychiatric evaluation by ID
export const updatePsychiatricEvaluationController = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

    const { id } = req.params;
    const { firstName, lastName } = (req.user).user;
    const staffname = `${firstName} ${lastName}`;

    const {
      presentingcomplaints,
      historyofpresentingcomplaints,
      pastpsychiatrichistory,
      pastmedicalandsurgicalhistory,
      familyhistory,
      personaldevelopmenthistory,
      educationhistory,
      occupationhistory,
      psychosocialhistory,
      substanceusehistory,
      forensichistory,
      premorbidhistory,
      assessmentdiagnosis,
      planmanagement
    } = req.body;

    const updates = {
      presentingcomplaints,
      historyofpresentingcomplaints,
      pastpsychiatrichistory,
      pastmedicalandsurgicalhistory,
      familyhistory,
      personaldevelopmenthistory,
      educationhistory,
      occupationhistory,
      psychosocialhistory,
      substanceusehistory,
      forensichistory,
      premorbidhistory,
      assessmentdiagnosis,
      planmanagement,
      updatedBy: staffname
    };

    const queryresult = await updatePsychiatricEvaluationById(id, updates);
    res.status(200).json({ queryresult, status: true });

 
});

// Optional: Read one by ID
export const readOnePsychiatricEvaluationController = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const queryresult = await readOnePsychiatricEvaluation({ _id: id }, {});
    res.status(200).json({ queryresult, status: true });
 
});
