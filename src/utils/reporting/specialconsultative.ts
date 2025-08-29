import configuration from "../../config";

export const specialconsultativereports = (startdate: any, enddate: any) => {
  // Special Consultative pipeline - Section I from the document
  const specialConsultativePipeline = [
    {
      $match: {
        appointmentdate: { $gte: startdate, $lt: enddate }
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
        clinic: 1,
        appointmenttype: 1,
        category: 1,
        gender: "$patientInfo.gender"
      }
    },
    {
      $facet: {
        // Group all appointments by clinic and gender (excluding special cases)
        appointmentsByClinic: [
         
          {
            $group: {
              _id: {
                clinic: "$clinic",
                gender: "$gender"
              },
              count: { $sum: 1 }
            }
          }
        ],
        
        // Dental Clinic from dentalencounters collection
        dentalClinic: [
          {
            $lookup: {
              from: "dentalencounters",
              pipeline: [
                {
                  $match: {
                    createdAt: { $gte: startdate, $lt: enddate }
                  }
                },
                {
                  $lookup: {
                    from: "patientsmanagements",
                    localField: "patientId",
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
              as: "dentalData"
            }
          },
          { $unwind: { path: "$dentalData", preserveNullAndEmptyArrays: true } },
          { $replaceRoot: { newRoot: { $ifNull: ["$dentalData", { _id: null, count: 0 }] } } }
        ],
        
        // Antenatal Registration New from anc3s collection
        antenatalRegistrationNew: [
          {
            $lookup: {
              from: "anc3s",
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
              as: "ancNewData"
            }
          },
          { $unwind: { path: "$ancNewData", preserveNullAndEmptyArrays: true } },
          { $replaceRoot: { newRoot: { $ifNull: ["$ancNewData", { _id: null, count: 0 }] } } }
        ],
        
        // Antenatal Follow-up from ancfollowup3s collection
        antenatalFollowUp: [
          {
            $lookup: {
              from: "ancfollowup3s",
              pipeline: [
                {
                  $match: {
                    createdAt: { $gte: startdate, $lt: enddate }
                  }
                },
                {
                  $lookup: {
                    from: "anc3s",
                    localField: "anc",
                    foreignField: "_id",
                    as: "ancInfo"
                  }
                },
                { $unwind: "$ancInfo" },
                {
                  $lookup: {
                    from: "patientsmanagements",
                    localField: "ancInfo.patient",
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
              as: "ancFollowUpData"
            }
          },
          { $unwind: { path: "$ancFollowUpData", preserveNullAndEmptyArrays: true } },
          { $replaceRoot: { newRoot: { $ifNull: ["$ancFollowUpData", { _id: null, count: 0 }] } } }
        ],
        
        // Family Planning New from familyplannings collection
        familyPlanningNew: [
          {
            $lookup: {
              from: "familyplannings",
              pipeline: [
                {
                  $match: {
                    createdAt: { $gte: startdate, $lt: enddate },
                    firsttimemodernfamilyplanninguser: "Yes"
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
              as: "familyPlanningNewData"
            }
          },
          { $unwind: { path: "$familyPlanningNewData", preserveNullAndEmptyArrays: true } },
          { $replaceRoot: { newRoot: { $ifNull: ["$familyPlanningNewData", { _id: null, count: 0 }] } } }
        ],
        
        // Family Planning Follow-up from familyplannings collection
        familyPlanningFollowUp: [
          {
            $lookup: {
              from: "familyplannings",
              pipeline: [
                {
                  $match: {
                    createdAt: { $gte: startdate, $lt: enddate },
                    firsttimemodernfamilyplanninguser: "No"
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
              as: "familyPlanningFollowUpData"
            }
          },
          { $unwind: { path: "$familyPlanningFollowUpData", preserveNullAndEmptyArrays: true } },
          { $replaceRoot: { newRoot: { $ifNull: ["$familyPlanningFollowUpData", { _id: null, count: 0 }] } } }
        ]
      }
    }
  ];

  return { specialConsultativePipeline };
};
