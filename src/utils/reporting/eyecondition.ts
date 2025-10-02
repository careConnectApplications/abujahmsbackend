export const eyeConditionReports = (startdate: Date, enddate: Date) => {
  // Eye Condition Report Pipeline - Simplified version that groups by actual diagnosis
  const eyeConditionPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "eyeConsultation": { $ne: null },
        "eyeConsultation.diagnosis": { 
          $exists: true, 
          $nin: [null, "", undefined]
        }
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
    {
      $unwind: "$patientInfo"
    },
    {
      $addFields: {
        diagnosis: {
          $trim: {
            input: { $ifNull: ["$eyeConsultation.diagnosis", "Unknown"] }
          }
        },
        patientAge: {
          $divide: [
            {
              $subtract: [
                new Date(),
                "$patientInfo.dateofbirth"
              ]
            },
            365.25 * 24 * 60 * 60 * 1000
          ]
        },
        patientGender: {
          $toLower: "$patientInfo.sex"
        }
      }
    },
    {
      $addFields: {
        ageGroup: {
          $switch: {
            branches: [
              { case: { $lt: ["$patientAge", 15] }, then: "0-14" },
              { case: { $and: [{ $gte: ["$patientAge", 15] }, { $lt: ["$patientAge", 30] }] }, then: "15-29" },
              { case: { $and: [{ $gte: ["$patientAge", 30] }, { $lt: ["$patientAge", 45] }] }, then: "30-44" },
              { case: { $gte: ["$patientAge", 45] }, then: "45+" }
            ],
            default: "Unknown"
          }
        }
      }
    },
    {
      $group: {
        _id: {
          diagnosis: "$diagnosis",
          gender: "$patientGender",
          ageGroup: "$ageGroup"
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        condition: "$_id.diagnosis",
        gender: "$_id.gender",
        ageGroup: "$_id.ageGroup",
        count: 1,
        _id: 0
      }
    },
    {
      $sort: {
        condition: 1,
        gender: 1,
        ageGroup: 1
      }
    }
  ];

  return { eyeConditionPipeline };
};
