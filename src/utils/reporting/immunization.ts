export const immunizationaggregatereports=(startdate:any,enddate:any)=>{
const immunizationpipeline = [
  {   
    $match: { createdAt: { $gt: startdate, $lt: enddate } }
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

  // Safely handle DOB
  {
    $addFields: {
      dob: {
        $cond: {
          if: {
            $and: [
              { $ne: ["$patientInfo.dateOfBirth", null] },
              { $ne: ["$patientInfo.dateOfBirth", ""] }
            ]
          },
          then: { $toDate: "$patientInfo.dateOfBirth" },
          else: null
        }
      }
    }
  },

  // Conditionally calculate ageInYears
  {
    $addFields: {
      ageInYears: {
        $cond: {
          if: { $ne: ["$dob", null] },
          then: {
            $dateDiff: {
              startDate: "$dob",
              endDate: "$$NOW",
              unit: "year"
            }
          },
          else: null
        }
      }
    }
  },

  // Define ageGroup including unknowns
  {
    $addFields: {
      ageGroup: {
        $switch: {
          branches: [
            { case: { $lt: ["$ageInYears", 1] }, then: "<1 year" },
            { case: { $gte: ["$ageInYears", 1] }, then: ">=1 year" }
          ],
          default: "Unknown"
        }
      }
    }
  },

  { $unwind: "$vaccination" },

  {
    $group: {
      _id: {
        vaccine: "$vaccination",
        location: "$vaccinationlocation",
        ageGroup: "$ageGroup"
      },
      uniquePatients: { $addToSet: "$patient" }
    }
  },
  {
    $project: {
      _id: 0,
      vaccine: "$_id.vaccine",
      location: "$_id.location",
      ageGroup: "$_id.ageGroup",
      patientCount: { $size: "$uniquePatients" }
    }
  },
  {
    $sort: {
      vaccine: 1,
      location: 1,
      ageGroup: 1
    }
  }
];

const AEFIcasesreported = [
  {
    $match: {
      adverseeffectseverity: { $exists: true, $ne: null }
    }
  },
  {
    $group: {
      _id: "$adverseeffectseverity", // Groups by severity type
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      severity: "$_id",
      count: 1,
      _id: 0
    }
  }
];

// New pipeline for immunization grouped by gender and vaccination
const immunizationByGenderAndVaccination = [
  {   
    $match: { createdAt: { $gt: startdate, $lt: enddate } }
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
  
  // Unwind vaccination array to process each vaccination
  { $unwind: "$vaccination" },
  
  // Group by vaccination and gender
  {
    $group: {
      _id: {
        vaccination: "$vaccination",
        gender: "$patientInfo.gender"
      },
      count: { $sum: 1 }
    }
  },
  
  // Reshape to have vaccination as the key and gender counts
  {
    $project: {
      _id: 0,
      vaccination: "$_id.vaccination",
      gender: "$_id.gender",
      count: 1
    }
  },
  
  // Sort by vaccination name and gender
  {
    $sort: {
      vaccination: 1,
      gender: 1
    }
  }
];

   return {immunizationpipeline,AEFIcasesreported,immunizationByGenderAndVaccination}
}
