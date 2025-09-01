import mongoose from 'mongoose';
import { validateinputfaulsyvalue, uploaddocument } from "../../utils/otherservices";
import { readonepatient } from "../../dao/patientmanagement";
import { readoneappointment } from "../../dao/appointment";
import { readallprocedure, updateprocedure, readoneprocedure } from "../../dao/procedure";
import { readoneprice } from "../../dao/price";
import { updatepayment, readonepayment } from "../../dao/payment";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import {readonehmocategorycover} from "../../dao/hmocategorycover";
const { ObjectId } = mongoose.Types;
import catchAsync from "../../utils/catchAsync";
import { HmoProcedureStrategy, SelfPayProcedureStrategy, ProcedureScheduleContext } from "./procedure.helper";
import { Response, NextFunction } from 'express'; 



import configuration from "../../config";
export const scheduleprocedureorder = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  let { procedure, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes, appointmentid,proceduretype } = req.body;

  const { firstName, lastName } = (req.user).user;
  const raiseby = `${firstName} ${lastName}`;
  const procedureid: string = String(Date.now());

  validateinputfaulsyvalue({ id, procedure,proceduretype });

  // find patient
  const foundPatient: any = await readonepatient({ _id: id }, {}, "", "");
  if (!foundPatient) {
    throw new Error(`Patient already exists`);
  }
console.log("foundPatient", foundPatient?.insurance);
  // HMO coverage %
  const insurance: any = await readonehmocategorycover(
    { hmoId: foundPatient?.insurance, category: configuration.category[5] },
    { hmopercentagecover: 1 }
  );
  console.log("insurance",insurance);
  const hmopercentagecover = insurance?.hmopercentagecover ?? 0;

  // validate appointment if provided
  let appointment: any;
  if (appointmentid) {
    appointmentid = new ObjectId(appointmentid);
    appointment = await readoneappointment({ _id: appointmentid }, {}, "");
    if (!appointment) {
      throw new Error(`Appointment already exists`);
    }
  }

  // 🔑 Strategy: HMO vs Self-Pay
  const strategyFn =
    !(foundPatient.isHMOCover == configuration.ishmo[1] || foundPatient.isHMOCover == true)
      ? SelfPayProcedureStrategy
      : HmoProcedureStrategy;

  const context = ProcedureScheduleContext(strategyFn);

  const queryresult = await context.execute({
    id,
    procedure,    clinic,
    indicationdiagnosisprocedure,
    appointmentdate,
    cptcodes,
    dxcodes,
    appointmentid,
    raiseby,
    procedureid,
    foundPatient,
    hmopercentagecover,
    proceduretype
  });

  res.status(200).json({ queryresult, status: true });
});

/*
export var scheduleprocedureorder = async (req: any, res: any) => {
  try {
    //accept _id from request
    const { id } = req.params;
    var { procedure, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes, appointmentid } = req.body;

    const { firstName, lastName } = (req.user).user;
    const raiseby = `${firstName} ${lastName}`;
    var procedureid: any = String(Date.now());
    var proceduresid = [];
    //var paymentids = [];
    validateinputfaulsyvalue({ id, procedure });
    //find the record in appointment and validate
    const foundPatient: any = await readonepatient({ _id: id }, {}, '', '');
    //category
    if (!foundPatient) {
      throw new Error(`Patient does not exist`);

    }
    let insurance:any = await readonehmocategorycover({hmoId:foundPatient?.insurance, category:configuration.category[5]},{hmopercentagecover:1});
    var hmopercentagecover=insurance?.hmopercentagecover ?? 0;
    var appointment: any;
    if (appointmentid) {
      appointmentid = new ObjectId(appointmentid);
      appointment = await readoneappointment({ _id: appointmentid }, {}, '');
      if (!appointment) {
        //create an appointment
        throw new Error(`Appointment does not exist`);

      }


    }

   
    //loop through all test and create record in lab order
    for (var i = 0; i < procedure.length; i++) {
      //search for price of test name
      var testPrice: any = await readoneprice({ servicetype: procedure[i] });
      if (!testPrice) {
        throw new Error(`${configuration.error.errornopriceset}  ${procedure[i]}`);
      }
      const amount =calculateAmountPaidByHMO(Number(hmopercentagecover), Number(testPrice.amount));

     /*
      let paymentreference;

      //search for patient under admission. if the patient is admitted the patient admission number will be use as payment reference
      var findAdmission = await readoneadmission({ patient: id, status: { $ne: configuration.admissionstatus[5] } }, {}, '');
      if (findAdmission) {
        paymentreference = findAdmission.admissionid;

      }
      else {
        paymentreference = procedureid;
      }
              //create payment
      if (foundPatient?.isHMOCover == configuration.ishmo[0]) {

        var createpaymentqueryresult = await createpayment({ firstName: foundPatient?.firstName, lastName: foundPatient?.lastName, MRN: foundPatient?.MRN, phoneNumber: foundPatient?.phoneNumber, paymentreference, paymentype: procedure[i], paymentcategory: configuration.category[5], patient: id, amount: Number(testPrice.amount) })

        //create testrecordn 
        var procedurerecord = await createprocedure({ procedure: procedure[i], patient: id, payment: createpaymentqueryresult._id, procedureid, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes, raiseby });
        proceduresid.push(procedurerecord._id);
        paymentids.push(createpaymentqueryresult._id);
      }
      else {
        // var createpaymentqueryresult =await createpayment({paymentreference,paymentype:procedure[i],paymentcategory:testsetting[0].category,patient:id,amount:Number(testPrice.amount)})

        //create testrecordn 
        var procedurerecord = await createprocedure({ procedure: procedure[i], patient: id, procedureid, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes, raiseby });
        proceduresid.push(procedurerecord._id);
        //paymentids.push(createpaymentqueryresult._id);
      }
        */
/*
       var procedurerecord = await createprocedure({ procedure: procedure[i], patient: id, procedureid, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes, raiseby,status: configuration.otherstatus[0],amount });
        proceduresid.push(procedurerecord._id);
       

    }
    let queryresult=await updatepatient(id, { $push: { prcedure: proceduresid } });
/*
    if (foundPatient?.isHMOCover == configuration.ishmo[0]) {
      queryresult = await updatepatient(id, { $push: { prcedure: proceduresid, payment: paymentids } });
    }
    else {
      queryresult = await updatepatient(id, { $push: { prcedure: proceduresid } });

    }
      */
     /*
    if (appointmentid) {
      await updateappointment(appointment._id, { $push: { procedure: proceduresid } });
      //procedure

    }
    res.status(200).json({ queryresult, status: true });

  }
  catch (error: any) {
    console.log("error", error);
    res.status(403).json({ status: false, msg: error.message });

  }

}
*/

//get lab order by patient
export const readAllprocedureByPatient = async (req: any, res: any) => {
  try {

    const { id } = req.params;
    const queryresult = await readallprocedure({ patient: id }, {}, 'patient', 'payment');
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (error: any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};
//get lab order by clinic
export const readAllprocedureByClinic = async (req: any, res: any) => {
  try {

    const { clinic } = req.params;
    const queryresult = await readallprocedure({ clinic }, {}, 'patient', 'payment');
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (error: any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};

//update radiology
export async function updateprocedures(req: any, res: any) {
  try {
    //get id
    const { id } = req.params;
    const { procedure, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes } = req.body;
    validateinputfaulsyvalue({ id, procedure });
    var testPrice: any = await readoneprice({ servicetype: procedure });
    if (!testPrice) {
      throw new Error(`${configuration.error.errornopriceset}  ${procedure}`);
    }
    //      const {servicetypedetails} = await readallservicetype({category: configuration.category[5]},{type:1,category:1,department:1,_id:0});
    //  var testsetting = servicetypedetails.filter(item => (item.type).includes(procedure));
    /*
    if(!testsetting || testsetting.length < 1){
      throw new Error(`${procedure} does not ${configuration.error.erroralreadyexit} in ${configuration.category[5]} as a service type  `);
  }
      */

    //check that the status is not complete
    var myprocedurestatus: any = await readoneprocedure({ _id: id }, {}, '');
    if (myprocedurestatus.status !== configuration.status[9]) {
      throw new Error(`${configuration.error.errortasknotpending} `);
    }

    await updatepayment({ _id: myprocedurestatus.payment }, { paymentype: procedure, amount: Number(testPrice.amount) });
    var queryresult = await updateprocedure(id, { procedure, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes });
    //update price

    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });

  }

}
//process result
//upload patients photo
export var uploadprocedureresult = async (req: any, res: any) => {
  try {
    const { firstName, lastName } = (req.user).user;
    const { id } = req.params;
    var response: any = await readoneprocedure({ _id: id }, {}, 'patient');
    if (response.status !== configuration.status[9]) {
      throw new Error(`Procedure Record ${configuration.error.errortasknotpending}`);
    }
    const { patient } = response;
    //validate payment
    if (patient.isHMOCover == configuration.ishmo[0]) {
      var paymentrecord: any = await readonepayment({ _id: response.payment });
      if (paymentrecord.status !== configuration.status[3]) {
        throw new Error(configuration.error.errorpayment);

      }
    }
    const processby = `${firstName} ${lastName}`;
    const file = req.files.file;
    const { procedureoutcome } = req.body;
    //procedureoutcome
    const fileName = file.name;
    const filename = "procedure" + uuidv4();
    let allowedextension = ['.jpg', '.png', '.jpeg', '.pdf'];
    let uploadpath = `${process.cwd()}/${configuration.useruploaddirectory}`;
    const extension = path.extname(fileName);
    const renamedurl = `${filename}${extension}`;
    //upload pix to upload folder
    await uploaddocument(file, filename, allowedextension, uploadpath);


    //update pix name in patient
    const queryresult = await updateprocedure(id, { $push: { procedureresult: renamedurl }, status: configuration.status[7], processby, procedureoutcome });
    res.json({
      queryresult,
      status: true
    });


  }
  catch (e: any) {


    //logger.error(e.message);
    res.json({ status: false, msg: e.message });

  }

}

