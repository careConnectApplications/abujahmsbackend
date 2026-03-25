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
import {readoneadmission} from  "../../dao/admissions";
const { ObjectId } = mongoose.Types;


// 🔍 Read all evaluations by patient
export const readAllPsychiatricByPatient = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
 
    const { patient } = req.params; 
    const { page = 1, limit = 150} = req.query;
     const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { patientId: patient };
    const select = {};
    const populate = "patientId";
    const secondpopulate = "appointmentId";

    const queryresult = await readAllPsychiatricEvaluations(query, select, populate, secondpopulate,skip, parseInt(limit));

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
      appointmentoradmissionunderscoreid
    } = req.body;
    validateinputfaulsyvalue({ id, appointmentoradmissionunderscoreid});
    const patient:any = await readonepatient({ _id: id }, {}, '', '');
    if (!patient) {
      next(new Error(`Patient does not exist already exists`));
    }
    var checkappointmentId=new ObjectId(appointmentoradmissionunderscoreid);
    //validate appointment id
    var appointment:any = await readoneappointment({ _id:checkappointmentId }, {}, '');
     var checkadimmison = await readoneadmission({ _id: checkappointmentId }, {}, '');
    var appointmentId;
   var admissionId;
    if (checkadimmison) {
        admissionId =checkappointmentId;
  
      }
       if (appointment) {
    appointmentId=checkappointmentId;
  }
   


    const input = {
      patientId: patient._id,
      appointmentId,
      admissionId,
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
