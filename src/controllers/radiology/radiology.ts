import mongoose from 'mongoose';
import { validateinputfaulsyvalue, uploaddocument, calculateAmountPaidByHMO, uploadbase64image } from "../../utils/otherservices";
import { readonepatient, updatepatient } from "../../dao/patientmanagement";
import { readoneappointment, updateappointment } from "../../dao/appointment";
import { readallservicetype } from "../../dao/servicetype";
import { createradiology, readallradiology, updateradiology, readoneradiology, optimizedreadallradiology } from "../../dao/radiology";
import { readoneprice } from "../../dao/price";

import { readonepayment } from "../../dao/payment";
import {readonehmocategorycover} from "../../dao/hmocategorycover";

import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { readoneadmission } from "../../dao/admissions";
import { HmoRadiologyConfirmationStrategy, SelfPayRadiologyConfirmationStrategy, RadiologyConfirmationContext } from "./radiology.helper";
import { Response, NextFunction } from 'express';
import catchAsync from "../../utils/catchAsync";

const { ObjectId } = mongoose.Types;




import configuration from "../../config";
//lab order
export var radiologyorder = async (req: any, res: any) => {
  try {

    //accept _id from request
    const { id } = req.params;
    var { testname, note, appointmentid, imageBase64 } = req.body;
    const { firstName, lastName } = (req.user).user;
    const raiseby = `${firstName} ${lastName}`;
    var testid: any = String(Date.now());
    var testsid = [];
    //var paymentids =[];
    validateinputfaulsyvalue({ id, testname, note });
    //find the record in appointment and validate
    const foundPatient: any = await readonepatient({ _id: id }, {}, 'insurance', '');
    //category
    if (!foundPatient) {
      throw new Error(`Patient does not exist`);

    }

    let insurance: any = await readonehmocategorycover({ hmoId: foundPatient?.insurance._id, category: configuration.category[4] }, { hmopercentagecover: 1 });
    console.log("insurance", insurance);
    var hmopercentagecover = insurance?.hmopercentagecover ?? 0;
    var appointment: any;
    if (appointmentid) {
      appointmentid = new ObjectId(appointmentid);
      appointment = await readoneappointment({ _id: appointmentid }, {}, '');
      if (!appointment) {
        //create an appointment
        throw new Error(`Appointment does not exist`);

      }


    }


    let filename;
    if (imageBase64) filename = await uploadbase64image(imageBase64);

    //loop through all test and create record in lab order
    for (var i = 0; i < testname.length; i++) {

      //search for price of test name
      var testPrice: any = await readoneprice({ servicetype: testname[i] });
      console.log("testPrice",testPrice);
      if (!testPrice) {
        throw new Error(`${configuration.error.errornopriceset}  ${testname[i]}`);
      }
      console.log("hmopercentage", hmopercentagecover);
      let amount = calculateAmountPaidByHMO(Number(hmopercentagecover), Number(testPrice.amount));
      console.log("amount", amount);
      //create payment
      //var createpaymentqueryresult =await createpayment({paymentreference:id,paymentype:testname[i],paymentcategory:testsetting[0].category,patient:id,amount:Number(testPrice.amount)})

      let testrecord: any=await createradiology({ hmopercentagecover,
        actualcost:testPrice.amount, note, testname: testname[i], patient: id, testid, raiseby, amount,filename });

      //create testrecordn 
      testsid.push(testrecord._id);
      //paymentids.push(createpaymentqueryresult._id);
    }
    var queryresult = await updatepatient(id, { $push: { radiology: testsid } });
    //update appointment with radiology orders
    //radiology
    if (appointmentid) {
      await updateappointment(appointment._id, { $push: { radiology: testsid } });

    }
    res.status(200).json({ queryresult, status: true });



  }
  catch (error: any) {
    console.log("error", error);
    res.status(403).json({ status: false, msg: error.message });

  }

}


//get lab order by patient
export const readAllRadiologyByPatient = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const queryresult = await readallradiology({ patient: id }, {}, 'patient', 'payment');
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (error: any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};
//get lab order 
export const readAllRadiology = async (req: any, res: any) => {
  try {

    const queryresult = await readallradiology({}, {}, 'patient', 'payment');
    res.status(200).json({
      queryresult,
      status: true
    });
  } catch (error: any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};
//get lab order 
export const readAllRadiologyoptimized = async (req: any, res: any) => {
  try {
    var { status, firstName, MRN, HMOId, lastName, phoneNumber, testname, testid } = req.query;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    const filter: any = {};
    var statusfilter: any = status ? { status } : testname ? { testname } : testid ? { testid } : {};
    // Add filters based on query parameters
    if (firstName) {
      filter.firstName = new RegExp(firstName, 'i'); // Case-insensitive search for name
    }
    if (MRN) {
      filter.MRN = new RegExp(MRN, 'i');
    }
    if (HMOId) {
      filter.HMOId = new RegExp(HMOId, 'i'); // Case-insensitive search for email
    }
    if (lastName) {
      filter.lastName = new RegExp(lastName, 'i'); // Case-insensitive search for email
    }
    if (phoneNumber) {
      filter.phoneNumber = new RegExp(phoneNumber, 'i'); // Case-insensitive search for email
    }
    let aggregatequery =
      [
        {
          $match: statusfilter
        },
        {
          $lookup: {
            from: 'payments',
            localField: 'payment',
            foreignField: '_id',
            as: 'payment'
          }
        },
        {
          $lookup: {
            from: 'patientsmanagements',
            localField: 'patient',
            foreignField: '_id',
            as: 'patient'
          }
        },
        {
          $unwind: {
            path: '$payment', // Deconstruct the payment array (from the lookup)
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind: {
            path: '$patient',
            preserveNullAndEmptyArrays: true

          }  // Deconstruct the patient array (from the lookup)
        },
        {
          $project: {
            _id: 1,
            createdAt: 1,
            testname: 1,
            updatedAt: 1,
            testid: 1,
            testresult: 1,
            department: 1,
            typetestresult: 1,
            raiseby: 1,
            firstName: "$patient.firstName",
            lastName: "$patient.lastName",
            phoneNumber: "$patient.phoneNumber",
            MRN: "$patient.MRN",
            patient: "$patient",
            HMOId: "$patient.HMOId",
            HMOName: "$patient.HMOName",
            payment: "$payment",
            status: 1,

          }
        },
        {
          $match: filter
        },
      ];
    const queryresult = await optimizedreadallradiology(aggregatequery, page, size);



    res.status(200).json({
      queryresult,
      status: true
    });



  } catch (error: any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};


//update radiology
export async function updateradiologys(req: any, res: any) {
  try {

    //get id
    const { id } = req.params;
    //check that the status is not complete
    var myradiologystatus: any = await readoneradiology({ _id: id }, {}, 'patient');
    if (myradiologystatus.status !== configuration.status[13]) {
      throw new Error(`${configuration.error.errortasknotpending} `);
    }
    var { testname, note } = req.body;
    validateinputfaulsyvalue({ testname, note });
    var testPrice: any = await readoneprice({ servicetype: testname });
    if (!testPrice) {
      throw new Error(`${configuration.error.errornopriceset}  ${testname}`);
    }
    const { servicetypedetails } = await readallservicetype({ category: configuration.category[4] }, { type: 1, category: 1, department: 1, _id: 0 });
    var testsetting = servicetypedetails.filter(item => (item.type).includes(testname));

    if (!testsetting || testsetting.length < 1) {
      throw new Error(`${testname} does not ${configuration.error.erroralreadyexit} in ${configuration.category[4]} as a service type  `);
    }




    // await updatepayment({_id:myradiologystatus.payment},{paymentype:testname,amount:Number(testPrice.amount)});
    var queryresult = await updateradiology(id, { testname, note });
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
export var enterradiologyresult = async (req: any, res: any) => {
  try {
    const { firstName, lastName } = (req.user).user;
    const { id } = req.params;
    const { typetestresult } = req.body;
    var response: any = await readoneradiology({ _id: id }, {}, 'patient');
    // validate patient status
    if (response.status !== configuration.status[9]) {
      throw new Error(`Radiology Record ${configuration.error.errortasknotpending}`);


    }
    const { patient } = response;
    //validate payment
    var findAdmission = await readoneadmission({ patient: patient._id, status: { $ne: configuration.admissionstatus[5] } }, {}, '');
    if (!findAdmission && patient.isHMOCover == configuration.ishmo[0]) {
      var paymentrecord: any = await readonepayment({ _id: response.payment });
      if (paymentrecord.status !== configuration.status[3]) {
        throw new Error(configuration.error.errorpayment);

      }
    }
    const processby = `${firstName} ${lastName}`;
    var queryresult = await updateradiology(id, { typetestresult, status: configuration.status[7], processby });
    res.json({
      queryresult,
      status: true
    });

  }
  catch (e: any) {
    res.json({ status: false, msg: e.message });

  }
}
//typeresult
//typetestresult
//process result
//upload patients photo
export var uploadradiologyresult = async (req: any, res: any) => {
  try {
    const { firstName, lastName } = (req.user).user;
    const { id } = req.params;
    var response: any = await readoneradiology({ _id: id }, {}, 'patient');
    // validate patient status
    if (response.status !== configuration.status[9]) {
      throw new Error(`Radiology Record ${configuration.error.errortasknotpending}`);


    }
    const { patient } = response;
    //validate payment
    var findAdmission = await readoneadmission({ patient: patient._id, status: { $ne: configuration.admissionstatus[5] } }, {}, '');
    if (!findAdmission && patient.isHMOCover == configuration.ishmo[0]) {
      var paymentrecord: any = await readonepayment({ _id: response.payment });
      if (paymentrecord.status !== configuration.status[3]) {
        throw new Error(configuration.error.errorpayment);

      }
    }

    const processby = `${firstName} ${lastName}`;
    const file = req.files.file;
    const fileName = file.name;
    const filename = "radiology" + uuidv4();
    let allowedextension = ['.jpg', '.png', '.jpeg', '.pdf', '.docx', 'doc'];
    let uploadpath = `${process.cwd()}/${configuration.useruploaddirectory}`;
    const extension = path.extname(fileName);
    const renamedurl = `${filename}${extension}`;
    //upload pix to upload folder
    await uploaddocument(file, filename, allowedextension, uploadpath);


    //update pix name in patient
    const queryresult = await updateradiology(id, { $push: { testresult: renamedurl }, status: configuration.status[7], processby });
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
export const confirmradiologyorder = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { option, remark } = req.body;
  console.log("option", option, "remark", remark);
  const { id } = req.params;
  validateinputfaulsyvalue({ id });
  const radiology: any = await readoneradiology({ _id: id }, {}, "patient");
  if (radiology.status !== configuration.status[14]) {
    throw new Error(configuration.error.errorRadiologyStatus);
  }

  const { patient } = radiology;

  // choose strategy based on isHMOCover
  const strategyFn =
    !(patient.isHMOCover == configuration.ishmo[1] || patient.isHMOCover == true)
      ? SelfPayRadiologyConfirmationStrategy
      :HmoRadiologyConfirmationStrategy ;

  const context = RadiologyConfirmationContext(strategyFn);


  const queryresult = await context.execute({
    id,
    option,
    remark,
    radiology,
    patient,
  });


  res.status(200).json({ queryresult, status: true });
});


