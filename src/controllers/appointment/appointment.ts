import {createappointment,readallappointment,updateappointment,readoneappointment} from "../../dao/appointment";
import  {readonepatient,updatepatient}  from "../../dao/patientmanagement";
import  {readone}  from "../../dao/users";
import {readoneprice} from "../../dao/price";
import {createpayment} from "../../dao/payment";
import {createlab} from "../../dao/lab";
import { validateinputfaulsyvalue,generateRandomNumber } from "../../utils/otherservices";
import configuration from "../../config";



// Create a new schedule
export const scheduleappointment = async (req:any, res:any) => {
  try {
    console.log('req',req.body);
    //req.body.appointmentdate=new Date(req.body.appointmentdate);
    var appointmentid:any=String(Date.now());
    //const {id} = req.params;
    var { clinic, reason, appointmentdate, appointmentcategory, appointmenttype, patient } = req.body;
    validateinputfaulsyvalue({clinic, reason, appointmentdate, appointmentcategory, appointmenttype,patient});
 

   
    //pending

     //validation
     var selectquery ={"title":1,"firstName":1,"middleName":1,"lastName":1,"country":1, "stateOfResidence": 1,"LGA": 1,"address":1,"age":1,"dateOfBirth":1,"gender":1,"nin":1,"phoneNumber":1,"email":1,"oldMRN":1,"nextOfKinName":1,"nextOfKinRelationship":1,"nextOfKinPhoneNumber":1,"nextOfKinAddress":1,
       "maritalStatus":1, "disability":1,"occupation":1,"isHMOCover":1,"HMOName":1,"HMOId":1,"HMOPlan":1,"MRN":1,"createdAt":1, "passport":1};
      //search patient if available and paid for registration
      console.log("patient",patient);
      console.log("status",configuration.status[1]);
       const patientrecord =  await readonepatient({_id:patient,status:configuration.status[1]},selectquery,'');
  
       if(!patientrecord){
         throw new Error(`Patient donot ${configuration.error.erroralreadyexit}`);

     }

    //search for price if available
    var appointmentPrice = await readoneprice({servicecategory:appointmentcategory,servicetype:appointmenttype});
    
    if(!appointmentPrice){
      throw new Error(configuration.error.errornopriceset);

  }

//create appointment
//create payment
const createpaymentqueryresult =await createpayment({paymentreference:appointmentid,paymentype:appointmenttype,paymentcategory:appointmentcategory,patient,amount:Number(appointmentPrice.amount)})
const queryresult = await createappointment({appointmentid,payment:createpaymentqueryresult._id ,patient:patientrecord._id,clinic,reason, appointmentdate, appointmentcategory, appointmenttype});
    //update patient
await updatepatient(patient,{$push: {payment:createpaymentqueryresult._id,appointment:queryresult._id}});
    res.status(200).json({queryresult, status: true});
    
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};


// Get all schedueled records
export const getAllSchedules = async (req:any, res:any) => {
  try {
   
    const queryresult = await readallappointment({},{},'patient','doctor','payment');
    res.status(200).json({
      queryresult,
      status:true
    }); 
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};
//update appiontment
export async function updateappointments(req:any, res:any){
  try{
  //get id
  const {id, status} = req.params;
  //reject if status
  if(status){

  }
  var queryresult = await updateappointment(id, req.body);
  res.status(200).json({
      queryresult,
      status:true
    }); 
  }catch(e:any){
    console.log(e);
    res.status(403).json({status: false, msg:e.message});

  }

}

//get schedule by patient
export const getAllSchedulesByPatient = async (req:any, res:any) => {
  try {
    const {id} = req.params;
    const queryresult = await readallappointment({patient:id},{},'patient','doctor','payment');
    res.status(200).json({
      queryresult,
      status:true
    }); 
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};
//status:configuration.status[5]
//get all patient with paid schduled
export const getAllPaidSchedules = async (req:any, res:any) => {
  try {
    const {clinic} = (req.user).user;
    const queryresult = await readallappointment({$or:[{status:configuration.status[5]},{status:configuration.status[6]}],clinic},{},'patient','doctor','payment');
    res.status(200).json({
      queryresult,
      status:true
    }); 
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};

//get schedule by single patient
export const getAllPaidSchedulesByPatient = async (req:any, res:any) => {
  try {
    const {clinic} = (req.user).user;
    const {id} = req.params;
    const queryresult = await readallappointment({patient:id,$or:[{status:configuration.status[5]},{status:configuration.status[6]}],clinic},{},'patient','doctor','payment');
    res.status(200).json({
      queryresult,
      status:true
    }); 
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};

//queue
//get all patient with paid schduled
export const getAllPaidQueueSchedules = async (req:any, res:any) => {
  try {
      // Get today's date
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);  // Set the time to 00:00:00
   // Get the start of tomorrow to set the range for "today"
   const endOfDay = new Date(startOfDay);
   endOfDay.setHours(23, 59, 59, 999);  // Set the time to 23:59:59  
    const {clinic} = (req.user).user;
    const queryresult = await readallappointment({status:configuration.status[5],clinic,appointmentdate: { $gte: startOfDay, $lt: endOfDay }},{},'patient','doctor','payment');
    res.status(200).json({
      queryresult,
      status:true
    }); 
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};


//examine patient
export var examinepatient = async (req:any,res:any) =>{
   
  try{
     const {id} = req.params;
     const {email, staffId} = req.user;
     console.log(email, staffId);

     //find doctor and add doctor who examined
     const user = await readone({email, staffId});
     console.log(user);
     req.body.status = configuration.status[6];
     req.body.doctor = user?._id;
      const queryresult =  await updateappointment(id,req.body);
      res.status(200).json({
          queryresult,
          status:true
        }); 
      

  }catch(error:any){
      res.status(403).json({ status: false, msg: error.message });
  }
}
//lab order
export var laborder= async (req:any, res:any) =>{
  try{
    //accept _id from request
    const {id} = req.params;
    const {testname} = req.body;
    var testid:any=String(Date.now());
    var testsid =[];
    var paymentids =[];
    validateinputfaulsyvalue({id, testname});
    
    //find the record in appointment and validate
    var appointment = await readoneappointment({_id:id},{},'');
    if(!appointment){
      throw new Error(`Appointment donot ${configuration.error.erroralreadyexit}`);

  }
 

    //loop through all test and create record in lab order
    for(var i =0; i < testname.length; i++){
  //    console.log(testname[i]);
      var testPrice:any = await readoneprice({servicetype:testname[i]});
      
      if(!testPrice){
        throw new Error(configuration.error.errornopriceset);

    }
    //search testname in setting
    var testsetting = (configuration.settings.servicecategory).filter(item => (item.type).includes(testname[i]));
       //create payment
    var createpaymentqueryresult =await createpayment({paymentreference:id,paymentype:testname[i],paymentcategory:testsetting[0].category,patient:appointment.patient,amount:Number(testPrice.amount)})
    //create testrecord
    var testrecord = await createlab({testname:testname[i],patient:appointment.patient,appointment:appointment._id,payment:createpaymentqueryresult._id,appointmentid:appointment.appointmentid,testid,department:testsetting[0].department});

    testsid.push(testrecord._id);
    paymentids.push(createpaymentqueryresult._id);
 

    }
    var queryresult=await updatepatient(appointment.patient,{$push: {lab:testsid,payment:paymentids}});
    res.status(200).json({queryresult, status: true});
    
   

  }
  catch(error:any){
    res.status(403).json({ status: false, msg: error.message });

  }

}
/*
  findings: String,  // Description of the examination findings
  diagnosis: String, // Doctor's diagnosis based on the examination
  prescriptions: String,  // List of prescribed medications or treatments
  requestforlabtest: String,
  notes: String, // Additional notes (if any)
*/

