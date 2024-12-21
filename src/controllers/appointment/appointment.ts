import {createappointment} from "../../dao/appointment";
import  {readonepatient,updatepatient}  from "../../dao/patientmanagement";
import {readoneprice} from "../../dao/price";
import {createpayment} from "../../dao/payment";
import { validateinputfaulsyvalue,generateRandomNumber } from "../../utils/otherservices";
import configuration from "../../config";



// Create a new schedule
export const scheduleappointment = async (req:any, res:any) => {

  

  try {
    req.body.appointmentdate=new Date(req.body.appointmentdate);
    console.log("///////////date//////////////",req.body.appointmentdate);
    var { clinic, reason, appointmentdate, appointmentcategory, appointmenttype } = req.body;

  validateinputfaulsyvalue({clinic, reason, appointmentdate, appointmentcategory, appointmenttype});
  const {id} = req.params;
    //search patient if available and paid for registration
     //validation
     var selectquery ={"title":1,"firstName":1,"middleName":1,"lastName":1,"country":1, "stateOfResidence": 1,"LGA": 1,"address":1,"age":1,"dateOfBirth":1,"gender":1,"nin":1,"phoneNumber":1,"email":1,"oldMRN":1,"nextOfKinName":1,"nextOfKinRelationship":1,"nextOfKinPhoneNumber":1,"nextOfKinAddress":1,
       "maritalStatus":1, "disability":1,"occupation":1,"isHMOCover":1,"HMOName":1,"HMOId":1,"HMOPlan":1,"MRN":1,"createdAt":1, "passport":1};
     const patient =  await readonepatient({_id:id},selectquery,'');
     if(!patient){
         throw new Error(`Patient donot ${configuration.error.erroralreadyexit}`);

     }

    //search for price if available
    var appointmentPrice = await readoneprice({servicecategory:appointmentcategory,servicetype:appointmenttype});
    if(!appointmentPrice){
      throw new Error(configuration.error.errornopriceset);

  }

//create appointment
//create payment
const createpaymentqueryresult =await createpayment({paymentreference:patient.MRN,paymentype:appointmenttype,patient:id,amount:Number(appointmentPrice.amount)})
const queryresult = await createappointment({appointmentid:generateRandomNumber(5),payment:createpaymentqueryresult._id ,patient:patient._id,clinic,reason, appointmentdate, appointmentcategory, appointmenttype});
    var payment=[]; 
    payment.push(createpaymentqueryresult._id);
    //update patient
    await updatepatient(id,{payment,appointment:queryresult._id});
    res.status(200).json({queryresult, status: true});
    
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};
/*

// Get all examination records
const getExaminations = async (req, res) => {
  try {
    const examinations = await Examination.find()
      .populate('patient_id')
      .populate('doctor_id');
    res.status(200).json(examinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching examinations', error });
  }
};

// Get examination by patient
const getExaminationsByPatient = async (req, res) => {
  const { patient_id } = req.params;

  try {
    const examinations = await Examination.find({ patient_id })
      .populate('doctor_id');
    if (!examinations) {
      return res.status(404).json({ message: 'No examinations found for this patient' });
    }
    res.status(200).json(examinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching examinations', error });
  }
};

// Get examination by doctor
const getExaminationsByDoctor = async (req, res) => {
  const { doctor_id } = req.params;

  try {
    const examinations = await Examination.find({ doctor_id })
      .populate('patient_id');
    if (!examinations) {
      return res.status(404).json({ message: 'No examinations found for this doctor' });
    }
    res.status(200).json(examinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching examinations', error });
  }
};

module.exports = {
  createExamination,
  getExaminations,
  getExaminationsByPatient,
  getExaminationsByDoctor
};
*/