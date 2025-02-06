import {createappointment,readallappointment,updateappointment,readoneappointment} from "../../dao/appointment";
import  {readonepatient,updatepatient}  from "../../dao/patientmanagement";
import  {readallservicetype}  from "../../dao/servicetype";
import  {readone}  from "../../dao/users";
import {readoneprice} from "../../dao/price";
import {createpayment} from "../../dao/payment";
//import {createvital} from "../../dao/vitals";
import {createlab} from "../../dao/lab";
import { validateinputfaulsyvalue,generateRandomNumber,validateinputfornumber,isObjectAvailable } from "../../utils/otherservices";
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
  

       const patientrecord =  await readonepatient({_id:patient,status:configuration.status[1]},selectquery,'','');
      // const patientrecord =  await readonepatient({_id:patient},selectquery,'','');
  
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
//previous encounter
export const getAllPreviousEncounter = async (req:any, res:any) => {
  try {
    const {id} = req.params;
    const {clinic} = (req.user).user;
    console.log(clinic);
    const queryresult = await readallappointment({$or:[{status:configuration.status[6]},{status:configuration.status[9]}],clinic,patient:id},{},'patient','doctor','payment');
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
    const queryresult = await readallappointment({$or:[{status:configuration.status[5]},{status:configuration.status[6]},{status:configuration.status[9]}],clinic},{},'patient','doctor','payment');
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
 

  console.log(testname);
var types:any=[];
const {servicetypedetails} = await readallservicetype({},{type:1,category:1,department:1,_id:0});
const servicetypedetail = await readallservicetype({category:"Lab"},{type:1,category:1,department:1,_id:0});

for(var i =0; i <= (servicetypedetail.servicetypedetails).length; i++){
 // var temp:any =(servicetypedetail.servicetypedetails)[i].type;
  types=[...types,...(servicetypedetail.servicetypedetails)[i].type];

};
console.log(types);
    //loop through all test and create record in lab order
    for(var i =0; i < testname.length; i++){
  //    console.log(testname[i]);
      var testPrice:any = await readoneprice({servicetype:testname[i]});
      if(!testPrice){
        throw new Error(configuration.error.errornopriceset);
    }
    var setting  = await configuration.settings();
    //search testname in setting
    console.log('testname',testname[i]);
    var testsetting = servicetypedetails.filter(item => (item.type).includes(testname[i]));
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
    console.log("error", error);
    res.status(403).json({ status: false, msg: error.message });

  }

}
//create vitals
//update a patient
export async function addencounter(req:any, res:any){
  try{
  //


  const {id} = req.params;
  const {email, staffId} = (req.user).user;
  //find doctor and add doctor who examined
  const user = await readone({email, staffId});
 
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
 
 //validate empty object and initialize

 if(!(isObjectAvailable(req.body.medicalhistory))) req.body.medicalhistory={};
 if(!(isObjectAvailable(req.body.paediatricsspecific))) req.body.paediatricsspecific={};
 if(!(isObjectAvailable(req.body.cvs))) req.body.cvs={};
 if(!(isObjectAvailable(req.body.resp))) req.body.resp={};
 if(!(isObjectAvailable(req.body.gi))) req.body.gi={};
 if(!(isObjectAvailable(req.body.gu))) req.body.gu={};
 if(!(isObjectAvailable(req.body.neuro))) req.body.neuro={};
 if(!(isObjectAvailable(req.body.msk))) req.body.msk={};
 if(!(isObjectAvailable(req.body.medicalhistory))) req.body.medicalhistory={};
 if(!(isObjectAvailable(req.body.immunizationhistory))) req.body.immunizationhistory={};
 if(!(isObjectAvailable(req.body.developmentmilestonehistorydetails))) req.body.developmentmilestonehistorydetails={};
 if(!(isObjectAvailable(req.body.prepostnatalhistory))) req.body.prepostnatalhistory={};
 if(!(isObjectAvailable(req.body.historycvs))) req.body.historycvs={};
 if(!(isObjectAvailable(req.body.historyresp))) req.body.historyresp={};
 if(!(isObjectAvailable(req.body.historygi))) req.body.historygi={};
 if(!(isObjectAvailable(req.body.historygu))) req.body.historygu={};
 if(!(isObjectAvailable(req.body.historyneuro))) req.body.historyneuro={};
 if(!(isObjectAvailable(req.body.historymsk))) req.body.historymsk={};

  const {height,weight,temperature, bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,status} = req.body;
  const {assessment,assessmentnote,diagosis,diagosisnote,icpc2,icpc2note} = req.body;
  const { hair,hairnote,face,facenote,jaundice,jaundicenote,cyanosis,cyanosisnote,pallor,pallornote,oral,oralnote,lymphnodes,lymphnodesnote,ederma,edermanote,lastmenstrationperiod,lastmenstrationperiodnote,generalphysicalexamination} = req.body;
  const {currentlengthheight,currentlengthheightpercentage,currentlengthheightenote,currentweight,currentweightnote,percentageofweightexpected,headcircumference,anteriorfontanelle,posteriorfontanelle,chestcircumference,limbexamination,generalnote} = (req.body).paediatricsspecific;
  const {reflexes,rootingreflexes,suckreflexes,mororeflexes,tonicneckreflexes,graspreflexes,steppingreflexes,neuronote} = (req.body).paediatricsspecific;
  const {heartrate,bpsystolic,bpdiastolic,capillaryrefilltime,heartraterhythm,heartsound,heartmurmurgrade,heartmurmurquality,heartmurmurpitch,heartmurmurtiming,murmurlocationauscultation,murmurradiatingtobodylocation,jugularveindistention,jugularveindistentionheadup30degree,edema,temperatureextrmities,tissueperfusionassessmentimpression,cvsremark} = (req.body).cvs;
  const {respiratoryrhthm,respiratoryrate,respiratoryeffort,breathsoundsauscultation,localizedbreathsounds,respiratoryassessmentimpression,respremarks} = (req.body).resp;
  const {bowelsoundauscultation,bowelsoundbyqualityauscultation,bsquadauscultation,physiologicfindingbypalpation,giassessmentimpression,giremarks} = (req.body).gi;
  const {urinecolor,urineodor,urineturbidity,urinecollectiondevice,voidingpattern,appearanceurine,otherurine,genitourinaryassessmentimpression,numbervoids,incontinentvoidsurinary,diapercount,perinealpadscount,colorurine,voidingpatterngu,bloodlossvolume,genitouringassessmentimpressions,guremark} =(req.body).gu;
  const {levelofconsciousness,person,place,time,orientationassessmentimpression,levelofarousal,speechclarity,patientmood,patientmemory,abilitytoconcentrate,abilitytodirectattention,cniexam,cniiexam,cniiiexam,cnivexam,cnvexam,cnviexam,cniviiexam,cniviiiexam,cnixexam,cnxexam,cnxiexam,cnxiiexam,pupildiametereyer,pupildiametereyel,pupillaryresponsepupilr,pupillaryresponsepupill,pupilshaperightpupil,pupilshapeleftpupil,pupilassessmentimpression,physiologicfindingopticlens,glasgowcomascale,neurologyassessmentimpression,nueroremarks}= (req.body).neuro;
  const {muscletone,musclestrength,involuntarymovements,activerangeflexionshoulderl,activerangeextensionshoulderl,activerangeexternalrotationshoulderl,activerangeinternalrotationshoulderl,activerangeabductionshoulderl,activerangeadductionshoulderl,activerangeflexionshoulderr,activerangeextensionshoulderr,activerangeexternalrotationshoulderr,activerangeinternalrotationshoulderr,activerangeabductionshoulderr,activerangeadductionshoulderr,activerangeflexionelbowl,activerangeextensionelbowl,activerangeflexionelbowr,activerangeextensionelbowr,activerangeflexionhipl,activerangeextensionhipl,activerangeexternalrotationhipl,activerangeinternalrotationhipl,activerangeabductionhipl,activerangeadductionhipl,activerangeflexionhipr,activerangeextensionhipr,activerangeexternalrotationhipr,activerangeinternalrotationhipr,activerangeabductionhipr,activerangeadductionhipr,activerangeflexionkneel,activerangeextensionkneel,activerangeflexionkneer,activerangeextensionkneer,passiverangeflexionshoulderl,passiverangeextensionshoulderl,passiverangeexternalrotationshoulderl,passiverangeinternalrotationshoulderl,passiverangeabductionshoulderl,passiverangeadductionshoulderl,passiverangeflexionshoulderr,passiverangeextensionshoulderr,passiverangeexternalrotationshoulderr,passiverangeinternalrotationshoulderr,passiverangeabductionshoulderr,passiverangeadductionshoulderr,passiverangeflexionelbowl,passiverangeextensionelbowl,passiverangeflexionelbowr,passiverangeextensionelbowr,passiverangeflexionhipl,passiverangeextensionhipl,passiverangeexternalrotationhipl,passiverangeinternalrotationhipl,passiverangeabductionhipl,passiverangeadductionhipl,passiverangeflexionhipr,passiverangeextensionhipr,passiverangeexternalrotationhipr,passiverangeinternalrotationhipr,passiverangeabductionhipr,passiverangeadductionhipr,dtrachilles,dtrbiceps,dtrbrachioradialis,dtrpatellar,dtrtriceps,babinskisreflex,oculocephalic,paralysistype,paresthesiatype,physiologicfinding,musculoskeletalassessmentimpression,mskremark,passiverangeflexionkneel,passiverangeextensionkneel,passiverangeflexionkneer,passiverangeextensionkneer} =(req.body).msk;
  const {attentiondeficitdisorderhyperactivitydisorder,attentiondeficitdisorderhyperactivitydisordernote,constipation,constipationnote,fatigue,fatiguenote,orthopedicconditions,orthopedicconditionsnote,allergies,allergiesnote,diabetes,diabetesnote,headaches,headachesnote,scoliosis,scoliosisnote,asthma,asthmanote,digestiveproblems,digestiveproblemsnote,hearingdifficulties,hearingdifficultiesnote,seizures,seizuresnote,blooddisorder,blooddisordernote,depressionanxiety,depressionanxietynote,heartproblems,heartproblemsnote,sleepdisturbances,sleepdisturbancesnote,chroniccolds,chroniccoldsnote,dyslexia,dyslexianote,kidneydisorders,kidneydisordersnote,torticollis,torticollisnote,colic,colicnote,earinfections,earinfectionsnote,lymphdisorders,lymphdisordersnote,visiondifficulties,visiondifficultiesnote,autism,autismnote,sensoryprocessingchallenges,sensoryprocessingchallengesnote} = (req.body).medicalhistory;
  const {stressors,stressorsnote,pregnancymedication,pregnancymedicationnote,cigarettealcoholuse,cigarettealcoholusenote,delivery,deliverynote,deliverytype,deliverytypenote,emergencydelivery,emergencydeliverynote,labourinduction,labourinductionnote,birthhistorymedication,birthhistorymedicationnote,assisteddelivery,assisteddeliverynote,typeofassisteddelivery,typeofassisteddeliverynote,complicationsduringdelivery,complicationsduringdeliverynote,apgarscoreafteroneminute,apgarscoreafterfiveminutes,birthweight,birthlengthheight,useofoxygenafterbirth,feedingofthechild,feedingofthechildnote,difficultyinlatchingsucking,difficultyinlatchingsuckingnote} = (req.body).prepostnatalhistory;
  const {agewhenrolledover,satupunsupported,crawled,walked,spokefirstword,spokeinsentences,totaltrianed,anyfoodallergies,contacttypesport,historyofcaraccident,everbeenseenonemergency,otherhistoryoftrauma,historyoffrequentfalls,anysignofmuscleweakness,anyfoodallergiesnote,contacttypesportnote,historyofcaraccidentnote,everbeenseenonemergencynote,otherhistoryoftraumanote,historyoffrequentfallsnote,anysignofmuscleweaknessnote}=(req.body).developmentmilestonehistorydetails;
  const {immunization,hepb0,opv0,bcg,opv1,penta1,pcv1,rota1,opv2,pcv2,rota2,opv3,penta3,pcv3,rota3,ipv,vitamina1,vitamina2,measles,yellowfever,mena,measles2,hpv914,llin}=(req.body).immunizationhistory;
  const {presentingcomplaints,presentingcompalintcode,pastmedicalhistory,drugandallergyhistory,familyandsocialhistory,nutritionhistory,spirituality} = req.body;
  const {cvsassessmentimpression,historyofcvsdisorder,historyofcvssurgicalprocedures,historycvsremark} = (req.body).historycvs
  const {historyofrespiratorydisorders,respremark }=(req.body).historyresp
  const {nausea,typeofdiet,giboweleliminationpattern,bmfrequency,bmusualtimeoftheday,bmregularity,usualconsistency,dateoflastbm,consistency,color,amount,appearance,historyofgidisorders,historyofsurgicalprocedureofgisystem}=(req.body).historygi;
  const {historyofgenitourinarydisorders,historyofsrgicalprocedureforgusyetm,numberstools,fluidoutputemesis,guboweleliminationpattern,consistencystool,historyguremark} = (req.body).historygu;
  const {historyofneurologicdisorders,historyofsurgicalproceduresofnervoussystem,historyneuroremark}= (req.body).historyneuro;
  const {historyofmusculoskeletaldisorders,historyofsurgicalproceduresofmsksystem,historymskremarks}= (req.body).historymsk;
 

  //vitals
  const vitals = {height,weight,temperature, bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,bmi:req.body.bmi,status:configuration.status[6]};
  if(height || weight){
    validateinputfornumber({height, weight});
    req.body.bmi = weight/((height/100) * (height/100));
    //validateinputfaulsyvalue({...vitals});
    }
 
 
    
  //general physical examination
  const paediatricsspecificationgeneral={currentlengthheight,currentlengthheightpercentage,currentlengthheightenote,currentweight,currentweightnote,percentageofweightexpected,headcircumference,anteriorfontanelle,posteriorfontanelle,chestcircumference,limbexamination,generalnote};
  const paediatricsspecificationneuro={reflexes,rootingreflexes,suckreflexes,mororeflexes,tonicneckreflexes,graspreflexes,steppingreflexes,neuronote}
  const generalphysicalexaminations ={paediatricsspecification:{general:paediatricsspecificationgeneral, neuro:paediatricsspecificationneuro}, hair,hairnote,face,facenote,jaundice,jaundicenote,cyanosis,cyanosisnote,pallor,pallornote,oral,oralnote,lymphnodes,lymphnodesnote,ederma,edermanote,lastmenstrationperiod,lastmenstrationperiodnote,generalphysicalexamination};
  //assessmentdiagnosis
  const  assessmentdiagnosis = {assessment,assessmentnote,diagosis,diagosisnote,icpc2,icpc2note};
  //physical exaamination  
  const  cvs ={heartrate,bpsystolic,bpdiastolic,capillaryrefilltime,heartraterhythm,heartsound,heartmurmurgrade,heartmurmurquality,heartmurmurpitch,heartmurmurtiming,murmurlocationauscultation,murmurradiatingtobodylocation,jugularveindistention,jugularveindistentionheadup30degree,edema,temperatureextrmities,tissueperfusionassessmentimpression,cvsremark};
  const resp ={respiratoryrhthm,respiratoryrate,respiratoryeffort,breathsoundsauscultation,localizedbreathsounds,respiratoryassessmentimpression,respremarks};
  const gi= {bowelsoundauscultation,bowelsoundbyqualityauscultation,bsquadauscultation,physiologicfindingbypalpation,giassessmentimpression,giremarks};
  const gu={urinecolor,urineodor,urineturbidity,urinecollectiondevice,voidingpattern,appearanceurine,otherurine,genitourinaryassessmentimpression,numbervoids,incontinentvoidsurinary,diapercount,perinealpadscount,colorurine,voidingpatterngu,bloodlossvolume,genitouringassessmentimpressions,guremark};
  const neuro={levelofconsciousness,person,place,time,orientationassessmentimpression,levelofarousal,speechclarity,patientmood,patientmemory,abilitytoconcentrate,abilitytodirectattention,cniexam,cniiexam,cniiiexam,cnivexam,cnvexam,cnviexam,cniviiexam,cniviiiexam,cnixexam,cnxexam,cnxiexam,cnxiiexam,pupildiametereyer,pupildiametereyel,pupillaryresponsepupilr,pupillaryresponsepupill,pupilshaperightpupil,pupilshapeleftpupil,pupilassessmentimpression,physiologicfindingopticlens,glasgowcomascale,neurologyassessmentimpression,nueroremarks};
  const msk={muscletone,musclestrength,involuntarymovements,activerangeflexionshoulderl,activerangeextensionshoulderl,activerangeexternalrotationshoulderl,activerangeinternalrotationshoulderl,activerangeabductionshoulderl,activerangeadductionshoulderl,activerangeflexionshoulderr,activerangeextensionshoulderr,activerangeexternalrotationshoulderr,activerangeinternalrotationshoulderr,activerangeabductionshoulderr,activerangeadductionshoulderr,activerangeflexionelbowl,activerangeextensionelbowl,activerangeflexionelbowr,activerangeextensionelbowr,activerangeflexionhipl,activerangeextensionhipl,activerangeexternalrotationhipl,activerangeinternalrotationhipl,activerangeabductionhipl,activerangeadductionhipl,activerangeflexionhipr,activerangeextensionhipr,activerangeexternalrotationhipr,activerangeinternalrotationhipr,activerangeabductionhipr,activerangeadductionhipr,activerangeflexionkneel,activerangeextensionkneel,activerangeflexionkneer,activerangeextensionkneer,passiverangeflexionshoulderl,passiverangeextensionshoulderl,passiverangeexternalrotationshoulderl,passiverangeinternalrotationshoulderl,passiverangeabductionshoulderl,passiverangeadductionshoulderl,passiverangeflexionshoulderr,passiverangeextensionshoulderr,passiverangeexternalrotationshoulderr,passiverangeinternalrotationshoulderr,passiverangeabductionshoulderr,passiverangeadductionshoulderr,passiverangeflexionelbowl,passiverangeextensionelbowl,passiverangeflexionelbowr,passiverangeextensionelbowr,passiverangeflexionhipl,passiverangeextensionhipl,passiverangeexternalrotationhipl,passiverangeinternalrotationhipl,passiverangeabductionhipl,passiverangeadductionhipl,passiverangeflexionhipr,passiverangeextensionhipr,passiverangeexternalrotationhipr,passiverangeinternalrotationhipr,passiverangeabductionhipr,passiverangeadductionhipr,dtrachilles,dtrbiceps,dtrbrachioradialis,dtrpatellar,dtrtriceps,babinskisreflex,oculocephalic,paralysistype,paresthesiatype,physiologicfinding,musculoskeletalassessmentimpression,mskremark,passiverangeflexionkneel,passiverangeextensionkneel,passiverangeflexionkneer,passiverangeextensionkneer};
  const physicalexamination={cvs,resp,gi,gu,neuro,msk}; 
   //paediatrics
   const medicalhistory ={attentiondeficitdisorderhyperactivitydisorder,attentiondeficitdisorderhyperactivitydisordernote,constipation,constipationnote,fatigue,fatiguenote,orthopedicconditions,orthopedicconditionsnote,allergies,allergiesnote,diabetes,diabetesnote,headaches,headachesnote,scoliosis,scoliosisnote,asthma,asthmanote,digestiveproblems,digestiveproblemsnote,hearingdifficulties,hearingdifficultiesnote,seizures,seizuresnote,blooddisorder,blooddisordernote,depressionanxiety,depressionanxietynote,heartproblems,heartproblemsnote,sleepdisturbances,sleepdisturbancesnote,chroniccolds,chroniccoldsnote,dyslexia,dyslexianote,kidneydisorders,kidneydisordersnote,torticollis,torticollisnote,colic,colicnote,earinfections,earinfectionsnote,lymphdisorders,lymphdisordersnote,visiondifficulties,visiondifficultiesnote,autism,autismnote,sensoryprocessingchallenges,sensoryprocessingchallengesnote};
   const prepostnatalhistory = {stressors,stressorsnote,pregnancymedication,pregnancymedicationnote,cigarettealcoholuse,cigarettealcoholusenote,delivery,deliverynote,deliverytype,deliverytypenote,emergencydelivery,emergencydeliverynote,labourinduction,labourinductionnote,birthhistorymedication,birthhistorymedicationnote,assisteddelivery,assisteddeliverynote,typeofassisteddelivery,typeofassisteddeliverynote,complicationsduringdelivery,complicationsduringdeliverynote,apgarscoreafteroneminute,apgarscoreafterfiveminutes,birthweight,birthlengthheight,useofoxygenafterbirth,feedingofthechild,feedingofthechildnote,difficultyinlatchingsucking,difficultyinlatchingsuckingnote};
   const developmentmilestonehistorydetails ={anyfoodallergiesnote,contacttypesportnote,historyofcaraccidentnote,everbeenseenonemergencynote,otherhistoryoftraumanote,historyoffrequentfallsnote,anysignofmuscleweaknessnote,agewhenrolledover,satupunsupported,crawled,walked,spokefirstword,spokeinsentences,totaltrianed,anyfoodallergies,contacttypesport,historyofcaraccident,everbeenseenonemergency,otherhistoryoftrauma,historyoffrequentfalls,anysignofmuscleweakness};
   const immunizationhistory = {immunization,hepb0,opv0,bcg,opv1,penta1,pcv1,rota1,opv2,pcv2,rota2,opv3,penta3,pcv3,rota3,ipv,vitamina1,vitamina2,measles,yellowfever,mena,measles2,hpv914,llin};
   const paediatrics ={medicalhistory,prepostnatalhistory,developmentmilestonehistorydetails,immunizationhistory};
   //history
   const historycvs ={cvsassessmentimpression,historyofcvsdisorder,historyofcvssurgicalprocedures,historycvsremark};
   const historyresp ={historyofrespiratorydisorders,respremark };
   const historygi={nausea,typeofdiet,giboweleliminationpattern,bmfrequency,bmusualtimeoftheday,bmregularity,usualconsistency,dateoflastbm,consistency,color,amount,appearance,historyofgidisorders,historyofsurgicalprocedureofgisystem};
   const historygu ={historyofgenitourinarydisorders,historyofsrgicalprocedureforgusyetm,numberstools,fluidoutputemesis,guboweleliminationpattern,consistencystool,historyguremark};
   const historyneuro ={historyofneurologicdisorders,historyofsurgicalproceduresofnervoussystem,historyneuroremark};
   const historymsk ={historyofmusculoskeletaldisorders,historyofsurgicalproceduresofmsksystem,historymskremarks};
   const history={cvs:historycvs,resp:historyresp,gi:historygi,gu:historygu,neuro:historyneuro,msk:historymsk,presentingcomplaints,presentingcompalintcode,pastmedicalhistory,drugandallergyhistory,familyandsocialhistory,nutritionhistory,spirituality};
   //validateinputfaulsyvalue({...vitals});
  var queryresult
  if(height || weight ){
queryresult = await updateappointment(id, {$set:{'encounter.history':history,'encounter.paediatrics':paediatrics,'encounter.vitals': vitals,'encounter.generalphysicalexamination':generalphysicalexaminations,'encounter.assessmentdiagnosis':assessmentdiagnosis,'encounter.physicalexamination':physicalexamination},status, doctor:user?._id});
  }
  else{
    queryresult = await updateappointment(id, {$set:{'encounter.history':history,'encounter.paediatrics':paediatrics,'encounter.generalphysicalexamination':generalphysicalexaminations,'encounter.assessmentdiagnosis':assessmentdiagnosis,'encounter.physicalexamination':physicalexamination},status, doctor:user?._id});

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

