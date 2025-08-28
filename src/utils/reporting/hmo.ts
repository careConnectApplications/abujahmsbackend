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
    const insurancePatientsByGenderAndName = [
    {
      $match: {
        $and: [
          {
            isHMOCover: configuration.ishmo[1] // Only insurance covered patients
          },
          { createdAt: { $gt: startdate, $lt: enddate } }
        ]
      }
    },
    {
      $group: {
        _id: {
          gender: { $ifNull: ["$gender", "Unknown"] },
          insuranceName: { $ifNull: ["$HMOName", "Insurance Not Found"] }
        },
        TotalNumber: { $sum: 1 }
      }
    },
    {
      $project: {
        Gender: "$_id.gender",
        InsuranceName: "$_id.insuranceName",
        TotalNumber: 1,
        _id: 0
      }
    },
    {
      $sort: {
        InsuranceName: 1,
        Gender: 1
      }
    }
  ];


    return {appointmentaggregatebyhmo,aggregatebyhmo,insurancePatientsByGenderAndName}
}
