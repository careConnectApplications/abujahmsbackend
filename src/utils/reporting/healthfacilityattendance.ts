import configuration from "../../config";
export const heathfacilityattendancereports=(startdate:any,enddate:any)=>{
const heathfacilityoutpatientattendance = [
   {   
        
          $match:{$and:[{createdAt:{ $gt: startdate, $lt: enddate }}]}   
  
  },
  {
    // Group unique patient IDs from Appointment
    $group: {
      _id: "$patient"
    }
  },
  {
    // Lookup matching patients from Admission
    $lookup: {
      from: "admissions", // must match collection name
      localField: "_id",
      foreignField: "patient",
      as: "admissions"
    }
  }
  ,
  {
    // Keep only those with no related admission
    $match: {
      admissions: { $size: 0 }
    }
  },
   {
    // Join with patient details
    $lookup: {
      from: "patientsmanagements", // make sure this matches your actual collection name
      localField: "_id",
      foreignField: "_id",
      as: "patientDetails"
    }
  },
  {
    $unwind: "$patientDetails"
  },

  {
    // Convert DOB to Date if needed and calculate age
    $addFields: {
      dob: { $toDate: "$patientDetails.dateOfBirth" },
      gender: "$patientDetails.gender"
    }
  },
    {
    $addFields: {
      age: {
        $dateDiff: {
          startDate: "$dob",
          endDate: "$$NOW",
          unit: "day"
        }
      }
    }
  },
  {
    // Assign age group
    $addFields: {
      ageGroup: {
        $switch: {
          branches: [
            { case: { $lt: ["$age", 29] }, then: "0-28 days" },
            {
              case: {
                $and: [{ $gte: ["$age", 28] }, { $lte: ["$age", 331] }]
              },
              then: "29d-11mths"
            },
            {
              case: {
                $and: [{ $gt: ["$age", 330] }, { $lte: ["$age", 1771] }]
              },
              then: "12-59mths"
            },
            {
              case: {
                $and: [{ $gt: ["$age", 1770] }, { $lte: ["$age", 3241] }]
              },
              then: "5-9yrs"
            },
            {
              case: {
                $and: [{ $gt: ["$age", 3240] }, { $lte: ["$age", 6841] }]
              },
              then: "10-19yrs"
            },
            { case: { $gt: ["$age", 6840] }, then: ">=20yrs" }
          ],
          default: "Unknown"
        }
      }
    }
  },
  {
    // Group by gender and age group
    $group: {
      _id: { gender: "$gender", ageGroup: "$ageGroup" },
      count: { $sum: 1 }
    }
  },
  {
    // Reshape the output
    $project: {
      _id: 0,
      gender: "$_id.gender",
      ageGroup: "$_id.ageGroup",
      count: 1
    }
  },
  {
    $sort: { ageGroup: 1, gender: 1 }
  }
    

];


const heathfacilitygeneralattendance = [
   {   
        
          $match:{$and:[{createdAt:{ $gt: startdate, $lt: enddate }}]}   
  
  },
  {
    // Group unique patient IDs from Appointment
    $group: {
      _id: "$patient"
    }
  },
   {
    // Join with patient details
    $lookup: {
      from: "patientsmanagements", // make sure this matches your actual collection name
      localField: "_id",
      foreignField: "_id",
      as: "patientDetails"
    }
  },
  {
    $unwind: "$patientDetails"
  },

  {
    // Convert DOB to Date if needed and calculate age
    $addFields: {
      dob: { $toDate: "$patientDetails.dateOfBirth" },
      gender: "$patientDetails.gender"
    }
  },
    {
    $addFields: {
      age: {
        $dateDiff: {
          startDate: "$dob",
          endDate: "$$NOW",
          unit: "day"
        }
      }
    }
  },
  {
    // Assign age group
    $addFields: {
      ageGroup: {
        $switch: {
          branches: [
            { case: { $lt: ["$age", 29] }, then: "0-28 days" },
            {
              case: {
                $and: [{ $gte: ["$age", 28] }, { $lte: ["$age", 331] }]
              },
              then: "29d-11mths"
            },
            {
              case: {
                $and: [{ $gt: ["$age", 330] }, { $lte: ["$age", 1771] }]
              },
              then: "12-59mths"
            },
            {
              case: {
                $and: [{ $gt: ["$age", 1770] }, { $lte: ["$age", 3241] }]
              },
              then: "5-9yrs"
            },
            {
              case: {
                $and: [{ $gt: ["$age", 3240] }, { $lte: ["$age", 6841] }]
              },
              then: "10-19yrs"
            },
            { case: { $gt: ["$age", 6840] }, then: ">=20yrs" }
          ],
          default: "Unknown"
        }
      }
    }
  },
  {
    // Group by gender and age group
    $group: {
      _id: { gender: "$gender", ageGroup: "$ageGroup" },
      count: { $sum: 1 }
    }
  },
  {
    // Reshape the output
    $project: {
      _id: 0,
      gender: "$_id.gender",
      ageGroup: "$_id.ageGroup",
      count: 1
    }
  },
  {
    $sort: { ageGroup: 1, gender: 1 }
  }
    

];
return {heathfacilityoutpatientattendance,heathfacilitygeneralattendance}
}