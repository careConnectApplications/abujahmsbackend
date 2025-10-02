export const eyeConditionReports = (startdate: Date, enddate: Date) => {
  // Eye Condition Report Pipeline
  const eyeConditionPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "eyeConsultation": { $ne: null }
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
          $ifNull: ["$eyeConsultation.diagnosis", ""]
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
      $addFields: {
        conditions: {
          $cond: {
            if: { $eq: ["$diagnosis", ""] },
            then: [],
            else: {
              $map: {
                input: {
                  $filter: {
                    input: [
                      {
                        $cond: [
                          { $regexMatch: { input: "$diagnosis", regex: /presbyopia/i } },
                          "Presbyopia",
                          null
                        ]
                      },
                      {
                        $cond: [
                          { $regexMatch: { input: "$diagnosis", regex: /myopia/i } },
                          "Myopia",
                          null
                        ]
                      },
                      {
                        $cond: [
                          { $regexMatch: { input: "$diagnosis", regex: /hypermetropia/i } },
                          "Hypermetropia",
                          null
                        ]
                      },
                      {
                        $cond: [
                          { $regexMatch: { input: "$diagnosis", regex: /astigmatism/i } },
                          "Astigmatism",
                          null
                        ]
                      },
                      {
                        $cond: [
                          { $and: [
                            { $regexMatch: { input: "$diagnosis", regex: /cataract/i } },
                            { $not: { $regexMatch: { input: "$diagnosis", regex: /surgery/i } } }
                          ] },
                          "Cataract",
                          null
                        ]
                      },
                      {
                        $cond: [
                          { $and: [
                            { $regexMatch: { input: "$diagnosis", regex: /cataract/i } },
                            { $regexMatch: { input: "$diagnosis", regex: /surgery/i } }
                          ] },
                          "Cataract Surgery",
                          null
                        ]
                      },
                      {
                        $cond: [
                          { $and: [
                            { $regexMatch: { input: "$diagnosis", regex: /glaucoma/i } },
                            { $not: { $regexMatch: { input: "$diagnosis", regex: /surgery/i } } }
                          ] },
                          "Glaucoma",
                          null
                        ]
                      },
                      {
                        $cond: [
                          { $and: [
                            { $regexMatch: { input: "$diagnosis", regex: /glaucoma/i } },
                            { $regexMatch: { input: "$diagnosis", regex: /surgery/i } }
                          ] },
                          "Glaucoma Surgery",
                          null
                        ]
                      },
                      {
                        $cond: [
                          { $and: [
                            { $regexMatch: { input: "$diagnosis", regex: /trachoma/i } },
                            { $not: { $regexMatch: { input: "$diagnosis", regex: /surgery/i } } }
                          ] },
                          "Trachoma",
                          null
                        ]
                      },
                      {
                        $cond: [
                          { $and: [
                            { $regexMatch: { input: "$diagnosis", regex: /trachoma/i } },
                            { $regexMatch: { input: "$diagnosis", regex: /surgery/i } }
                          ] },
                          "Trachoma Surgery",
                          null
                        ]
                      },
                      {
                        $cond: [
                          { $and: [
                            { $regexMatch: { input: "$diagnosis", regex: /pterygium/i } },
                            { $not: { $regexMatch: { input: "$diagnosis", regex: /surgery/i } } }
                          ] },
                          "Pterygium",
                          null
                        ]
                      },
                      {
                        $cond: [
                          { $and: [
                            { $regexMatch: { input: "$diagnosis", regex: /pterygium/i } },
                            { $regexMatch: { input: "$diagnosis", regex: /surgery/i } }
                          ] },
                          "Pterygium Surgery",
                          null
                        ]
                      }
                    ],
                    cond: { $ne: ["$$this", null] }
                  }
                },
                as: "condition",
                in: "$$condition"
              }
            }
          }
        }
      }
    },
    {
      $addFields: {
        conditions: {
          $cond: {
            if: { $eq: [{ $size: "$conditions" }, 0] },
            then: {
              $cond: {
                if: { $ne: ["$diagnosis", ""] },
                then: ["Other"],
                else: []
              }
            },
            else: "$conditions"
          }
        }
      }
    },
    {
      $unwind: {
        path: "$conditions",
        preserveNullAndEmptyArrays: false
      }
    },
    {
      $group: {
        _id: {
          condition: "$conditions",
          gender: "$patientGender",
          ageGroup: "$ageGroup"
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        condition: "$_id.condition",
        gender: "$_id.gender",
        ageGroup: "$_id.ageGroup",
        count: 1,
        _id: 0
      }
    }
  ];

  return { eyeConditionPipeline };
};
