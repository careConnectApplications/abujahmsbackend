import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import configuration from "../../config";
import { readoneadmission } from "../../dao/admissions";
import { createfluidbalances, readallfluidbalances, readonefluidbalances, updatefluidbalances } from "../../dao/fluidbalance";
import catchAsync from "../../utils/catchAsync";
import { validateinputfaulsyvalue } from "../../utils/otherservices";
import admission from '../../models/admission';
const { ObjectId } = mongoose.Types;

// Get all lab records
export const readallfluidbalanceByAdmission = async (req: any, res: any) => {
  try {
    const { admission } = req.params;
    const queryresult = await readallfluidbalances({ admission }, { intaketype: 1, intakeroute: 1, intakeamount: 1, outputtype: 1, outputroute: 1, outputamount: 1, staffname: 1, createdAt: 1, updatedAt: 1 }, '', '');
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
    const queryresult = await readallfluidbalances({ patient }, { intaketype: 1, intakeroute: 1, intakeamount: 1, outputtype: 1, outputroute: 1, outputamount: 1, staffname: 1, createdAt: 1, updatedAt: 1 }, '', '');
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
export const createfluidbalance = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

  const { id } = req.params;
  const { firstName, lastName, _id: userId } = (req.user).user;

  req.body.staffname = `${firstName} ${lastName}`;
  var { outputamount, inputamount, patientId, referedward } = req.body;
  // var { oralfluids,tubefeedingvolume,IVfluidtype,IVfluidvolume,IVfluidrate,medication,urineoutput,stoolfrequency,consistency,stoolamount,vomitamount,drainage,totalintake,totaloutput,netfliudbalancefor24hours,staffname} = req.body;
  validateinputfaulsyvalue({ inputamount, outputamount });
  //frequency must inlcude
  //route must contain allowed options

  const admissionrecord: any = await readoneadmission({ _id: id }, {}, '');
  //console.log(admissionrecord);   
  if (!admissionrecord) {
    throw new Error(`Admission do not ${configuration.error.erroralreadyexit}`);
  }

  const balance = (inputamount || 0) - (outputamount || 0);

  const newFluidRecord = {
    admission: id,
    referedward,
    patient: patientId,
    inputamount,
    outputamount,
    balance,
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
    var { outputamount, inputamount } = req.body;

    const fluidRecord: any = await readonefluidbalances({ _id: id }, {});
    //console.log(admissionrecord);   
    if (!fluidRecord) {
      throw new Error(`fluid record do not ${configuration.error.erroralreadyexit}`);
    }

    const balance = (inputamount || 0) - (outputamount || 0);

    const newFluidRecord = {
      inputamount,
      outputamount,
      balance,
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



