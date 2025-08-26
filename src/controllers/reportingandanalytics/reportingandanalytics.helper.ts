// helper to merge counts by gender
export function mergeCounts(arr1:any, arr2:any) {
  const map = new Map();
  [...arr1, ...arr2].forEach(({ _id, count }) => {
    map.set(_id, (map.get(_id) || 0) + count);
  });
  return Array.from(map, ([gender, count]) => ({ _id: gender, count }));
}



export const formatRow = (rows: any[]) => {
  const male = rows.find((r) => r._id?.toLowerCase() === "male")?.count || 0;
  const female = rows.find((r) => r._id?.toLowerCase() === "female")?.count || 0;
  return { male, female, total: male + female };
};


// individual strategies (pure functions)
const equalityFilter = (match: any, key: string, value: any) => {
  match[key] = value;
};

const regexFilter = (match: any, key: string, value: any) => {
  match[key] = { $regex: new RegExp(value, "i") };
};

const dateRangeFilter = (match: any, key: string, value: any, field: string) => {
  if (!match[field]) match[field] = {};
  if (key === "startdate") match[field].$gte = new Date(value);
 if (key === "enddate") match[field].$lt = new Date(value);
};


const wardFilter = (match: any, key: string, value: any) => {
  match["referedward.wardname"] = value;
};

// ---------- Strategy Map ----------
const strategies: Record<string, (match: any, key: string, value: any) => void> = {
  // Admission filters
  wardname: (match, key, value) => (match["referedward.wardname"] = value),
  startdate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),
  enddate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),

  // Appointment filters
  appointmentStart: (match, key, value) => dateRangeFilter(match, key, value, "appointmentdate"),
  appointmentEnd: (match, key, value) => dateRangeFilter(match, key, value, "appointmentdate"),

  // Financial filters
  paymentcategory: (match, key, value) => (match[key] = value),
  financialStartDate: (match, key, value) => dateRangeFilter(match, key, value, "updatedAt"),
  financialEndDate: (match, key, value) => dateRangeFilter(match, key, value, "updatedAt"),

  // HMO filters
  HMOName: (match, key, value) => (match["patient.HMOName"] = value),
  hmoStartDate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),
  hmoEndDate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),

  // Secondary service filters
  patienttype: (match, key, value) => (match["patient.patienttype"] = value),
  secondaryServiceStartDate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),
  secondaryServiceEndDate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),

  // Pharmacy secondary service filters
  pharmacy: (match, key, value) => (match[key] = value),
};


export const buildFilters = (filters: Record<string, any> = {}) => {
  const match: any = {};

  Object.entries(filters).forEach(([key, value]) => {
    console.log("key", key, "value", value);
    if (!value) return;

    const strategy = strategies[key];
    console.log("strategy", strategy);
   
    if (strategy) {
      strategy(match, key, value);
    } else if (typeof value === "string") {
      regexFilter(match, key, value);
    } else {
      equalityFilter(match, key, value);
    }
  });

  return match;
};

export const reportbyappointmentreport = (filters: any) => {
 
  const matchConditions = buildFilters(filters);
 
  return [
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
      preserveNullAndEmptyArrays: true, // keeps documents even if no patient found
    },
  },
    { $match: matchConditions },
    {   
      $project:
      {
        appointmentid: 1,
        appointmenttype: 1,
        unit:1,
        clinic:1,
        category: 1,
        policecase:1,
        accidentType:1,
        arrivalMode:1,
        policaename:1,
        dateOfAccident:1,
        physicalassault:1,
        sexualassault:1,
        outcome:"$clinicalencounter.outcome",
        gender: "$patient.gender",
        age: "$patient.age",
        patientCreatedAt: "$patient.createdAt",
        firstName: "$patient.firstName",
        lastName: "$patient.lastName",
        MRN: "$patient.MRN",
        HMOId: "$patient.HMOId",
        HMOName: "$patient.HMONam",
        doctorsfirstName: 1,
        createdAt:1
      }}
  ];
};



export const reportbyadmissionreport = (filters: any) => {
  const matchConditions = buildFilters(filters);

  return [
    {
      $lookup: {
        from: "patientsmanagements",
        localField: "patient",
        foreignField: "_id",
        as: "patient",
      },
    },
    {
      $lookup: {
        from: "wardmanagements",
        localField: "referedward",
        foreignField: "_id",
        as: "referedward",
      },
    },
    { $unwind: { path: "$referedward", preserveNullAndEmptyArrays: true } },
    { $match: matchConditions },
  ];
};

export const reportbyfinancialreport = (filters: any) => {
  const matchConditions = buildFilters(filters);
  return [
    {
      $lookup: {
        from: "patientsmanagements",
        localField: "patient",
        foreignField: "_id",
        as: "patient",
      },
    },
    { $match: matchConditions },
  ];
};

export const reportbyhmoreport = (filters: any) => {
  const matchConditions = buildFilters(filters);
  return [
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
        preserveNullAndEmptyArrays: true,
      },
    },
    { $match: matchConditions },
  ];
};

export const appointmentreportbyhmoreport = (filters: any) => {
  const matchConditions = buildFilters(filters);
  return [
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
        preserveNullAndEmptyArrays: true,
      },
    },
    { $match: matchConditions },
  ];
};

export const secondaryservice = (filters: any) => {
  const matchConditions = buildFilters(filters);
  return [
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
        preserveNullAndEmptyArrays: true,
      },
    },
    { $match: matchConditions },
    {
      $addFields: {
        servicetype: {
          $ifNull: ["$testname", "$appointmenttype"],
        },
      },
    },
    {
      $project: {
        servicetype: 1,
        patient: 1,
      },
    },
  ];
};

export const proceduresecondaryservice = (filters: any) => {
  const matchConditions = buildFilters(filters);
  return [
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
        preserveNullAndEmptyArrays: true,
      },
    },
    { $match: matchConditions },
    {
      $addFields: {
        servicetype: {
          $reduce: {
            input: { $ifNull: ["$procedure", []] },
            initialValue: "",
            in: {
              $cond: {
                if: { $eq: ["$$value", ""] },
                then: "$$this",
                else: { $concat: ["$$value", ",", "$$this"] },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        servicetype: 1,
        patient: 1,
      },
    },
  ];
};

export const pharmacysecondaryservice = (filters: any) => {
  const matchConditions = buildFilters(filters);
  return [
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
        preserveNullAndEmptyArrays: true,
      },
    },
    { $match: matchConditions },
    {
      $addFields: {
        servicetype: "$prescription",
      },
    },
    {
      $project: {
        servicetype: 1,
        patient: 1,
      },
    },
  ];
};

