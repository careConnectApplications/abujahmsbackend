import path from "path";
import configuration from "../../config";
import  {readone,countuser}  from "../../dao/users";
import {readallappointmentfirstfive,countappointment} from "../../dao/appointment";
import {countpatient} from "../../dao/patientmanagement";
import {countadmission} from "../../dao/admissions"
import {readalllablimitfive,countlab} from "../../dao/lab";
import {countprocedure} from "../../dao/procedure";
import {countradiology} from "../../dao/radiology";
import {readappointmentaggregate,readadmissionaggregate} from "../../dao/reports";

//get all users
export async function dashboard(req:any, res:any){
    try{
      const { _id } = (req.user).user;
        const user = await readone({_id});
        const firstfiveinprocressappointment = await readallappointmentfirstfive({status:configuration.status[9],doctor:_id},{},'patient','doctor','payment');
        const firstfivescheduledlab =  await readalllablimitfive({status:configuration.status[5]},{},'patient','appointment','payment');
        //attended appoitment
        const totalattendedappointment = await countappointment({$or:[{status:configuration.status[9]},{status:configuration.status[6]}]});
        //uplcomming appointment
        const totalschedulesappointment = await countappointment({status:configuration.status[5]});
        res.status(200).json({
            queryresult:{user,firstfiveinprocressappointment,firstfivescheduledlab,totalattendedappointment,totalschedulesappointment},
            status:true
          }); 

    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }

}

export async function newdashboard(req:any, res:any){
  try{
    //number of outpatient // appointment
    let totalnumberofactivepatient = await countpatient({status:configuration.status[1]});
    //total admitted patient
     let totaladmittedpatient = await countadmission({$ne:{status:configuration.admissionstatus[5]}});
     
    //totol discharged
    let totaldischargepatient = await countadmission({status:configuration.admissionstatus[5]});
   
    //total pending procedures
    let totalpendingprocedures = await countprocedure({status:configuration.status[9]});
   
    //total number of staffs
    let totalnumberfactiveusers = await countuser({status:configuration.status[1]});

    //total pending appointments
    let totalpendingappointments = await countappointment({status:configuration.status[5]});
   
  //total pending lab apointment
   let totalpendinglabappointment = await countlab({status:configuration.status[14]});
   
  //total pedning radiology appointment
   let totalpendingradiologyappointment = await countradiology({status:configuration.status[14]});
   
// Get the current date and the date for 7 days ago
const currentDate = new Date();
const sevenDaysAgo = new Date(currentDate);
sevenDaysAgo.setDate(currentDate.getDate() - 7);  // Subtract 7 days
   const barchartaggregate =[
    {
      $match: {
        createdAt: {
          $gte: sevenDaysAgo,  // Greater than or equal to 7 days ago
          $lte: currentDate,   // Less than or equal to the current date
        },
      },
    },
    {
      $addFields: {
        dayOfWeek: { $dayOfWeek: "$createdAt" } // Adds the day of the week (1 = Sunday, 7 = Saturday)
      }
    },
    {
      $group: {
        _id: "$dayOfWeek", // Group by the day of the week
        count: { $sum: 1 }, // Count the number of documents for each day of the week
      }
    },
    {
      $project: {
        _id: 0, // Hide the _id field
        dayOfWeek: "$_id", // Show the day of the week
        count: 1, // Show the count of documents
      }
    },
    {
      $sort: { dayOfWeek: 1 } // Sort by day of the week (1 = Sunday, 2 = Monday, ..., 7 = Saturday)
    }
  ];
  
 
  // Map the days of the week to their actual names
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const appointmentresults = await readappointmentaggregate(barchartaggregate);
  const admissionresult = await readadmissionaggregate(barchartaggregate);  
  let datax=[];
  for(let i=0; i < 7;i++){
    datax.push({
      name:dayNames[i],
      outPatient:(appointmentresults.filter(result=> result.dayOfWeek == i + 1))[0]?.count || 0,
      inPatient: (admissionresult.filter(result=> result.dayOfWeek == i + 1))[0]?.count || 0
    })
      

  }
  res.status(200).json({
    datax,
    totalpendingradiologyappointment,
    totalpendinglabappointment,
    totalpendingappointments,
    totalnumberofactivepatient,
    totaladmittedpatient,
    totaldischargepatient,
    totalpendingprocedures,
    totalnumberfactiveusers,
    status:true
  }); 
   /*
const datax = [
    {
      name: 'MON',
      outPatient: 4000,
      inPatient: 2400,
      
    },
    {
      name: 'TUE',
      outPatient: 3000,
      inPatient: 1398,
      
    },
    {
      name: 'WED',
      outPatient: 2000,
      inPatient: 9800,
      
    },
    {
      name: 'THR',
      outPatient: 2780,
      inPatient: 3908,
      
    },
    {
      name: 'FRI',
      outPatient: 1890,
      inPatient: 4800,
      
    },
    {
      name: 'SAT',
      outPatient: 2390,
      inPatient: 3800,
      
    },
    {
      name: 'SUN',
      outPatient: 3490,
      inPatient: 4300,
     
    },
  ];
   */

  }
  catch(e:any){
    res.status(403).json({status: false, msg:e.message});

  }
}
