import { NextFunction, Request, Response } from "express";
import  mongoose from 'mongoose';
import { validateinputfaulsyvalue,calculateAmountPaidByHMO } from "../../utils/otherservices";
import {readoneappointment,updateappointment} from "../../dao/appointment";
import {createadmission,readalladmission,updateadmission,readoneadmission} from  "../../dao/admissions";
import  {updatepatient,readonepatient,readallpatient}  from "../../dao/patientmanagement";
import {readonewardmanagement,updatewardmanagement} from "../../dao/wardmanagement";
import {readoneclinic} from "../../dao/clinics";
import {readallpayment} from "../../dao/payment";
import {readonebed,updatebed} from "../../dao/bed";
import {createpayment} from "../../dao/payment";
import {readonehmocategorycover} from "../../dao/hmocategorycover";
import { strategies } from "./admission.helper";

import configuration from "../../config";
import catchAsync from "../../utils/catchAsync";
const { ObjectId } = mongoose.Types;

//refer for admission
export var referadmission= async (req:any, res:any) =>{
    try{
      
      const { firstName,lastName} = (req.user).user;
      var admissionid:any=String(Date.now());
      //accept _id from request
      const {id} = req.params;
      //doctorname,patient,appointment
      var {alldiagnosis,referedward,admittospecialization, referddate,appointmentid,bed_id,referredIn,referredFrom} = req.body;
      validateinputfaulsyvalue({id,alldiagnosis,referedward,admittospecialization, referddate,bed_id});
      //confirm ward
      const referedwardid = new ObjectId(referedward);
      const bed = new ObjectId(bed_id);
      const foundWard:any =  await readonewardmanagement({_id:referedwardid},'');
      if(!foundWard){
          throw new Error(`Ward does not exist`);

      }
      const foundBed = await readonebed({_id:bed, ward:foundWard._id},'');
       if(!foundBed){
          throw new Error(`Bed does not exist`);

      }
      //validate bed status
    if (foundBed.status == configuration.bedstatus[1]) {
      throw new Error(`${foundBed.bednumber} Bed is already occupied`);
    }
      //valid that bed exist

         var appointment:any;
                if(appointmentid){
                  appointmentid = new ObjectId(appointmentid);
                  console.log("appoitmentid",appointmentid);
                  appointment = await readoneappointment({_id:appointmentid},{},'');
                   console.log("appointment",appointment);
                        if(!appointment){
                          //create an appointment
                          throw new Error(`Appointment does not exist`);
            
                      }
            
            
    }
      //confrim admittospecialization
      //validate specialization
          const foundSpecilization =  await readoneclinic({clinic:admittospecialization},'');
          if(!foundSpecilization){
              throw new Error(`Specialization does not exist`);
      
          }

     //find the record in patient and validate
    
    var patient = await readonepatient({_id:id,status:configuration.status[1]},{},'','');
      
      if(!patient){
        throw new Error(`Patient does not ${configuration.error.erroralreadyexit} or has not made payment for registration`);

      }
   
  //check that patient have not been admitted
  var  findAdmission = await readoneadmission({patient:patient._id, status:{$ne: configuration.admissionstatus[5]}},{},'');
  if(findAdmission){
    throw new Error(`Patient Admission already exists`);

}


//create admission
var admissionrecord:any = await createadmission({alldiagnosis,referedward,admittospecialization, referddate,doctorname:firstName + " " + lastName,appointment:id,patient:patient._id,admissionid,bed,referredIn,referredFrom});
// Update ward and bed status simultaneously using Promise.all
await Promise.all([
  updatewardmanagement(referedwardid, { $inc: { occupiedbed: 1, vacantbed: -1 } }),
  updatebed(bed, { status: configuration.bedstatus[1] }),
  updatepatient(patient._id,{$push: {admission:admissionrecord._id}})
]);

if(appointmentid){
              await updateappointment(appointment._id,{admission:admissionrecord._id});
      
}

res.status(200).json({queryresult:admissionrecord, status: true});
    }
    
    catch(error:any){
      res.status(403).json({ status: false, msg: error.message });
  
    }
  
  }
// get all admission patient
export async function getallreferedforadmission(req:any, res:any){
    try{
       const {ward} = req.params;
       const referedward = new ObjectId(ward);
        const queryresult = await readalladmission({referedward},{},'referedward','patient','bed');
        res.status(200).json({
            queryresult,
            status:true
          }); 

    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }

}
//get all admitted patient
// get all admission patient
export async function getalladmissionbypatient(req:any, res:any){
  try{
    
     const {patient} = req.params;
     console.log(patient);
     const referedward = new ObjectId(patient);
      const queryresult = await readalladmission({patient},{},'referedward','patient','bed');
      res.status(200).json({
          queryresult,
          status:true
        }); 

  }
  catch(e:any){
      res.status(403).json({status: false, msg:e.message});

  }

}
//admited,to transfer,transfer,to discharge, discharge
export async function updateadmissionstatus(req: any, res: any) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (![configuration.admissionstatus[3], configuration.admissionstatus[5]].includes(status)) {
      throw new Error(`${status} is not a valid admission status`);
    }
    //validate reason for discharge
    if (status === configuration.admissionstatus[5] && !req.body.dischargeReason) {
      throw new Error("Discharge reason must be provided for discharged patients");
    }

    const admission = await readoneadmission({ _id: id }, {}, "");
    if (!admission) throw new Error("Admission not found");

    const strategy = strategies[status];
    if (!strategy) throw new Error(`No strategy found for status: ${status}`);

    await strategy(admission, { ...req.body, id });

    res.status(200).json({ status: true, message: "Successfully updated admission status" });
  } catch (e: any) {
    console.error(e);
    res.status(403).json({ status: false, msg: e.message });
  }
}

export const searchAdmissionRecords =catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

    const { firstName, lastName, MRN, HMOId } = req.query;

    // Build patient search conditions
    const patientSearchConditions: any = {};
    if (firstName) {
      patientSearchConditions.firstName = { $regex: new RegExp(firstName as string, "i") };
    }
    if (lastName) {
      patientSearchConditions.lastName = { $regex: new RegExp(lastName as string, "i") };
    }
    if (MRN) {
      patientSearchConditions.MRN = { $regex: new RegExp(MRN as string, "i") };
    }
    if (HMOId) {
      patientSearchConditions.HMOId = { $regex: new RegExp(HMOId as string, "i") };
    }


    var selectquery = {
          "_id": 1, 
        };
      
    

    // First find matching patient IDs
    const {patientdetails} = await readallpatient(patientSearchConditions,selectquery,'','');
  

    if (patientdetails.length === 0) {
      throw new Error("No patients found matching criteria.");
    }

    const patientIds = patientdetails.map((p) => p._id);
    

    // Now find admissions that match those patient IDs
    
    const queryresult = await readalladmission({patient: { $in: patientIds }},{},'referedward','patient','bed');

      res.status(200).json({
          queryresult,
          status:true
        }); 

});
export const addBedFee = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const { id } = req.params; // Admission ID
    const { bedfee }: any = req.body;
    // Validate inputs
    if (!id) {
      throw new Error("Admission ID is required.");
    }
    if (bedfee == null || isNaN(Number(bedfee))) {
      throw new Error("Valid bed fee is required.");
    }
    // Read admission (excluding discharged/completed status)
    const findAdmission: any = await readoneadmission(
      { _id: id, status: { $ne: configuration.admissionstatus[5] } },
      {},
      "patient"
    );
    if (!findAdmission) {
      throw new Error(`Patient admission does not exist`);
    }
    
    //validate bedfee
    if(findAdmission.bedfee) throw new Error("Bed has been previous generated for this patient")
    const { patient } = findAdmission;
    const paymentreference = findAdmission.admissionid;
    // Update admission record with bed fee
    const updatedAdmission = await updateadmission(id, { bedfee: Number(bedfee) });
    if (!updatedAdmission) {
      throw new Error("Failed to update admission bed fee.");
    }
// get insurance
let insurance:any = await readonehmocategorycover({hmoId:patient.insurance, category:configuration.category[10]},{hmopercentagecover:1});
let hmopercentagecover=insurance?.hmopercentagecover ?? 0;
let amount = calculateAmountPaidByHMO(Number(hmopercentagecover), Number(bedfee));
if(amount > 0)
    
    await createpayment({
      firstName: patient?.firstName,
      lastName: patient?.lastName,
      MRN: patient?.MRN,
      phoneNumber: patient?.phoneNumber,
      paymentreference,
      paymentype: "bedfee",
      paymentcategory: configuration.category[2],
      patient: patient._id,
      amount
    });

    res.status(200).json({
      queryresult: "Bed fee added successfully.",
      status: true
    });

});
