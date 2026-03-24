<<<<<<< HEAD
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import configuration from "../../config";
import { readoneadmission } from "../../dao/admissions";
import { createfluidbalances, createMultifluidbalances, readallfluidbalances, readonefluidbalances, updatefluidbalances } from "../../dao/fluidbalance";
import { ApiError } from '../../errors';
import catchAsync from "../../utils/catchAsync";
import { parseDate, validateinputfaulsyvalue } from "../../utils/otherservices";
=======
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import configuration from "../../config";
import { readoneadmission } from "../../dao/admissions";
import { createfluidbalances, readallfluidbalances, readonefluidbalances, updatefluidbalances } from "../../dao/fluidbalance";
import catchAsync from "../../utils/catchAsync";
import { validateinputfaulsyvalue } from "../../utils/otherservices";
import admission from '../../models/admission';
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
const { ObjectId } = mongoose.Types;

// Get all lab records
export const readallfluidbalanceByAdmission = async (req: any, res: any) => {
  try {
    const { admission } = req.params;
<<<<<<< HEAD
    const queryresult = await readallfluidbalances({ admission }, {
      inputamount: 1, balance: 1, outputamount: 1, patient: 1,
      createdBy: 1,
      staffname: 1,
      createdAt: 1,
      updatedAt: 1,
      intaketype: 1,
      intakeroute: 1,
      outputtype: 1,
      outputroute: 1,
      observationalNotes: 1, dateTo: 1, dateFrom: 1
    }, 'patient createdBy', '');
=======
    const queryresult = await readallfluidbalances({ admission }, { inputamount: 1, balance: 1, outputamount: 1, patient: 1, createdBy: 1, staffname: 1, createdAt: 1, updatedAt: 1 }, 'patient createdBy', '');
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (error: any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};
//get lab order by patient
export const readAllfluidbalanceByPatient = async (req: any, res: any) => {
  try {
    //const {clinic} = (req.user).user;
    const { patient } = req.params;
    //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
<<<<<<< HEAD
    const queryresult = await readallfluidbalances({ patient }, {
      patient: 1,
      inputamount: 1,
      staffname: 1,
      outputamount: 1,
      balance: 1,
      createdBy: 1,
      createdAt: 1,
      intaketype: 1,
      intakeroute: 1,
      outputtype: 1,
      outputroute: 1,
      observationalNotes: 1, dateTo: 1, dateFrom: 1,
      updatedAt: 1
    }, 'patient createdBy', '');
=======
    const queryresult = await readallfluidbalances({ patient }, { patient: 1, inputamount: 1, staffname: 1, outputamount: 1, balance: 1, createdBy: 1, createdAt: 1, updatedAt: 1 }, 'patient createdBy', '');
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (error: any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};

//create vital charts
// Create a new schedule
<<<<<<< HEAD
export const createfluidbalancev1 = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
=======
export const createfluidbalance = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

  const { id } = req.params;
  const { firstName, lastName, _id: userId } = (req.user).user;

  req.body.staffname = `${firstName} ${lastName}`;
<<<<<<< HEAD
  var { outputamount, inputamount, patientId, referedward, intakeroute, intaketype, outputtype, outputroute } = req.body;
=======
  var { outputamount, inputamount, patientId, referedward } = req.body;
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  // var { oralfluids,tubefeedingvolume,IVfluidtype,IVfluidvolume,IVfluidrate,medication,urineoutput,stoolfrequency,consistency,stoolamount,vomitamount,drainage,totalintake,totaloutput,netfliudbalancefor24hours,staffname} = req.body;
  validateinputfaulsyvalue({ inputamount, outputamount });
  //frequency must inlcude
  //route must contain allowed options

  const admissionrecord: any = await readoneadmission({ _id: id }, {}, '');
  //console.log(admissionrecord);   
  if (!admissionrecord) {
<<<<<<< HEAD
    throw new Error(`Admission do not already exists`);
=======
    throw new Error(`Admission do not ${configuration.error.erroralreadyexit}`);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  }

  const balance = (inputamount || 0) - (outputamount || 0);

  const newFluidRecord = {
    admission: id,
    referedward,
    patient: patientId,
    inputamount,
    outputamount,
    balance,
<<<<<<< HEAD
    intaketype,
    intakeroute,
    outputtype,
    outputroute,
=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    createdBy: userId,
  };

  // const queryresult=await createfluidbalances({referedward:admissionrecord.referedward,admission:admissionrecord._id,patient:admissionrecord.patient,oralfluids,tubefeedingvolume,IVfluidtype,IVfluidvolume,IVfluidrate,medication,urineoutput,stoolfrequency,consistency,stoolamount,vomitamount,drainage,totalintake,totaloutput,netfliudbalancefor24hours,staffname});
  const queryresult = await createfluidbalances(newFluidRecord);
  res.status(200).json({ queryresult, status: true });

})


//insulin

export async function updatefluidbalance(req: any, res: any) {
  try {
    //get id
    const { id } = req.params;
    const { firstName, lastName, _id: userId } = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
<<<<<<< HEAD
    var {
      outputamount,
      inputamount,
      intakeroute,
      intaketype,
      outputtype,
      outputroute,
      observationalNotes, dateTo, dateFrom
    } = req.body;
=======
    var { outputamount, inputamount } = req.body;
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    const fluidRecord: any = await readonefluidbalances({ _id: id }, {});
    //console.log(admissionrecord);   
    if (!fluidRecord) {
<<<<<<< HEAD
      throw new Error(`fluid record do not already exists`);
=======
      throw new Error(`fluid record do not ${configuration.error.erroralreadyexit}`);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    }

    const balance = (inputamount || 0) - (outputamount || 0);

    const newFluidRecord = {
      inputamount,
      outputamount,
      balance,
<<<<<<< HEAD
      intaketype,
      intakeroute,
      outputtype,
      outputroute,
      observationalNotes,
      dateTo: parseDate(dateTo) || null,
      dateFrom: parseDate(dateFrom) || null,
=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
      updatedBy: userId,
    };

    validateinputfaulsyvalue({ inputamount, outputamount });
    var queryresult = await updatefluidbalances(id, newFluidRecord);
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });

  }

}

<<<<<<< HEAD
export const createfluidbalance = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { firstName, lastName, _id: userId } = (req.user).user;

  req.body.staffname = `${firstName} ${lastName}`;
  const { patientId, fluidRecords } = req.body;

  if (!fluidRecords) {
    return next(new ApiError(404, `fluidRecords do not ${configuration.error.erroralreadyexit}, pass it as *fluidRecords* in the json`));
  }

  // Validate fluidRecords
  if (!fluidRecords || !Array.isArray(fluidRecords) || fluidRecords.length === 0) {
    return next(new ApiError(400, "fluidRecords is required and must be an array"));
  }

  const admissionrecord: any = await readoneadmission({ _id: id }, {}, '');
  if (!admissionrecord) {
    return next(new ApiError(404, `Admission do not already exists`));
  }


  let newFluidRecord = [];

  for (const record of fluidRecords) {
    var { outputamount, inputamount, referedward, intakeroute, intaketype, outputtype, outputroute, observationalNotes, dateTo, dateFrom } = record;
    // var { oralfluids,tubefeedingvolume,IVfluidtype,IVfluidvolume,IVfluidrate,medication,urineoutput,stoolfrequency,consistency,stoolamount,vomitamount,drainage,totalintake,totaloutput,netfliudbalancefor24hours,staffname} = req.body;
    validateinputfaulsyvalue({ inputamount, outputamount });

    const balance = (inputamount || 0) - (outputamount || 0);

    newFluidRecord.push({
      admission: id,
      referedward,
      patient: patientId,
      inputamount,
      outputamount,
      balance,
      intaketype,
      intakeroute,
      outputtype,
      outputroute,
      observationalNotes,
      dateTo: parseDate(dateTo) || null,
      dateFrom: parseDate(dateFrom) || null,
      createdBy: userId,
    })
  }
  // const queryresult=await createfluidbalances({referedward:admissionrecord.referedward,admission:admissionrecord._id,patient:admissionrecord.patient,oralfluids,tubefeedingvolume,IVfluidtype,IVfluidvolume,IVfluidrate,medication,urineoutput,stoolfrequency,consistency,stoolamount,vomitamount,drainage,totalintake,totaloutput,netfliudbalancefor24hours,staffname});
  const queryresult = await createMultifluidbalances(newFluidRecord);
  res.status(200).json({ queryresult, status: true });
})
=======


>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
