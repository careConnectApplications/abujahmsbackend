import {updateanc, createanc,readallanc, readoneanc} from "../../dao/anc";
import {readallancfollowup,updateancfollowup,createancfollowup} from "../../dao/ancfollowup";
import { validateinputfaulsyvalue,isObjectAvailable } from "../../utils/otherservices";
import {readonepatient} from "../../dao/patientmanagement";
import configuration from "../../config";
//get lab order by patient
///////////////////////////anc followup/////////////////////////
export const readAllancfollowupByAnc = async (req:any, res:any) => {
    try {
      const {anc} = req.params;
      const queryresult = await readallancfollowup({anc},{},'');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };

 
export const createancfollowups = async (req:any, res:any) => {
    try {
      const {anc} = req.params;
      const { firstName,lastName} = (req.user).user;
      req.body.staffname = `${firstName} ${lastName}`;    
      var {ga,sfh,wf,lie,presentation,position,fhr,urine,bp,remark,followup,riskidentified,currentmedication,staffname} = req.body;
      validateinputfaulsyvalue({ga,sfh,wf,lie,presentation,position,fhr,urine,bp,remark,followup,riskidentified,currentmedication,staffname});
       //frequency must inlcude
       //route must contain allowed options
      
      const ancrecord:any =  await readoneanc({_id:anc},{},'');    
      //console.log(admissionrecord);   
      if(!ancrecord){
           throw new Error(`ANC donot ${configuration.error.erroralreadyexit}`);
  
       }
    const queryresult=await createancfollowup({anc:ancrecord._id,ga,sfh,wf,lie,presentation,position,fhr,urine,bp,remark,followup,riskidentified,currentmedication,staffname});
    res.status(200).json({queryresult, status: true});
    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }
}


//insulin

export async function updateancfollowups(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const { firstName,lastName} = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
    var {ga,sfh,wf,lie,presentation,position,fhr,urine,bp,remark,followup,riskidentified,currentmedication,staffname} = req.body;
    validateinputfaulsyvalue({ga,sfh,wf,lie,presentation,position,fhr,urine,bp,remark,followup,riskidentified,currentmedication,staffname});
    var queryresult = await updateancfollowup(id, {ga,sfh,wf,lie,presentation,position,fhr,urine,bp,remark,followup,riskidentified,currentmedication,staffname});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }



////////////////////////////////anc////////////////////////////
  export const readAllancByPatient = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {patient} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readallanc({patient},{},'patient');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };

export const createancs = async (req:any, res:any) => {
    try {
      const {id} = req.params;
      const { firstName,lastName} = (req.user).user;
      const staffname = `${firstName} ${lastName}`;
      //if(!(isObjectAvailable(req.body.pregnancysummary))) req.body.pregnancysummary={};
      if(!(isObjectAvailable(req.body.medicalobsterichistory))) req.body.medicalobsterichistory={};
      if(!(isObjectAvailable(req.body.currenthistory))) req.body.currenthistory={};
      if(!(isObjectAvailable(req.body.generalmedicalhistory))) req.body.generalmedicalhistory={};
      if(!(isObjectAvailable(req.body.physicalexamination))) req.body.physicalexamination={};
      if(!(isObjectAvailable(req.body.laboratory))) req.body.laboratory={};
      if(!(isObjectAvailable(req.body.healtheducationtopicscovered))) req.body.healtheducationtopicscovered={};
      if(!(isObjectAvailable(req.body.tetanustoxod))) req.body.tetanustoxod={};
      if(!(isObjectAvailable(req.body.ipt))) req.body.ipt={};
      if(!(isObjectAvailable(req.body.ironfolategiven))) req.body.ironfolategiven={};
   
      
     
       const {currentmedication,allergies} = req.body;
       const {lmp,cycle,edd,gravida,term,preterm,abortions,ectopic,stillbirths,noliving} = req.body;
       const {previousstillbirthornewbornloss,historyofthreeormoreconsecutivespontaneousabortions,birthweightoflastbabylessthan450,birthweightoflastbabygreaterthan450,lastpregnancyhospitaladmissionforpeteclampsia,previoussurgeryonreproductivetract} = (req.body).medicalobsterichistory;
       const {diagnosedsuspectedmultipleprenancy,agelessthan16,agemorethan40,rhesusnegative,vaginalbleeding,pelvicmass,diastolicbpgreaterthan90} = (req.body).currenthistory;
      const {diabetesmellitus,renaldisease,cardiacdisease,sicklecelldisease,hivpositive,anyotherseveremedicaldeseaseorconditionspecify}=(req.body).generalmedicalhistory;
      const {weight,bloodpressure,pulse,headteetheyesnosethroat,thyroid,chest,breasts,cardiovascular,abdomen,varicoseveins,neurologicalexam,externalgenitalia,cervixvigina,uterus,adnexa,anythingabnormal,additionalcomment}=(req.body).physicalexamination;
     const {haemoglobinhaematocrit,urinalysisprotientsugar,vdrlorrprotientsugar,boodgroupandrhesusstatus,hivtest,urinnemicroscopic,haemoglobin,others}=(req.body).laboratory;
     const {nutrition,restandexercise,malariainpregnancy,safersexinpregnancy,vctforpreventionofmotertochildtrnsmissionofhiv,birthandemergencyreadnessplanning,alcohotobaccoorotherdrugsysed,familyplanningbirthspacing,infantfeedingoptions}=(req.body).healtheducationtopicscovered;
    const {tetanusfirstdose,tetanusfirstdosedate,tetanusseconddose,tetatusseonddosedate,tetanusthirddose,tetanusthirddosedate,tetatusfourthdose,tetanusfourthdosedate,tetanusfifthdose,tetanusfifthdosedate}=(req.body).tetanustoxod;
    const {iptfirstdose,iptfirstdosedate,iptseconddose,iptseconddosedate,iptthirddose,iptthirddosedate,iptfourthdose,iptfourthdosedate,iptfifthdose,iptfifthdosedate,iptsixthdose,iptsixthdosedate,}=(req.body).ipt
    const {prescription,tablets,ironfolategivendate} = (req.body).ironfolategiven
    
      
      
         
       //general physical examination
       const pregnancysummary={lmp,cycle,edd,gravida,term,preterm,abortions,ectopic,stillbirths,noliving};
       const medicalobsterichistory={previousstillbirthornewbornloss,historyofthreeormoreconsecutivespontaneousabortions,birthweightoflastbabylessthan450,birthweightoflastbabygreaterthan450,lastpregnancyhospitaladmissionforpeteclampsia,previoussurgeryonreproductivetract}
       const currenthistory ={diagnosedsuspectedmultipleprenancy,agelessthan16,agemorethan40,rhesusnegative,vaginalbleeding,pelvicmass,diastolicbpgreaterthan90};
       const generalmedicalhistory = {diabetesmellitus,renaldisease,cardiacdisease,sicklecelldisease,hivpositive,anyotherseveremedicaldeseaseorconditionspecify};
       const physicalexamination= {weight,bloodpressure,pulse,headteetheyesnosethroat,thyroid,chest,breasts,cardiovascular,abdomen,varicoseveins,neurologicalexam,externalgenitalia,cervixvigina,uterus,adnexa,anythingabnormal,additionalcomment};
       const laboratory = {haemoglobinhaematocrit,urinalysisprotientsugar,vdrlorrprotientsugar,boodgroupandrhesusstatus,hivtest,urinnemicroscopic,haemoglobin,others};
       const healtheducationtopicscovered = {nutrition,restandexercise,malariainpregnancy,safersexinpregnancy,vctforpreventionofmotertochildtrnsmissionofhiv,birthandemergencyreadnessplanning,alcohotobaccoorotherdrugsysed,familyplanningbirthspacing,infantfeedingoptions};
       const tetanustoxod = {tetanusfirstdose,tetanusfirstdosedate,tetanusseconddose,tetatusseonddosedate,tetanusthirddose,tetanusthirddosedate,tetatusfourthdose,tetanusfourthdosedate,tetanusfifthdose,tetanusfifthdosedate};
       const ipt= {iptfirstdose,iptfirstdosedate,iptseconddose,iptseconddosedate,iptthirddose,iptthirddosedate,iptfourthdose,iptfourthdosedate,iptfifthdose,iptfifthdosedate,iptsixthdose,iptsixthdosedate};
       const ironfolategiven ={prescription,tablets,ironfolategivendate};
       const {obstetrichistory} = req.body;
       
    
       //frequency must inlcude
       //route must contain allowed options
      
      const patientrecord:any =  await readonepatient({_id:id},{},'','');    
      //console.log(admissionrecord);   
      if(!patientrecord){
           throw new Error(`Patient donot ${configuration.error.erroralreadyexit}`);
  
       }
    const queryresult=await createanc({patient:patientrecord._id,obstetrichistory,pregnancysummary,medicalobsterichistory,currenthistory,generalmedicalhistory,physicalexamination,laboratory,healtheducationtopicscovered,tetanustoxod,ironfolategiven,ipt,currentmedication,allergies,staffname});
    res.status(200).json({queryresult, status: true});
    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }
}

export async function updateancs(req:any, res:any){
    
    try{
    //
    const {id} = req.params;
    const { firstName,lastName} = (req.user).user;
    const staffname = `${firstName} ${lastName}`;
   
   
    
   
   //validate empty object and initialize
  
   if(!(isObjectAvailable(req.body.pregnancysummary))) req.body.pregnancysummary={};
   if(!(isObjectAvailable(req.body.medicalobsterichistory))) req.body.medicalobsterichistory={};
   if(!(isObjectAvailable(req.body.currenthistory))) req.body.currenthistory={};
   if(!(isObjectAvailable(req.body.generalmedicalhistory))) req.body.generalmedicalhistory={};
   if(!(isObjectAvailable(req.body.physicalexamination))) req.body.physicalexamination={};
   if(!(isObjectAvailable(req.body.laboratory))) req.body.laboratory={};
   if(!(isObjectAvailable(req.body.healtheducationtopicscovered))) req.body.healtheducationtopicscovered={};
   if(!(isObjectAvailable(req.body.tetanustoxod))) req.body.tetanustoxod={};
   if(!(isObjectAvailable(req.body.ipt))) req.body.ipt={};
   if(!(isObjectAvailable(req.body.ironfolategiven))) req.body.ironfolategiven={};

   
  
    const {currentmedication,allergies} = req.body;
    const {lmp,cycle,edd,gravida,term,preterm,abortions,ectopic,stillbirths,noliving} = (req.body).pregnancysummary;
    const {previousstillbirthornewbornloss,historyofthreeormoreconsecutivespontaneousabortions,birthweightoflastbabylessthan450,birthweightoflastbabygreaterthan450,lastpregnancyhospitaladmissionforpeteclampsia,previoussurgeryonreproductivetract} = (req.body).medicalobsterichistory;
    const {diagnosedsuspectedmultipleprenancy,agelessthan16,agemorethan40,rhesusnegative,vaginalbleeding,pelvicmass,diastolicbpgreaterthan90} = (req.body).currenthistory;
   const {diabetesmellitus,renaldisease,cardiacdisease,sicklecelldisease,hivpositive,anyotherseveremedicaldeseaseorconditionspecify}=(req.body).generalmedicalhistory;
   const {weight,bloodpressure,pulse,headteetheyesnosethroat,thyroid,chest,breasts,cardiovascular,abdomen,varicoseveins,neurologicalexam,externalgenitalia,cervixvigina,uterus,adnexa,anythingabnormal,additionalcomment}=(req.body).physicalexamination;
  const {haemoglobinhaematocrit,urinalysisprotientsugar,vdrlorrprotientsugar,boodgroupandrhesusstatus,hivtest,urinnemicroscopic,haemoglobin,others}=(req.body).laboratory;
  const {nutrition,restandexercise,malariainpregnancy,safersexinpregnancy,vctforpreventionofmotertochildtrnsmissionofhiv,brthandemergencyreadnessplanning,alcohotobaccoorotherdrugsysed,familyplanningbirthspacing,infantfeedingoptions}=(req.body).healtheducationtopicscovered;
 const {tetanusfirstdose,tetanusfirstdosedate,tetanusseconddose,tetatusseonddosedate,tetanusthirddose,tetanusthirddosedate,tetatusfourthdose,tetanusfourthdosedate,tetanusfifthdose,tetanusfifthdosedate}=(req.body).tetanustoxod;
 const {iptfirstdose,iptfirstdosedate,iptseconddose,iptseconddosedate,iptthirddose,iptthirddosedate,iptfourthdose,iptfourthdosedate,iptfifthdose,iptfifthdosedate,iptsixthdose,iptsixthdosedate,}=(req.body).ipt
 const {prescription,tablets,ironfolategivendate} = (req.body).ironfolategiven
 
 
   
   
      
    //general physical examination
    const pregnancysummary={lmp,cycle,edd,gravida,term,preterm,abortions,ectopic,stillbirths,noliving};
    const medicalobsterichistory={previousstillbirthornewbornloss,historyofthreeormoreconsecutivespontaneousabortions,birthweightoflastbabylessthan450,birthweightoflastbabygreaterthan450,lastpregnancyhospitaladmissionforpeteclampsia,previoussurgeryonreproductivetract}
    const currenthistory ={diagnosedsuspectedmultipleprenancy,agelessthan16,agemorethan40,rhesusnegative,vaginalbleeding,pelvicmass,diastolicbpgreaterthan90};
    const generalmedicalhistory = {diabetesmellitus,renaldisease,cardiacdisease,sicklecelldisease,hivpositive,anyotherseveremedicaldeseaseorconditionspecify};
    const physicalexamination= {weight,bloodpressure,pulse,headteetheyesnosethroat,thyroid,chest,breasts,cardiovascular,abdomen,varicoseveins,neurologicalexam,externalgenitalia,cervixvigina,uterus,adnexa,anythingabnormal,additionalcomment};
    const laboratory = {haemoglobinhaematocrit,urinalysisprotientsugar,vdrlorrprotientsugar,boodgroupandrhesusstatus,hivtest,urinnemicroscopic,haemoglobin,others};
    const healtheducationtopicscovered = {nutrition,restandexercise,malariainpregnancy,safersexinpregnancy,vctforpreventionofmotertochildtrnsmissionofhiv,brthandemergencyreadnessplanning,alcohotobaccoorotherdrugsysed,familyplanningbirthspacing,infantfeedingoptions};
    const tetanustoxod = {tetanusfirstdose,tetanusfirstdosedate,tetanusseconddose,tetatusseonddosedate,tetanusthirddose,tetanusthirddosedate,tetatusfourthdose,tetanusfourthdosedate,tetanusfifthdose,tetanusfifthdosedate};
    const ipt= {iptfirstdose,iptfirstdosedate,iptseconddose,iptseconddosedate,iptthirddose,iptthirddosedate,iptfourthdose,iptfourthdosedate,iptfifthdose,iptfifthdosedate,iptsixthdose,iptsixthdosedate};
    const ironfolategiven ={prescription,tablets,ironfolategivendate};
    const {obstetrichistory} = req.body;
    //validateinputfaulsyvalue({...vitals});
    var queryresult= await updateanc(id, {pregnancysummary,obstetrichistory,medicalobsterichistory,currenthistory,generalmedicalhistory,physicalexamination,laboratory,healtheducationtopicscovered,tetanustoxod,ironfolategiven,ipt,currentmedication,allergies,staffname});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});
  
    }
      
  
  }
  