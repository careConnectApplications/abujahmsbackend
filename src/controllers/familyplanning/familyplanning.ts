import {readallfamilyplannings,createfamilyplannings,updatefamilyplannings} from "../../dao/familyplanning";
import {readonepatient} from "../../dao/patientmanagement";
import {validateinputfaulsyvalue,validateinputyesno} from "../../utils/otherservices";
import  mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import  {readone}  from "../../dao/users";
import configuration from "../../config";


  //get lab order by patient
  export const readAllfamilyplanningByPatient = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {patient} = req.params;
      const queryresult = await readallfamilyplannings({patient},{},'patient');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };

  //create vital charts
  // Create a new schedule
export const createfamilyplanning = async (req:any, res:any) => {
    try {
      const {id} = req.params;
      const { firstName,lastName} = (req.user).user;
      req.body.staffname = `${firstName} ${lastName}`;
      //ensure the field type

      var { weight,bloodpressuresystolic,parity,counsellingonfamilyplanning,counsellingonpostpartumfamilyplanning,firsttimemodernfamilyplanninguser,emergencycontraception,typeoffamilyplanningclient,oralpillsname,orapillsquantity,oralnewacceptor,oralrevisit,nameofinjectable,injectablequantity,selfinjection,injectableacceptor,injectablerevisit,typeofiud,iudinnewacceptor,iudinrevisit,iudoutnewacceptor,iudoutrevisit,typeofbarriermethods,barrierquantity,barriernewacceptor,barrierrevisit,typeofimplants,implantsinnewacceptor,implantsinrevisit,implantsoutnewacceptor,implantsoutrevisit,voluntorysterilization,naturalemthodsnewacceptorforcyclebeads,naturalemthodsrevisitforcyclebeads,naturalemthodsnewacceptorforothers,naturalemthodsrevisitforothers,referredoralpills,referredinjectable,referredip,referredintrauterinedevice,referredsurgicalreferred,referredmedicalreferred,staffname} = req.body;
      validateinputfaulsyvalue({weight,bloodpressuresystolic,parity,counsellingonfamilyplanning,counsellingonpostpartumfamilyplanning,firsttimemodernfamilyplanninguser,emergencycontraception,typeoffamilyplanningclient,oralpillsname,orapillsquantity,oralnewacceptor,oralrevisit,nameofinjectable,injectablequantity,selfinjection,injectableacceptor,injectablerevisit,typeofiud,iudinnewacceptor,iudinrevisit,iudoutnewacceptor,iudoutrevisit,typeofbarriermethods,barrierquantity,barriernewacceptor,barrierrevisit,typeofimplants,implantsinnewacceptor,implantsinrevisit,implantsoutnewacceptor,implantsoutrevisit,voluntorysterilization,naturalemthodsnewacceptorforcyclebeads,naturalemthodsrevisitforcyclebeads,naturalemthodsnewacceptorforothers,naturalemthodsrevisitforothers,referredoralpills,referredinjectable,referredip,referredintrauterinedevice,referredsurgicalreferred,referredmedicalreferred,staffname});
      validateinputyesno({oralnewacceptor,oralrevisit,injectableacceptor,injectablerevisit,iudinnewacceptor,iudinrevisit,iudoutnewacceptor,iudoutrevisit,barriernewacceptor,barrierrevisit,implantsinnewacceptor,implantsinrevisit,implantsoutnewacceptor,implantsoutrevisit,naturalemthodsnewacceptorforcyclebeads,naturalemthodsrevisitforcyclebeads,naturalemthodsnewacceptorforothers,naturalemthodsrevisitforothers,referredoralpills,referredinjectable,referredip,referredintrauterinedevice,referredsurgicalreferred,referredmedicalreferred}); 
      //frequency must inlcude
       //route must contain allowed options
      
      const patientrecord:any =  await readonepatient({_id:id},{},'','');    
      //console.log(admissionrecord);   
      if(!patientrecord){
           throw new Error(`Patient donot ${configuration.error.erroralreadyexit}`);
  
       }
    const queryresult=await createfamilyplannings({patient:patientrecord._id,weight,bloodpressuresystolic,parity,counsellingonfamilyplanning,counsellingonpostpartumfamilyplanning,firsttimemodernfamilyplanninguser,emergencycontraception,typeoffamilyplanningclient,oralpillsname,orapillsquantity,oralnewacceptor,oralrevisit,nameofinjectable,injectablequantity,selfinjection,injectableacceptor,injectablerevisit,typeofiud,iudinnewacceptor,iudinrevisit,iudoutnewacceptor,iudoutrevisit,typeofbarriermethods,barrierquantity,barriernewacceptor,barrierrevisit,typeofimplants,implantsinnewacceptor,implantsinrevisit,implantsoutnewacceptor,implantsoutrevisit,voluntorysterilization,naturalemthodsnewacceptorforcyclebeads,naturalemthodsrevisitforcyclebeads,naturalemthodsnewacceptorforothers,naturalemthodsrevisitforothers,referredoralpills,referredinjectable,referredip,referredintrauterinedevice,referredsurgicalreferred,referredmedicalreferred,staffname});
    res.status(200).json({queryresult, status: true});
    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }
}


//insulin

export async function updatefamilyplanning(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const { firstName,lastName} = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
    var {weight,bloodpressuresystolic,parity,counsellingonfamilyplanning,counsellingonpostpartumfamilyplanning,firsttimemodernfamilyplanninguser,emergencycontraception,typeoffamilyplanningclient,oralpillsname,orapillsquantity,oralnewacceptor,oralrevisit,nameofinjectable,injectablequantity,selfinjection,injectableacceptor,injectablerevisit,typeofiud,iudinnewacceptor,iudinrevisit,iudoutnewacceptor,iudoutrevisit,typeofbarriermethods,barrierquantity,barriernewacceptor,barrierrevisit,typeofimplants,implantsinnewacceptor,implantsinrevisit,implantsoutnewacceptor,implantsoutrevisit,voluntorysterilization,naturalemthodsnewacceptorforcyclebeads,naturalemthodsrevisitforcyclebeads,naturalemthodsnewacceptorforothers,naturalemthodsrevisitforothers,referredoralpills,referredinjectable,referredip,referredintrauterinedevice,referredsurgicalreferred,referredmedicalreferred,staffname} = req.body;
    validateinputfaulsyvalue({weight,bloodpressuresystolic,parity,counsellingonfamilyplanning,counsellingonpostpartumfamilyplanning,firsttimemodernfamilyplanninguser,emergencycontraception,typeoffamilyplanningclient,oralpillsname,orapillsquantity,oralnewacceptor,oralrevisit,nameofinjectable,injectablequantity,selfinjection,injectableacceptor,injectablerevisit,typeofiud,iudinnewacceptor,iudinrevisit,iudoutnewacceptor,iudoutrevisit,typeofbarriermethods,barrierquantity,barriernewacceptor,barrierrevisit,typeofimplants,implantsinnewacceptor,implantsinrevisit,implantsoutnewacceptor,implantsoutrevisit,voluntorysterilization,naturalemthodsnewacceptorforcyclebeads,naturalemthodsrevisitforcyclebeads,naturalemthodsnewacceptorforothers,naturalemthodsrevisitforothers,referredoralpills,referredinjectable,referredip,referredintrauterinedevice,referredsurgicalreferred,referredmedicalreferred,staffname});
    
    var queryresult = await updatefamilyplannings(id, {weight,bloodpressuresystolic,parity,counsellingonfamilyplanning,counsellingonpostpartumfamilyplanning,firsttimemodernfamilyplanninguser,emergencycontraception,typeoffamilyplanningclient,oralpillsname,orapillsquantity,oralnewacceptor,oralrevisit,nameofinjectable,injectablequantity,selfinjection,injectableacceptor,injectablerevisit,typeofiud,iudinnewacceptor,iudinrevisit,iudoutnewacceptor,iudoutrevisit,typeofbarriermethods,barrierquantity,barriernewacceptor,barrierrevisit,typeofimplants,implantsinnewacceptor,implantsinrevisit,implantsoutnewacceptor,implantsoutrevisit,voluntorysterilization,naturalemthodsnewacceptorforcyclebeads,naturalemthodsrevisitforcyclebeads,naturalemthodsnewacceptorforothers,naturalemthodsrevisitforothers,referredoralpills,referredinjectable,referredip,referredintrauterinedevice,referredsurgicalreferred,referredmedicalreferred,staffname});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }

  
      
  