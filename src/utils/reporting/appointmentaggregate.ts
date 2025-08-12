import configuration from "../../config";
export const appointmentaggregatereports=(startdate:any,enddate:any)=>{
const appointmentaggregatescheduled = [
      {   
      
        $match:{$and:[{status:configuration.status[5]} , {
          appointmentdate:{ $gt: startdate, $lt: enddate }}]}   

},
      {
        $group: {
          _id: "$clinic",                // Group by product
          Numberofappointment: { $sum: 1 },
        }
      },
      {
        $project:{
          clinic:"$_id",
          Numberofappointment:1,
          status:configuration.status[5],
          _id:0

        }

      }
        
    ];
    const appointmentaggregatecomplete = [
      {   
      
        $match:{$and:[{status:configuration.status[6]} , {
          appointmentdate:{ $gt: startdate, $lt: enddate }}]}   

},
      {
        $group: {
          _id: "$clinic",                // Group by product
          Numberofappointment: { $sum: 1 },
        }
      },
      {
        $project:{
          clinic:"$_id",
          Numberofappointment:1,
          status:configuration.status[6],
          _id:0

        }

      }
        
    ];
    const appointmentaggregateinprogress = [
      {   
      
        $match:{$and:[{status:configuration.status[9]} , {
          appointmentdate:{ $gt: startdate, $lt: enddate }}]}   

},
      {
        $group: {
          _id: "$clinic",                // Group by product
          Numberofappointment: { $sum: 1 },
        }
      },
      {
        $project:{
          clinic:"$_id",
          Numberofappointment:1,
          status:configuration.status[9],
          _id:0

        }

      }
        
    ];
    
    const appointmentaggregatetotalnumberofappointments = [
      {   
      
        $match:{$or:[{status:configuration.status[5]},{status:configuration.status[6]},{status:configuration.status[9]}],appointmentdate:{ $gt: startdate, $lt: enddate }}   

},
      {
        $group: {
          _id: null,                // Group by product
          GrandTotalNumberofappointment: { $sum: 1 },
        }
      },
      {
        $project:{
          GrandTotalNumberofappointment:1,
          _id:0

        }

      }
        
    ];
    const clinicalaggregate = [
          {   
          
            $match:{appointmentdate:{ $gt: startdate, $lt: enddate }}   
    
    },
          {
            $group: {
              _id:{
              $ifNull: ["$clinicalencounter.diagnosisicd10", "No Diagnosis"]             // Group by product
              },
              Numberofappointment: { $sum: 1 },
            }
          },
          {
            $project:{
              diagnosis:"$_id",
              Numberofappointment:1,
              _id:0
    
            }
    
          }
            
        ];
    return {appointmentaggregatescheduled,appointmentaggregatecomplete,appointmentaggregateinprogress,appointmentaggregatetotalnumberofappointments,clinicalaggregate}
}
    