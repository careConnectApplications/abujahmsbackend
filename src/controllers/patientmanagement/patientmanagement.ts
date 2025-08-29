import { NextFunction, Request, Response } from "express";
import moment from "moment";
import mongoose from "mongoose";
import * as path from 'path';
import {readonehmomanagement} from "../../dao/hmomanagement";
import { v4 as uuidv4 } from 'uuid';
import configuration from "../../config";
import { readoneprice } from "../../dao/price";
import { createpayment } from "../../dao/payment";
import { createvitalcharts } from "../../dao/vitalcharts";
import { mail, generateRandomNumber, validateinputfaulsyvalue, uploaddocument, convertexceltojson, storeUniqueNumber,calculateAmountPaidByHMO } from "../../utils/otherservices";

import { createappointment } from "../../dao/appointment";
import { createaudit } from "../../dao/audit";
import { createpatient, createpatientifnotexit, readallpatient, readallpatientpaginated, readonepatient, updatepatient, updatepatientbyanyquery, updatepatientmanybyquery } from "../../dao/patientmanagement";
import { readonepricemodel } from "../../dao/pricingmodel";
import {readonehmocategorycover} from "../../dao/hmocategorycover";
import { ApiError } from "../../errors";
import catchAsync from "../../utils/catchAsync";
import { createDeflateRaw } from "zlib";
import {selectPatientStrategy,PatientRegistrationContext} from "./patientmanagement.helper"




//search patients 
export async function searchpartient(req: any, res: any) {
  try {
    //var settings = await configuration.settings();
    var selectquery = {
      "title": 1, "firstName": 1, "status": 1, "middleName": 1, "lastName": 1, "country": 1, "stateOfResidence": 1, "LGA": 1, "address": 1, "age": 1, "dateOfBirth": 1, "gender": 1, "nin": 1, "phoneNumber": 1, "email": 1, "oldMRN": 1, "nextOfKinName": 1, "nextOfKinRelationship": 1, "nextOfKinPhoneNumber": 1, "nextOfKinAddress": 1,
      "maritalStatus": 1, "disability": 1, "occupation": 1, "isHMOCover": 1, "HMOName": 1, "HMOId": 1, "HMOPlan": 1, "MRN": 1, "createdAt": 1, "passport": 1
    };
    const { searchparams } = req.params;

    const queryresult = await readallpatient({
      $or:
        [
          // { lastName: { $regex: searchparams, $options: 'i' } },
          // { firstName: { $regex: searchparams, $options: 'i' } },
          {
            "$expr": {
              "$regexMatch": {
                "input": {
                  "$concat": [
                    { "$ifNull": ["$firstName", ""] },
                    " ",
                    { "$ifNull": ["$lastName", ""] }
                  ]
                },
                "regex": searchparams,
                "options": "i"
              }
            }
          },
          { HMOId: { $regex: searchparams, $options: 'i' } },
          { MRN: { $regex: searchparams, $options: 'i' } },
          { phoneNumber: { $regex: searchparams, $options: 'i' } }]
    }, selectquery, '', '');

    res.status(200).json({
      queryresult,
      status: true
    });


  }
  catch (e: any) {

  }
}
export async function getallhmopatients(req: Request, res: any) {
  try {
    //var settings = await configuration.settings();
    var selectquery = {
      "title": 1, "firstName": 1, "status": 1, "middleName": 1, "lastName": 1, "country": 1, "stateOfResidence": 1, "LGA": 1, "address": 1, "age": 1, "dateOfBirth": 1, "gender": 1, "nin": 1, "phoneNumber": 1, "email": 1, "oldMRN": 1, "nextOfKinName": 1, "nextOfKinRelationship": 1, "nextOfKinPhoneNumber": 1, "nextOfKinAddress": 1,
      "maritalStatus": 1, "subscriptionPaidUntil":1, "disability": 1, "occupation": 1, "isHMOCover": 1, "HMOName": 1, "HMOId": 1, "HMOPlan": 1, "MRN": 1, "createdAt": 1, "passport": 1
    };
    //var populatequery="payment";
    const queryresult = await readallpatient({ isHMOCover: configuration.ishmo[1] }, selectquery, '', '');
    res.status(200).json({
      queryresult,
      status: true
    });

  }
  catch (e: any) {
    res.status(403).json({ status: false, msg: e.message });

  }

}


//bulk upload users
export async function bulkuploadhmopatients(req: any, res: any) {
  try {
    const { firstName, lastName } = (req.user).user;
    var actor = `${firstName} ${lastName}`;
    const file = req.files.file;
    const { HMOName } = req.body;
    const filename = configuration.hmouploadfilename;
    let allowedextension = ['.csv', '.xlsx'];
    let uploadpath = `${process.cwd()}/${configuration.useruploaddirectory}`;
    //acieve document
    await updatepatientmanybyquery({ HMOName }, { status: configuration.status[15] });
     const gethmo = await readonehmomanagement({hmoname:HMOName},{_id:1,hmopercentagecover:1});
    if(!gethmo){
      throw new Error("HMONAME does not exist");
    }
   
    //await createpatientachieve(patientdetails);
    //delete patient management
    //await deletePatietsByCondition({HMOName});
    var columnmapping = {
      A: "title",
      B: "firstName",
      C: "middleName",
      D: "lastName",
      E: "country",
      F: "stateOfResidence",
      G: "LGA",
      H: "address",
      I: "age",
      J: "dateOfBirth",
      K: "gender",
      L: "nin",
      M: "phoneNumber",
      N: "email",
      O: "oldMRN",
      P: "nextOfKinName",
      Q: "nextOfKinRelationship",
      R: "nextOfKinPhoneNumber",
      S: "nextOfKinAddress",
      T: "maritalStatus",
      U: "disability",
      V: "occupation",
      W: "HMOPlan",
      X: "HMOId"



    };

    await uploaddocument(file, filename, allowedextension, uploadpath);
    //convert uploaded excel to json
    var convert_to_json = convertexceltojson(`${uploadpath}/${filename}${path.extname(file.name)}`, configuration.hmotemplate, columnmapping);

    //save to database
    var { hmo } = convert_to_json;
    if (hmo.length > 0) {
      for (var i = 0; i < hmo.length; i++) {
        hmo[i].isHMOCover = configuration.ishmo[1];
        hmo[i].HMOName = HMOName;
        hmo[i].insurance=gethmo._id;
        const { phoneNumber, firstName, lastName, gender, HMOId } = hmo[i];
        validateinputfaulsyvalue({ phoneNumber, firstName, lastName, gender, HMOId });
        console.log((phoneNumber.toString()).length);
        if ((phoneNumber.toString()).length !== 11 && (phoneNumber.toString()).length !== 10) {
          throw new Error(`${phoneNumber} ${configuration.error.errorelevendigit}`);

        }
        if (hmo[i].dateOfBirth) hmo[i].age = moment().diff(moment(hmo[i].dateOfBirth), 'years');
        //if not dateObirth but age calculate date of birth
        if (!hmo[i].dateOfBirth && hmo[i].age) hmo[i].dateOfBirth = moment().subtract(Number(hmo[i].age), 'years').format('YYYY-MM-DD');
        /*
        const foundUser:any =  await readonepatient({phoneNumber},{},'','');
        //category
        if(foundUser && phoneNumber !== configuration.defaultphonenumber){
            throw new Error(`Patient already exists`);
 
        }
            */
        var uniqunumber = await storeUniqueNumber(4);
        // chaorten the MRN to alphanumeric 
        hmo[i].MRN = uniqunumber;
        hmo[i].status = configuration.status[1];
        hmo[i].password = configuration.defaultPassword;

        const createpatientqueryresult = await createpatientifnotexit({ HMOId: hmo[i].HMOId, HMOName }, hmo[i]);
      }
    }

    await createaudit({ action: "Bulk Uploaded HMO Patient", actor, affectedentity: HMOName });
    res.status(200).json({ status: true, queryresult: 'Bulk upload was successfull' });
  }
  catch (e: any) {
    //logger.error(e.message);
    res.status(403).json({ status: false, msg: e.message });

  }
}


//update authorization code

export async function updateauthorizationcode(req: any, res: any) {
  try {
    //get id
    const { id } = req.params;
    const { authorizationcode } = req.body;
    var queryresult = await updatepatient(id, { authorizationcode });
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });

  }

}

export var createpatients = async (req: any, res: any) => {
  try {
    const appointmentid: any = String(Date.now());
    const { dateOfBirth,phoneNumber,isHMOCover,alternatePhoneNumber,bloodGroup, genotype, bp, heartRate, temperature } = req.body;
    const clinicalInformation = {
      bloodGroup, genotype, bp, heartRate, temperature
    }

    req.body.clinicalInformation = clinicalInformation;
    var uniqunumber = await storeUniqueNumber(4);
    // chaorten the MRN to alphanumeric 
    req.body.MRN = uniqunumber;
    req.body.password = configuration.defaultPassword;
    req.body.appointmentcategory = configuration.category[3];
    req.body.appointmenttype = configuration.category[3];


    if (!(req.body.isHMOCover)) {
      req.body.isHMOCover = configuration.ishmo[0];
    }
    if (phoneNumber.length !== 11) {
      throw new Error(configuration.error.errorelevendigit);
    }

    if (alternatePhoneNumber && alternatePhoneNumber.length !== 11) {
      throw new Error(configuration.error.errorelevendigit);
    }


    if (dateOfBirth) req.body.age = moment().diff(moment(dateOfBirth), 'years');
    //if not dateObirth but age calculate date of birth
    if (!dateOfBirth && req.body.age) req.body.dateOfBirth = moment().subtract(Number(req.body.age), 'years').format('YYYY-MM-DD');


    if (!(isHMOCover == configuration.ishmo[1] || isHMOCover == true)) {
      delete req.body.authorizationcode;
      delete req.body.facilitypateintreferedfrom;
    }
      var selectquery = {
      "title": 1, "firstName": 1, "middleName": 1, "lastName": 1, "country": 1, "stateOfResidence": 1, "LGA": 1, "address": 1, "age": 1, "dateOfBirth": 1, "gender": 1, "nin": 1, "phoneNumber": 1, "email": 1, "oldMRN": 1, "nextOfKinName": 1, "nextOfKinRelationship": 1, "nextOfKinPhoneNumber": 1, "nextOfKinAddress": 1,
      "maritalStatus": 1, "disability": 1, "occupation": 1, "isHMOCover": 1, "HMOName": 1, "HMOId": 1, "HMOPlan": 1, "MRN": 1, "createdAt": 1, "passport": 1
    };
    const foundUser: any = await readonepatient({ phoneNumber }, selectquery, '', '');
    //category
    if (foundUser && phoneNumber !== configuration.defaultphonenumber) {
      throw new Error(`Patient already exists`);

    }
    // fetch prices
    const [
      newRegistrationPrice,
      annualsubscriptionnewRegistrationPrice,
      cardfeenewRegistrationPrice,
    ] = await Promise.all([
      readoneprice({
        servicecategory: configuration.category[3],
        servicetype: configuration.category[3],
      }),
      readoneprice({
        servicecategory: configuration.category[8],
        servicetype: configuration.category[8],
      }),
      readoneprice({
        servicecategory: configuration.category[9],
        servicetype: configuration.category[9],
      }),
    ]);

    if (!newRegistrationPrice || !annualsubscriptionnewRegistrationPrice || !cardfeenewRegistrationPrice) {
      throw new Error(
        `Price for ${configuration.category[3]} or ${configuration.category[8]} or ${configuration.category[9]} is not set`
      );
    }

    // pick strategy
    const strategy = selectPatientStrategy(req.body.isHMOCover);
    const context = PatientRegistrationContext(strategy);

    const result = await context.execute({
      reqBody: req.body,
      appointmentid,
      newRegistrationPrice,
      annualsubscriptionnewRegistrationPrice,
      cardfeenewRegistrationPrice,
    });

    res.status(200).json({ queryresult: result, status: true });
  } catch (error: any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};
//add patiient
//read all patients
export async function getallpatients(req: any, res: any) {
  try {
    //apply pagination
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    const filter: any = {};

    // Add filters based on query parameters
    if (req.query.firstName) {
      //console.log(req.query.firstName)
      filter.firstName = new RegExp(req.query.firstName, 'i'); // Case-insensitive search for name
    }
    if (req.query.MRN) {

      filter.MRN = new RegExp(req.query.MRN, 'i');
    }
    if (req.query.HMOId) {
      filter.HMOId = new RegExp(req.query.HMOId, 'i'); // Case-insensitive search for email
    }
    if (req.query.lastName) {
      filter.lastName = new RegExp(req.query.lastName, 'i'); // Case-insensitive search for email
    }
    if (req.query.phoneNumber) {
      filter.phoneNumber = new RegExp(req.query.phoneNumber, 'i'); // Case-insensitive search for email
    }
    if (req.query.email) {
      filter.email = new RegExp(req.query.email, 'i'); // Case-insensitive search for email
    }



    //var settings = await configuration.settings();
    var selectquery = {
      "title": 1, "firstName": 1, "status": 1, "middleName": 1, "lastName": 1, "country": 1, "stateOfResidence": 1, "LGA": 1, "address": 1, "age": 1, "dateOfBirth": 1, "gender": 1, "nin": 1, "phoneNumber": 1, "email": 1, "oldMRN": 1, "nextOfKinName": 1, "nextOfKinRelationship": 1, "nextOfKinPhoneNumber": 1, "nextOfKinAddress": 1,
      "maritalStatus": 1, "disability": 1,"subscriptionPaidUntil":1,"subscriptionExpired":1, "occupation": 1, "isHMOCover": 1, "HMOName": 1, "HMOId": 1, "HMOPlan": 1, "MRN": 1, "createdAt": 1, "passport": 1, "authorizationcode": 1, "patienttype": 1
    };
    //var populatequery="payment";

    var populatequery = {
      path: "payment",
      // match: { paymentcategory: { $eq: settings.servicecategory[0].category } },
      match: { paymentcategory: { $eq: configuration.category[3] } },
      select: {
        status: 1,
        paymentype: 1
      },
    };
    var populateappointmentquery = "appointment";
    const queryresult = await readallpatientpaginated(filter, selectquery, populatequery, populateappointmentquery, page, size);
    res.status(200).json({
      queryresult,
      status: true
    });

  }
  catch (e: any) {
    res.status(403).json({ status: false, msg: e.message });

  }

}
//get record for a particular patient
export async function getonepatients(req: any, res: any) {
  const { id } = req.params;
  try {
    var selectquery = {
      "title": 1, "firstName": 1, "middleName": 1, "lastName": 1, "country": 1, "stateOfResidence": 1, "LGA": 1, "address": 1, "age": 1, "dateOfBirth": 1, "gender": 1, "nin": 1, "phoneNumber": 1, "email": 1, "oldMRN": 1, "nextOfKinName": 1, "nextOfKinRelationship": 1, "nextOfKinPhoneNumber": 1, "nextOfKinAddress": 1,
      "maritalStatus": 1, "disability": 1, "occupation": 1, "isHMOCover": 1, "HMOName": 1, "HMOId": 1, "HMOPlan": 1, "MRN": 1, "createdAt": 1, "passport": 1
    };
    var populatequery = 'payment';
    const queryresult = await readonepatient({ _id: id }, selectquery, populatequery, 'appointment');
    res.status(200).json({
      queryresult,
      status: true
    });

  }
  catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });

  }

}


//update a patient
export const updatepatients = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

  //get id
  const { id, status } = req.params;
  const { bloodGroup, genotype, bp, heartRate, temperature, specialNeeds } = req.body
  //reject if status update
  if (status) {

  }
  if (!id) return next(new ApiError(400, "Patient Id is not provided!"));

  const _Id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);

  const foundPatient: any = await readonepatient({ _id: _Id }, {}, '', '');

  if (!foundPatient) {
    return next(new ApiError(404, `Patient do not already exists`));
  }
  const clinicalInformation = {
    bloodGroup, genotype, bp, heartRate, temperature
  }

  req.body.clinicalInformation = clinicalInformation;

  var queryresult = await updatepatient(id, req.body);

  if (!queryresult) return next(new ApiError(401, "update failed"));

  res.status(200).json({
    queryresult,
    status: true
  });
})

//upload patients photo
export var uploadpix = async (req: any, res: any) => {
  try {
    console.log(req.files);
    const file = req.files.file;
    const fileName = file.name;
    const filename = "patientpassport" + uuidv4();
    let allowedextension = ['.jpg', '.png', '.jpeg'];
    let uploadpath = `${process.cwd()}/${configuration.useruploaddirectory}`;
    const extension = path.extname(fileName);
    const renamedurl = `${filename}${extension}`;
    //upload pix to upload folder
    await uploaddocument(file, filename, allowedextension, uploadpath);
    const { id } = req.params;

    //update pix name in patient
    const queryresult = await updatepatient(id, { passport: renamedurl });
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

export const updatePatientToHmo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) return next(new ApiError(400, "Patient Id is not provided!"));

  //const _appointmentId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(appointmentId);
  const _Id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);

  ///Step 2: Read the Appointment and populate the patient field.
  const foundPatient: any = await readonepatient({ _id: _Id }, {}, '', '');
  /// fetch patient info
  if (!foundPatient) {
    return next(new ApiError(404, `Patient do not already exists`));
  }

  /// check if patient hmo is false
  if (foundPatient.isHMOCover === configuration.ishmo[1]) {
    return next(new ApiError(401, `patient already has an HMO`));
  }


  /// if hmo is true return an error
  /// then convert to true
  const updatedPatient = await updatepatient(id, { isHMOCover: configuration.ishmo[1], previouslyNotHmo: true });
  /// save db

  res.status(200).json({
    status: true,
    message: "patient hmo info updated successfully",
    data: updatedPatient
  })
});

export const updatePatientClinicalInformation = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const { bloodGroup, genotype, bp, heartRate, temperature, specialNeeds } = req.body

  if (!id) return next(new ApiError(400, "Patient Id is not provided!"));

  const _Id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);

  const { _id: userId } = (req.user).user;

  const foundPatient: any = await readonepatient({ _id: _Id }, {}, '', '');

  if (!foundPatient) {
    return next(new ApiError(404, `Patient do not already exists`));
  }

  const clinicalInformation = {
    bloodGroup, genotype, bp, heartRate, temperature
  }

  const updatedPatient = await updatepatientbyanyquery(_Id, {
    clinicalInformation: clinicalInformation,
    specialNeeds,
    updatedBy: userId
  });

  res.status(200).json({
    status: true,
    data: updatedPatient
  })
});

export const updatePatientFluidBalancing = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { totalInput, totalOutput } = req.body;
  const { patientId } = req.params;
  const { _id: userId } = (req.user).user;

  if (!patientId) {
    return next(new ApiError(400, configuration.error.errorPatientIdIsRequired));
  }

  const _patientId = new mongoose.Types.ObjectId(patientId);

  const patient: any = await readonepatient({ _id: _patientId }, {}, '', '');
  if (!patient) {
    return next(new ApiError(404, "Patient not found."));
  }

  const balance = (totalInput || 0) - (totalOutput || 0);

  const newFluidRecord = {
    totalInput,
    totalOutput,
    balance,
    createdBy: userId,
  };

  const updatedPatient = await updatepatientbyanyquery(_patientId, {
    $push: {
      fluidBalance: newFluidRecord
    }
  });

  res.status(200).json({
    status: true,
    data: updatedPatient
  })
});