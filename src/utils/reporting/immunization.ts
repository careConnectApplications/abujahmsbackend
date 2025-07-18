export const immunizationaggregatereports=(startdate:any,enddate:any)=>{
const immunizationpipeline = [
     {   
      
        $match:{createdAt:{ $gt: startdate, $lt: enddate } }

    },
  // 1. Join Patientsmanagement
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

  // 2. Calculate age in YEARS
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
  {
    $match: {
      dob: { $ne: null }
    }
  },
  {
    $addFields: {
      ageInYears: {
        $dateDiff: {
          startDate: "$dob",
          endDate: "$$NOW",
          unit: "year"
        }
      }
    }
  },

  // 3. Create two age groups: <1 year, >=1 year
  {
    $addFields: {
      ageGroup: {
        $cond: [
          { $lt: ["$ageInYears", 1] },
          "<1 year",
          ">=1 year"
        ]
      }
    }
  },

  // 4. Unwind vaccination array
  {
    $unwind: "$vaccination"
  },

  // 5. Group by vaccine, location, and age group

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

  // 6. Project the result
  {
    $project: {
      _id: 0,
      vaccine: "$_id.vaccine",
      location: "$_id.location",
      ageGroup: "$_id.ageGroup",
      patientCount: { $size: "$uniquePatients" }
    }
  },
  

  // 7. Sort (optional)
  {
    $sort: {
      vaccine: 1,
      location: 1,
      ageGroup: 1
    }
  }
];
   return {immunizationpipeline}
}