import {readallvitalcharts, createvitalcharts} from "../../dao/vitalcharts";
import {readoneadmission} from "../../dao/admissions";
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import  mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import  {readone}  from "../../dao/users";
import configuration from "../../config";

// Get all lab records
export const readallvitalchartByAdmission = async (req:any, res:any) => {
    try {
     const {admission} = req.params;
      const queryresult = await readallvitalcharts({admission},{},'patient','admission');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };
  //get lab order by patient
  export const readAllvitalsByPatient = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {patient} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readallvitalcharts({patient},{},'patient','admission');
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
export const createvitalchart = async (req:any, res:any) => {
    try {
        
       // admission,patient,height,weight,temperature,heartrate,bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,bmi,painscore,rbs,gcs,wardname,staffname,
      
     
      const {id} = req.params;
      const { firstName,lastName} = (req.user).user;
      req.body.staffname = `${firstName} ${lastName}`;
      var { height,weight,temperature,heartrate,bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,painscore,rbs,gcs,staffname} = req.body;
      validateinputfaulsyvalue({height,weight,temperature,heartrate,bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,painscore,rbs,gcs,staffname});
      var bmi = weight/((height/100) * (height/100));
      
      const admissionrecord:any =  await readoneadmission({_id:id},{},'');    
      console.log(admissionrecord);   
      if(!admissionrecord){
           throw new Error(`Admission donot ${configuration.error.erroralreadyexit}`);
  
       }
    const queryresult=await createvitalcharts({referedward:admissionrecord.referedward,admission:admissionrecord._id,patient:admissionrecord.patient,bmi,height,weight,temperature,heartrate,bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,painscore,rbs,gcs,staffname});
    res.status(200).json({queryresult, status: true});
    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }
}
  
      
  /*
  //lab processing
 export async function labresultprocessing(req:any, res:any){
  try{
  //get id
  const {id} = req.params;
  const {subcomponents} = req.body;
  const {email, staffId} = (req.user).user;
  //find id and validate
  var lab =await readonelab({_id:id},{},'');
  validateinputfaulsyvalue({lab,subcomponents});
  const user = await readone({email, staffId});

  //loop through array of subcomponent 
  for(var i=0; i < subcomponents.length; i++){
    //throw error if no subcomponent
    const {subcomponent,result,nranges,unit} =subcomponents[i];
    validateinputfaulsyvalue({subcomponent,result,nranges,unit})
  }
  var processeddate:any=new Date();
  //update test, lab technical name and test status
  var queryresult=await updatelab({_id:id},{$push: {testresult:subcomponents},status:configuration.status[7],processeddate,staffname:user?._id});
  //update status of appointment
  res.status(200).json({
      queryresult,
      status:true
    });
    
  }catch(e:any){
    console.log(e);
    res.status(403).json({status: false, msg:e.message});

  }

}

//view all schedule lab
// Get all lab records
export const readallscheduledlab = async (req:any, res:any) => {
  try {
      //const {clinic} = (req.user).user;
    //const queryresult = await readalllab({department:clinic},{},'patient','appointment','payment');
    const queryresult = await readalllab({status:configuration.status[5]},{},'patient','appointment','payment');
    res.status(200).json({
      queryresult,
      status:true
    }); 
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};

//lab reports
export const listlabreport = async (req:any, res:any) => {
  try {
   
   
    // find related
    const query = { status:configuration.status[7]};
    const queryresult = await readlabaggregate([
      {
        $lookup: {
          from: "appointments",
          localField: "appointment",
          foreignField: "_id",
          as: "appointments",
        },
      },
      {
        $lookup: {
          from: "patientsmanagements",
          localField: "patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
       
        $match: query,
      },
      

      {
        $group: {
          _id: "$appointment",
          MRN:{$first: {$first:"$patient.MRN"}},
          firstName:{$first: {$first:"$patient.firstName"}},
          lastName:{$first: {$first:"$patient.lastName"}},
          phoneNumber:{$first: {$first:"$patient.phoneNumber"}},
          appointmentid: {$first: {$first:"$appointments.appointmentid"}},
          appointmentdate: {$first: {$first: "$appointments.appointmentdate"}}
          
        },
        
        
      },
      


      
      { $sort: { createdAt: -1 } },
      
    ]);
   
   
    

    res.json({
      queryresult,
      status: true,
    });
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};
//print lab report
export const printlabreport = async (req:any, res:any) => {
  try {
      //const {clinic} = (req.user).user;
    //const queryresult = await readalllab({department:clinic},{},'patient','appointment','payment');
    var populatequery ={
      path: "staffname",
      select: {
        firstName: 1,
        middleName:1,
        _id:0
      },
    };
    var patientpopulatequery ={
      path: "patient",
      select: {
        MRN: 1,
        firstName:1,
        lastName:1,
        age:1,
        gender:1

        //_id:0
      },
    };
    const {id} = req.params;
    const queryresult = await readalllab({appointment:id, testresult: { $exists: true, $not: { $size: 0 } }},{testname:1,testid:1,testresult:1,status:1,appointmentid:1,createdAt:1,processeddate:1},populatequery,patientpopulatequery,'');
    res.status(200).json({
      queryresult,
      status:true
    }); 
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};
//list lab report by patient
//lab reports
export const listlabreportbypatient = async (req:any, res:any) => {
  try {
   
    const {id} = req.params;
    const objectId = new ObjectId(id);
    // find related
    //const query = { patient._id:id};
    const query = { patient: objectId,status:configuration.status[7]};
    const queryresult = await readlabaggregate([
      {
       
        $match: query,
      },
      
      {
        $lookup: {
          from: "appointments",
          localField: "appointment",
          foreignField: "_id",
          as: "appointments",
        },
      },
      {
        $lookup: {
          from: "patientsmanagements",
          localField: "patient",
          foreignField: "_id",
          as: "patient",
        },
      },
     
      

      {
        $group: {
          _id: "$appointment",
          MRN:{$first: {$first:"$patient.MRN"}},
          firstName:{$first: {$first:"$patient.firstName"}},
          lastName:{$first: {$first:"$patient.lastName"}},
          phoneNumber:{$first: {$first:"$patient.phoneNumber"}},
          appointmentid: {$first: {$first:"$appointments.appointmentid"}},
          appointmentdate: {$first: {$first: "$appointments.appointmentdate"}}
          
        },
        
        
      },
      
      


      
      { $sort: { createdAt: -1 } },
      
    ]);
   
   
    

    res.json({
      queryresult,
      status: true,
    });
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};


*/