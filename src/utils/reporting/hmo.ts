import configuration from "../../config";
export const hmoaggregatereports=(startdate:any,enddate:any)=>{

const aggregatebyhmo = [
      {
        $lookup: {
          from: "patientsmanagements",
          localField: "patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: {
          path: "$patient",
          preserveNullAndEmptyArrays: true
        }
        
      },
      
      {
        $match:{$and:[
          {
            "patient.isHMOCover": configuration.ishmo[1]

          },
           {createdAt:{ $gt: startdate, $lt: enddate }}
          ]
        } 
      },
      
      {
        $group: {
          _id:{$ifNull: ["$patient.HMOName", "HMO Not Found"] } ,
           //"$patient.HMOName",                // Group by product
          TotalNumber: { $sum: 1 },
         
        }
      },
      {
        $project:{
          HMOName:"$_id",
          TotalNumber:1,
          _id:0

        }

      }
    ];
    ///////procedure ////////
    const appointmentaggregatebyhmo = [
      {
        $lookup: {
          from: "patientsmanagements",
          localField: "patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $unwind: {
          path: "$patient",
          preserveNullAndEmptyArrays: true
        }
        
      },
      
      {
        $match:{$and:[
          {
            "patient.isHMOCover": configuration.ishmo[1]

          },
           {appointmentdate:{ $gt: startdate, $lt: enddate }}
          ]
        } 
      },
      
      {
        $group: {
          _id:{$ifNull: ["$patient.HMOName", "HMO Not Found"] } ,
           //"$patient.HMOName",                // Group by product
          TotalNumber: { $sum: 1 },
         
        }
      },
      {
        $project:{
          HMOName:"$_id",
          TotalNumber:1,
          _id:0

        }

      }
    ];
    return {appointmentaggregatebyhmo,aggregatebyhmo}
}