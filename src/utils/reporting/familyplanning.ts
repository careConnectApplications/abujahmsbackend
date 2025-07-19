import configuration from "../../config";
export const familyplanningreports=(startdate:any,enddate:any)=>{
const newfamilyplanningacceptorsByGender = [
    {   
        
          $match:{$and:[{createdAt:{ $gt: startdate, $lt: enddate }}]}   
  
  },
  {
    
    $match: {
      $or: [
        { oralnewacceptor: configuration.familyplanningyesnooption[0] },
        { injectableacceptor: configuration.familyplanningyesnooption[0] },
        { iudinnewacceptor: configuration.familyplanningyesnooption[0] },
        { implantsinnewacceptor: configuration.familyplanningyesnooption[0] },
        { iudoutnewacceptor: configuration.familyplanningyesnooption[0] },
        { barriernewacceptor: configuration.familyplanningyesnooption[0] },
        { naturalemthodsnewacceptorforcyclebeads: configuration.familyplanningyesnooption[0] },
        { naturalemthodsnewacceptorforothers: configuration.familyplanningyesnooption[0] }
      ]
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
    $group: {
      _id: {
        gender: "$patientInfo.gender",
        patient: "$patient"
      }
    }
  },
  {
    $group: {
      _id: "$_id.gender",
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      gender: "$_id",
      newAcceptorsCount: "$count"
    }
  }
];


const counselCountByGender = [
    {   
        
          $match:{$and:[{createdAt:{ $gt: startdate, $lt: enddate }}]}   
  
  },
  {
    $match: {
      counsellingonfamilyplanning: configuration.familyplanningyesnooption[0]
    }
  },
  {
    $lookup: {
      from: "patientsmanagements", // Adjust this to match your actual collection name
      localField: "patient",
      foreignField: "_id",
      as: "patientInfo"
    }
  },
  {
    $unwind: "$patientInfo"
  },
  {
    $group: {
      _id: "$patientInfo.gender", // Adjust to "sex" or appropriate field name if different
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      gender: "$_id",
      count: 1,
      _id: 0
    }
  }
];

const moderncontraceptionbyagegroup = [
      {   
        
          $match:{$and:[{createdAt:{ $gt: startdate, $lt: enddate }}]}   
  
  },
  {
    // 1. Filter for any modern method accepted
    $match: {
      $or: [
        { oralnewacceptor: configuration.familyplanningyesnooption[0] },
        { injectableacceptor: configuration.familyplanningyesnooption[0] },
        { iudinnewacceptor: configuration.familyplanningyesnooption[0] },
        { implantsinnewacceptor: configuration.familyplanningyesnooption[0] },
        { iudoutnewacceptor: configuration.familyplanningyesnooption[0] },
        { barriernewacceptor: configuration.familyplanningyesnooption[0] },
        { naturalemthodsnewacceptorforcyclebeads: configuration.familyplanningyesnooption[0] },
        { naturalemthodsnewacceptorforothers: configuration.familyplanningyesnooption[0] }
      ]
    }
  },
  {
    // 2. Lookup patient details
    $lookup: {
      from: "patientsmanagements",
      localField: "patient",
      foreignField: "_id",
      as: "patientInfo"
    }
  },
  { $unwind: "$patientInfo" },
  {
    // 3. Filter only females
    $match: {
      "patientInfo.gender": configuration.gender[1]
    }
  },
  {
    // 4. Safely convert dateOfBirth to date (or null)
    $addFields: {
      dob: {
        $cond: [
          {
            $and: [
              { $ne: ["$patientInfo.dateOfBirth", null] },
              { $ne: ["$patientInfo.dateOfBirth", ""] }
            ]
          },
          { $toDate: "$patientInfo.dateOfBirth" },
          null
        ]
      }
    }
  },
  {
    // 5. Compute age if dob is available
    $addFields: {
      age: {
        $cond: [
          { $ne: ["$dob", null] },
          {
            $dateDiff: {
              startDate: "$dob",
              endDate: "$$NOW",
              unit: "year"
            }
          },
          null
        ]
      }
    }
  },
  {
    // 6. Categorize into age groups or "Unknown"
    $addFields: {
      ageGroup: {
        $switch: {
          branches: [
            { case: { $and: [{ $gte: ["$age", 10] }, { $lte: ["$age", 14] }] }, then: "10-14" },
            { case: { $and: [{ $gte: ["$age", 15] }, { $lte: ["$age", 19] }] }, then: "15-19" },
            { case: { $and: [{ $gte: ["$age", 20] }, { $lte: ["$age", 24] }] }, then: "20-24" },
            { case: { $and: [{ $gte: ["$age", 25] }, { $lte: ["$age", 49] }] }, then: "25-49" },
            { case: { $gte: ["$age", 50] }, then: "50+" }
          ],
          default: "Unknown"
        }
      }
    }
  },
  {
    // 7. Group by patient (to ensure uniqueness) and track their age group
    $group: {
      _id: "$patient",
      ageGroup: { $first: "$ageGroup" }
    }
  },
  {
    // 8. Group by age group and count
    $group: {
      _id: "$ageGroup",
      count: { $sum: 1 }
    }
  },
  {
    // 9. Final format
    $project: {
      _id: 0,
      ageGroup: "$_id",
      count: 1
    }
  },
  {
    // 10. Sort (optional)
    $sort: { ageGroup: 1 }
  }
];

const clientsgivenoralpills = [
     {   
        
          $match:{$and:[{createdAt:{ $gt: startdate, $lt: enddate }}]}   
  
  },
  {
    $match: {
      $or: [
        { orapillsquantity: { $gt: 0 } },
        { oralpillsname: { $nin: [null, "", "null", "N/A"] } }
      ],
      patient: { $ne: null }
    }
  },
  {
    $group: {
      _id: "$patient"
    }
  },
  {
    $count: "uniqueOralPillsPatients"
  }
];

const totaloralpillcyclesdispensed = [
  {
    $match: {
      orapillsquantity: { $gt: 0 },
      createdAt: { $gt: startdate, $lt: enddate }
    }
  },
  {
    $group: {
      _id: null,
      totalCyclesDispensed: { $sum: "$orapillsquantity" }
    }
  },
  {
    $project: {
      _id: 0,
      totalCyclesDispensed: 1
    }
  }
];

const emergencyContraceptiveDispensed = [
     
  {
    // 1. Filter for only those given ECP
    $match: {
      emergencycontraception: configuration.familyplanningyesnooption[0],
       createdAt: { $gt: startdate, $lt: enddate }
      //createdAt: { $gte: startdate, $lte: enddate } // optional filter
    }
  },
  {
    // 2. Group by patient to ensure uniqueness
    $group: {
      _id: "$patient"
    }
  },
  {
    // 3. Count unique patients
    $count: "emergencyContraceptiveCount"
  }
];

const injectablesByName = [
  {
    $match: {
      nameofinjectable: { $nin: [null, ""] },
      injectablequantity: { $gt: 0 },
      createdAt: { $gt: startdate, $lt: enddate }
    }
  },
  {
    $group: {
      _id: "$nameofinjectable",
      totalQuantity: { $sum: "$injectablequantity" }
    }
  },
  {
    $project: {
      _id: 0,
      injectableName: "$_id",
      totalQuantity: 1
    }
  },
  {
    $sort: { injectableName: 1 }
  }
];
const implantsInsertedByType = [
  {
    $match: {
      $or: [
        { implantsinnewacceptor: configuration.familyplanningyesnooption[0] },
        { implantsinrevisit: configuration.familyplanningyesnooption[0] }
      ],
      typeofimplants: { $nin: [null, ""] },
      createdAt: { $gt: startdate, $lt: enddate }
    }
  },
  {
    $group: {
      _id: "$typeofimplants",      // Group by implant type
      totalInsertions: { $sum: 1 } // Count every matching document
    }
  },
  {
    $project: {
      implantType: "$_id",
      totalInsertions: 1,
      _id: 0
    }
  },
  {
    $sort: { implantType: 1 }
  }
];
const iudInserted = [
  {
    $match: {
      $or: [
        { iudinnewacceptor: configuration.familyplanningyesnooption[0] },
        { iudinrevisit: configuration.familyplanningyesnooption[0] }
      ],
      typeofiud: { $nin: [null, ""] },
       createdAt: { $gt: startdate, $lt: enddate }
    }
  },
  {
    $group: {
      _id: "$typeofiud",
      totalInsertions: { $sum: 1 }
    }
  },
  {
    $project: {
      iudType: "$_id",
      totalInsertions: 1,
      _id: 0
    }
  },
  {
    $sort: { iudType: 1 }
  }
];
const sterilizationByGender = [
  {
    $match: {
      voluntorysterilization: configuration.familyplanningyesnooption[0], // "Yes"
       createdAt: { $gt: startdate, $lt: enddate }
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
    $group: {
      _id: "$patientInfo.gender",
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      gender: "$_id",
      count: 1,
      _id: 0
    }
  }
];
const maleCondomsDistributed = [
  {
    $match: {
      typeofbarriermethods: configuration.typeofbarriermethods[6],
      barrierquantity: { $gt: 0 },
      createdAt: { $gt: startdate, $lt: enddate }
    }
  },
  {
    $group: {
      _id: null,
      totalMaleCondoms: { $sum: "$barrierquantity" }
    }
  },
  {
    $project: {
      _id: 0,
      totalMaleCondoms: 1
    }
  }
];
const femaleCondomsDistributed = [
  {
    $match: {
      typeofbarriermethods: configuration.typeofbarriermethods[7],
      barrierquantity: { $gt: 0 },
      createdAt: { $gt: startdate, $lt: enddate }
    }
  },
  {
    $group: {
      _id: null,
      totalFemaleCondoms: { $sum: "$barrierquantity" }
    }
  },
  {
    $project: {
      _id: 0,
      totalFemaleCondoms: 1
    }
  }
];
const postpartumCounsellingCount = [
  {
    $match: {
      counsellingonpostpartumfamilyplanning: configuration.familyplanningyesnooption[0],
      createdAt: { $gt: startdate, $lt: enddate }
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
    $match: {
      "patientInfo.gender": configuration.gender[1]
    }
  },
  {
    $count: "womenCounselledOnPPFP"
  }
];
const postPartumImplanonInsertions = [
  {
    $match: {
      implantsinnewacceptor: configuration.familyplanningyesnooption[0],
      typeofimplants: configuration.typeofimplants[0],
       createdAt: { $gt: startdate, $lt: enddate }
    }
  },
  {
    $count: "postPartumImplanonInserted"
  }
];

const postPartumJadelleInsertions = [
  {
    $match: {
      implantsinnewacceptor: configuration.familyplanningyesnooption[0],
      typeofimplants: configuration.typeofimplants[1],
      createdAt: { $gt: startdate, $lt: enddate }
    }
  },
  {
    $count: "postPartumJadelleInserted"
  }
];


const postPartumIUDInsertions = [
  {
    $match: {
      iudinnewacceptor: configuration.familyplanningyesnooption[0],
     typeofiud: { $nin: [null, ""] },
      createdAt: { $gt: startdate, $lt: enddate }
    }
  },
  {
    $count: "postPartumIUDInserted"
  }
];
return {newfamilyplanningacceptorsByGender,counselCountByGender,moderncontraceptionbyagegroup,clientsgivenoralpills,totaloralpillcyclesdispensed,emergencyContraceptiveDispensed,injectablesByName,implantsInsertedByType,iudInserted,sterilizationByGender,maleCondomsDistributed,femaleCondomsDistributed,postpartumCounsellingCount,postPartumImplanonInsertions,postPartumJadelleInsertions,postPartumIUDInsertions}

}


