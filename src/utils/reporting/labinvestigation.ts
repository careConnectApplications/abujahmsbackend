import configuration from "../../config";

export const labinvestigationreports = (startdate: any, enddate: any) => {
  // Lab Investigation pipeline for regular lab tests from labs collection
  const labInvestigationPipeline = [
    
    {
      $match: {
        createdAt: { $gte: startdate, $lt: enddate }
      }
    },
    
    {
      $lookup: {
        from: "patientsmanagements",
        localField: "patient",
        foreignField: "_id",
        as: "patientInfo"
      }
    },
    { $unwind: "$patientInfo" },
    {
      $project: {
        labcategory: 1,
        gender: "$patientInfo.gender"
      }
    },
    {
      $facet: {
        hematology: [
          { $match: { labcategory: "hematology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        parasitology: [
          { $match: { labcategory: "parasitology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        chemicalpathology: [
          { $match: { labcategory: "chemicalpathology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        microbiology: [
          { $match: { labcategory: "microbiology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        bloodtransfusion: [
          { $match: { labcategory: "bloodtransfusion" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        blooddonation: [
          { $match: { labcategory: "blooddonation" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        cytology: [
          { $match: { labcategory: "cytology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        
        histology: [
          {
            $lookup: {
              from: "histologyrequests",
              pipeline: [
                {
                  $match: {
                    createdAt: { $gte: startdate, $lt: enddate }
                  }
                },
                {
                  $lookup: {
                    from: "patientsmanagements",
                    localField: "patient",
                    foreignField: "_id",
                    as: "patientInfo"
                  }
                },
                { $unwind: "$patientInfo" },
                {
                  $group: { 
                    _id: "$patientInfo.gender", 
                    count: { $sum: 1 } 
                  }
                }
              ],
              as: "histologyData"
            }
          },
          {
            $unwind: {
              path: "$histologyData",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $ifNull: ["$histologyData", { _id: null, count: 0 }]
              }            }
          }
        ],
        
        histopathologyAutopsy: [
          {
            $lookup: {
              from: "histopathologies",
              pipeline: [
                {
                  $match: {
                    createdAt: { $gte: startdate, $lt: enddate }
                  }
                },
                {
                  $lookup: {
                    from: "patientsmanagements",
                    localField: "patient",
                    foreignField: "_id",
                    as: "patientInfo"
                  }
                },
                { $unwind: "$patientInfo" },
                {
                  $group: { 
                    _id: "$patientInfo.gender", 
                    count: { $sum: 1 } 
                  }
                }
              ],
              as: "histopathologyData"
            }
          },
          {
            $unwind: {
              path: "$histopathologyData",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $ifNull: ["$histopathologyData", { _id: null, count: 0 }]
              }
            }
          }
        ]
      }
    }
  ];

  return { 
    labInvestigationPipeline
  };
};
