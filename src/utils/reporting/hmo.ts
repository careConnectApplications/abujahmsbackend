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
        $project: {
          gender: 1,
          HMOName: { $ifNull: ["$HMOName", "Insurance Not Found"] }
        }
      },
      {
        $facet: {
          // Group by insurance names dynamically
          totalPatientsByInsurance: [
            {
              $group: {
                _id: {
                  insuranceName: "$HMOName",
                  gender: "$gender"
                },
                count: { $sum: 1 }
              }
            },
            {
              $group: {
                _id: "$_id.insuranceName",
                data: {
                  $push: {
                    _id: "$_id.gender",
                    count: "$count"
                  }
                }
              }
            }
          ]
        }
      }
    ];


    return {appointmentaggregatebyhmo,aggregatebyhmo,insurancePatientsByGenderAndName}
}

export const insuranceservices = (startdate: any, enddate: any) => {
  // Simple aggregation for insurance patients grouped by gender and insurance name
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
      $project: {
        gender: { $ifNull: ["$gender", "Unknown"] },
        HMOName: { $ifNull: ["$HMOName", "Insurance Not Found"] }
      }
    },
    {
      $group: {
        _id: {
          insuranceName: "$HMOName",
          gender: "$gender"
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        InsuranceName: "$_id.insuranceName",
        Gender: "$_id.gender",
        TotalNumber: "$count",
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

  return {
    insurancePatientsByGenderAndName
  };
};
