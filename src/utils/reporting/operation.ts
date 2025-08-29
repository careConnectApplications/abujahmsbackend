import configuration from "../../config";

export const operationreports = (startdate: any, enddate: any) => {
  // Operation pipeline - Section H from the document
  const operationPipeline = [
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
        proceduretype: 1,
        procedurename: 1,
        gender: "$patientInfo.gender"
      }
    },
    {
      $facet: {
        majorOperation: [
          { $match: { proceduretype: "Major Operation" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        intermediateOperation: [
          { $match: { proceduretype: "Intermediate Operation" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        minorOperation: [
          { $match: { proceduretype: "Minor Operation" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        circumcision: [
          { $match: { procedurename: "Circumcision" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]
      }
    }
  ];

  return { operationPipeline };
};
