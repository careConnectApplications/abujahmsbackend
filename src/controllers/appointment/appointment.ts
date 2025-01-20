import {createappointment,readallappointment,updateappointment,readoneappointment} from "../../dao/appointment";
import  {readonepatient,updatepatient}  from "../../dao/patientmanagement";
import  {readone}  from "../../dao/users";
import {readoneprice} from "../../dao/price";
import {createpayment} from "../../dao/payment";
//import {createvital} from "../../dao/vitals";
import {createlab} from "../../dao/lab";
import { validateinputfaulsyvalue,generateRandomNumber,validateinputfornumber } from "../../utils/otherservices";
import configuration from "../../config";



// Create a new schedule
export const scheduleappointment = async (req:any, res:any) => {
  try {
    
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
  

      // const patientrecord =  await readonepatient({_id:patient,status:configuration.status[1]},selectquery,'','');
       const patientrecord =  await readonepatient({_id:patient},selectquery,'','');
  
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

const queryresult = await createappointment({appointmentid,payment:createpaymentqueryresult._id ,patient:patientrecord._id,clinic,reason, appointmentdate, appointmentcategory, appointmenttype,encounter:{vitals: {status:configuration.status[8]}}});
console.log(queryresult);    
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
  /*
  if(status){

  }
  */
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
//completed encounter
export const getAllCompletedEncounter = async (req:any, res:any) => {
  try {
    const {id} = req.params;
    const {clinic} = (req.user).user;
    const queryresult = await readallappointment({status:configuration.status[6],clinic,patient:id},{},'patient','doctor','payment');
    res.status(200).json({
      queryresult,
      status:true
    }); 
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};
//inprogress encounter
export const getAllInProgressEncounter = async (req:any, res:any) => {
  try {
    const {clinic} = (req.user).user;
    const {id} = req.params;
    const queryresult = await readallappointment({status:configuration.status[9],clinic,patient:id},{},'patient','doctor','payment');
    res.status(200).json({
      queryresult,
      status:true
    }); 
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};

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
     const {email, staffId} = (req.user).user;
     //find doctor and add doctor who examined
     const user = await readone({email, staffId});
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
    var setting  = await configuration.settings();
    //search testname in setting
    var testsetting = (setting.servicecategory).filter(item => (item.type).includes(testname[i]));
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
//create vitals
//update a patient
export async function addencounter(req:any, res:any){
  try{
  //

  const {id} = req.params;
  //validate id
  //validate other input paramaters
  //search appoint where appoint id = id
  //extract vitals id
  if(req.body.status == 1){
    req.body.status = configuration.status[6];

  }
  else if(req.body.status == 2){
    req.body.status = configuration.status[5];

  }
  else{
    req.body.status = configuration.status[9];
  }
 
//vitals
  const {height,weight,temperature, bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,status} = req.body;
  const {assessment,assessmentnote,diagosis,diagosisnote,icpc2,icpc2note} = req.body;
  const { hair,hairnote,face,facenote,jaundice,jaundicenote,cyanosis,cyanosisnote,pallor,pallornote,oral,oralnote,lymphnodes,lymphnodesnote,ederma,edermanote,lastmenstrationperiod,lastmenstrationperiodnote,generalphysicalexamination} = req.body;
const {currentlengthheight,currentlengthheightpercentage,currentlengthheightenote,currentweight,currentweightnote,percentageofweightexpected,headcircumference,anteriorfontanelle,posteriorfontanelle,chestcircumference,limbexamination,generalnote} = (req.body).paediatricsspecific;
const {reflexes,rootingreflexes,suckreflexes,mororeflexes,tonicneckreflexes,graspreflexes,steppingreflexes,neuronote} = (req.body).paediatricsspecific;
 
  req.body.bmi = weight/(height * height);
  //vitals
  const vitals = {height,weight,temperature, bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,bmi:req.body.bmi,status:configuration.status[6]};
  if(height || weight){
    validateinputfornumber({height, weight});
    //validateinputfaulsyvalue({...vitals});
    }
    
  //general physical examination
  const paediatricsspecificationgeneral={currentlengthheight,currentlengthheightpercentage,currentlengthheightenote,currentweight,currentweightnote,percentageofweightexpected,headcircumference,anteriorfontanelle,posteriorfontanelle,chestcircumference,limbexamination,generalnote};
  const paediatricsspecificationneuro={reflexes,rootingreflexes,suckreflexes,mororeflexes,tonicneckreflexes,graspreflexes,steppingreflexes,neuronote}
  const generalphysicalexaminations ={paediatricsspecification:{general:paediatricsspecificationgeneral, neuro:paediatricsspecificationneuro}, hair,hairnote,face,facenote,jaundice,jaundicenote,cyanosis,cyanosisnote,pallor,pallornote,oral,oralnote,lymphnodes,lymphnodesnote,ederma,edermanote,lastmenstrationperiod,lastmenstrationperiodnote,generalphysicalexamination};
  //assessmentdiagnosis
  const  assessmentdiagnosis = {assessment,assessmentnote,diagosis,diagosisnote,icpc2,icpc2note};
  //physical exaamination
  const {heartrate,bpsystolic,bpdiastolic,capillaryrefilltime,heartraterhythm,heartsound,heartmurmurgrade,heartmurmurquality,heartmurmurpitch,heartmurmurtiming,murmurlocationauscultation,murmurradiatingtobodylocation,jugularveindistention,jugularveindistentionheadup30degree,edema,temperatureextrmities,tissueperfusionassessmentimpression,cvsremark} = (req.body).cvs;
  const {respiratoryrhthm,respiratoryrate,respiratoryeffort,breathsoundsauscultation,localizedbreathsounds,respiratoryassessmentimpression,respremarks} = (req.body).resp;
  const {bowelsoundauscultation,bowelsoundbyqualityauscultation,bsquadauscultation,physiologicfindingbypalpation,giassessmentimpression,giremarks} = (req.body).gi;
  const {urinecolor,urineodor,urineturbidity,urinecollectiondevice,voidingpattern,appearanceurine,otherurine,genitourinaryassessmentimpression,numbervoids,incontinentvoidsurinary,diapercount,perinealpadscount,colorurine,voidingpatterngu,bloodlossvolume,genitouringassessmentimpressions,guremark} =(req.body).gu;
  const {levelofconsciousness,person,place,time,orientationassessmentimpression,levelofarousal,speechclarity,patientmood,patientmemory,abilitytoconcentrate,abilitytodirectattention,cniexam,cniiexam,cniiiexam,cnivexam,cnvexam,cnviexam,cniviiexam,cniviiiexam,cnixexam,cnxexam,cnxiexam,cnxiiexam,pupildiametereyer,pupildiametereyel,pupillaryresponsepupilr,pupillaryresponsepupill,pupilshaperightpupil,pupilshapeleftpupil,pupilassessmentimpression,physiologicfindingopticlens,glasgowcomascale,neurologyassessmentimpression,nueroremarks}= (req.body).neuro;
  const {muscletone,musclestrength,involuntarymovements,activerangeflexionshoulderl,activerangeextensionshoulderl,activerangeexternalrotationshoulderl,activerangeinternalrotationshoulderl,activerangeabductionshoulderl,activerangeadductionshoulderl,activerangeflexionshoulderr,activerangeextensionshoulderr,activerangeexternalrotationshoulderr,activerangeinternalrotationshoulderr,activerangeabductionshoulderr,activerangeadductionshoulderr,activerangeflexionelbowl,activerangeextensionelbowl,activerangeflexionelbowr,activerangeextensionelbowr,activerangeflexionhipl,activerangeextensionhipl,activerangeexternalrotationhipl,activerangeinternalrotationhipl,activerangeabductionhipl,activerangeadductionhipl,activerangeflexionhipr,activerangeextensionhipr,activerangeexternalrotationhipr,activerangeinternalrotationhipr,activerangeabductionhipr,activerangeadductionhipr,activerangeflexionkneel,activerangeextensionkneel,activerangeflexionkneer,activerangeextensionkneer,passiverangeflexionshoulderl,passiverangeextensionshoulderl,passiverangeexternalrotationshoulderl,passiverangeinternalrotationshoulderl,passiverangeabductionshoulderl,passiverangeadductionshoulderl,passiverangeflexionshoulderr,passiverangeextensionshoulderr,passiverangeexternalrotationshoulderr,passiverangeinternalrotationshoulderr,passiverangeabductionshoulderr,passiverangeadductionshoulderr,passiverangeflexionelbowl,passiverangeextensionelbowl,passiverangeflexionelbowr,passiverangeextensionelbowr,passiverangeflexionhipl,passiverangeextensionhipl,passiverangeexternalrotationhipl,passiverangeinternalrotationhipl,passiverangeabductionhipl,passiverangeadductionhipl,passiverangeflexionhipr,passiverangeextensionhipr,passiverangeexternalrotationhipr,passiverangeinternalrotationhipr,passiverangeabductionhipr,passiverangeadductionhipr,dtrachilles,dtrbiceps,dtrbrachioradialis,dtrpatellar,dtrtriceps,babinskisreflex,oculocephalic,paralysistype,paresthesiatype,physiologicfinding,musculoskeletalassessmentimpression,mskremark} =(req.body).msk;
  const  cvs ={heartrate,bpsystolic,bpdiastolic,capillaryrefilltime,heartraterhythm,heartsound,heartmurmurgrade,heartmurmurquality,heartmurmurpitch,heartmurmurtiming,murmurlocationauscultation,murmurradiatingtobodylocation,jugularveindistention,jugularveindistentionheadup30degree,edema,temperatureextrmities,tissueperfusionassessmentimpression,cvsremark};
  const resp ={respiratoryrhthm,respiratoryrate,respiratoryeffort,breathsoundsauscultation,localizedbreathsounds,respiratoryassessmentimpression,respremarks};
  const gi= {bowelsoundauscultation,bowelsoundbyqualityauscultation,bsquadauscultation,physiologicfindingbypalpation,giassessmentimpression,giremarks};
  const gu={urinecolor,urineodor,urineturbidity,urinecollectiondevice,voidingpattern,appearanceurine,otherurine,genitourinaryassessmentimpression,numbervoids,incontinentvoidsurinary,diapercount,perinealpadscount,colorurine,voidingpatterngu,bloodlossvolume,genitouringassessmentimpressions,guremark};
  const neuro={levelofconsciousness,person,place,time,orientationassessmentimpression,levelofarousal,speechclarity,patientmood,patientmemory,abilitytoconcentrate,abilitytodirectattention,cniexam,cniiexam,cniiiexam,cnivexam,cnvexam,cnviexam,cniviiexam,cniviiiexam,cnixexam,cnxexam,cnxiexam,cnxiiexam,pupildiametereyer,pupildiametereyel,pupillaryresponsepupilr,pupillaryresponsepupill,pupilshaperightpupil,pupilshapeleftpupil,pupilassessmentimpression,physiologicfindingopticlens,glasgowcomascale,neurologyassessmentimpression,nueroremarks};
 const msk={muscletone,musclestrength,involuntarymovements,activerangeflexionshoulderl,activerangeextensionshoulderl,activerangeexternalrotationshoulderl,activerangeinternalrotationshoulderl,activerangeabductionshoulderl,activerangeadductionshoulderl,activerangeflexionshoulderr,activerangeextensionshoulderr,activerangeexternalrotationshoulderr,activerangeinternalrotationshoulderr,activerangeabductionshoulderr,activerangeadductionshoulderr,activerangeflexionelbowl,activerangeextensionelbowl,activerangeflexionelbowr,activerangeextensionelbowr,activerangeflexionhipl,activerangeextensionhipl,activerangeexternalrotationhipl,activerangeinternalrotationhipl,activerangeabductionhipl,activerangeadductionhipl,activerangeflexionhipr,activerangeextensionhipr,activerangeexternalrotationhipr,activerangeinternalrotationhipr,activerangeabductionhipr,activerangeadductionhipr,activerangeflexionkneel,activerangeextensionkneel,activerangeflexionkneer,activerangeextensionkneer,passiverangeflexionshoulderl,passiverangeextensionshoulderl,passiverangeexternalrotationshoulderl,passiverangeinternalrotationshoulderl,passiverangeabductionshoulderl,passiverangeadductionshoulderl,passiverangeflexionshoulderr,passiverangeextensionshoulderr,passiverangeexternalrotationshoulderr,passiverangeinternalrotationshoulderr,passiverangeabductionshoulderr,passiverangeadductionshoulderr,passiverangeflexionelbowl,passiverangeextensionelbowl,passiverangeflexionelbowr,passiverangeextensionelbowr,passiverangeflexionhipl,passiverangeextensionhipl,passiverangeexternalrotationhipl,passiverangeinternalrotationhipl,passiverangeabductionhipl,passiverangeadductionhipl,passiverangeflexionhipr,passiverangeextensionhipr,passiverangeexternalrotationhipr,passiverangeinternalrotationhipr,passiverangeabductionhipr,passiverangeadductionhipr,dtrachilles,dtrbiceps,dtrbrachioradialis,dtrpatellar,dtrtriceps,babinskisreflex,oculocephalic,paralysistype,paresthesiatype,physiologicfinding,musculoskeletalassessmentimpression,mskremark};
 const physicalexamination={cvs,resp,gi,gu,neuro,msk}; 
 //validateinputfaulsyvalue({...vitals});
  var queryresult
  if(height || weight ){
queryresult = await updateappointment(id, {$set:{'encounter.vitals': vitals,'encounter.generalphysicalexamination':generalphysicalexaminations,'encounter.assessmentdiagnosis':assessmentdiagnosis,'encounter.physicalexamination':physicalexamination},status});
  }
  else{
    queryresult = await updateappointment(id, {$set:{'encounter.generalphysicalexamination':generalphysicalexaminations,'encounter.assessmentdiagnosis':assessmentdiagnosis,'encounter.physicalexamination':physicalexamination},status});

  }
  res.status(200).json({
      queryresult,
      status:true
    }); 
  }catch(e:any){
    console.log(e);
    res.status(403).json({status: false, msg:e.message});

  }

}
//get vitals per patient
export const getAllVtalsByPatient = async (req:any, res:any) => {
  try {
    var selectquery ={'encounter.vitals':1};
    const {clinic} = (req.user).user;
    const {id} = req.params;
    const queryresult = await readallappointment({patient:id,$or:[{status:configuration.status[5]},{status:configuration.status[6]}],clinic},selectquery,'patient','doctor','payment');
    res.status(200).json({
      queryresult,
      status:true
    }); 
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};


/*
  findings: String,  // Description of the examination findings
  diagnosis: String, // Doctor's diagnosis based on the examination
  prescriptions: String,  // List of prescribed medications or treatments
  requestforlabtest: String,
  notes: String, // Additional notes (if any)
*/

