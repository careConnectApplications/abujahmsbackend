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
  startDate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),
  endDate: (match, key, value) => dateRangeFilter(match, key, value, "createdAt"),

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
      $unwind: {
        path: "$patient",
        preserveNullAndEmptyArrays: true, // keeps documents even if no patient found
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
    {
      $project: {
        // Admission specific fields
        admissionid: 1,
        status: 1,
        referredIn: 1,
        referredFrom: 1,
        admittospecialization: 1,
        referddate: 1,
        dischargeReason: 1,
        bedfee: 1,
      
        
        // Ward information
        wardname: "$referedward.wardname",
        wardtype: "$referedward.wardtype",
        
        // Staff information
        doctorname: 1,
        staffname: 1,
        
        // Patient demographic information
        gender: "$patient.gender",
        age: "$patient.age",
        patientCreatedAt: "$patient.createdAt",
        firstName: "$patient.firstName",
        lastName: "$patient.lastName",
        middleName: "$patient.middleName",
        MRN: "$patient.MRN",
        
        // Patient HMO information
        HMOId: "$patient.HMOId",
        HMOName: "$patient.HMOName",
        patienttype: "$patient.patienttype",
        
        // Timestamps
        createdAt: 1,
        updatedAt: 1
      }
    }
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
    {
      $unwind: {
        path: "$patient",
        preserveNullAndEmptyArrays: true, // keeps documents even if no patient found
      },
    },
    { $match: matchConditions },
    {
      $project: {
        // Payment specific fields
        paymentype: 1,
        paymentcategory: 1,
        paymentreference: 1,
        amount: 1,
        qty: 1,
        status: 1,
        numberoftimesprinted: 1,
        confirmationdate: 1,
        
        // Cashier information
        cashieremail: 1,
        cashiername: 1,
        cashierid: 1,
        
        // Patient information (from payment document)
        firstName: 1,
        lastName: 1,
        MRN: 1,
        HMOId: 1,
        phoneNumber: 1,
        
        // Patient demographics (from patient lookup)
        patientGender: "$patient.gender",
        patientAge: "$patient.age",
        patientCreatedAt: "$patient.createdAt",
        patientFirstName: "$patient.firstName",
        patientLastName: "$patient.lastName",
        patientMRN: "$patient.MRN",
        
        // Patient HMO information
        patientHMOId: "$patient.HMOId",
        patientHMOName: "$patient.HMOName",
        patienttype: "$patient.patienttype",
        
        // Timestamps
        createdAt: 1,
        updatedAt: 1
      }
    }
  ];
};

export const reportlab = (filters: any) => {
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
      $project: {
        // Lab specific fields
        testname: 1,
        testid: 1,
        department: 1,
        labcategory: 1,
        appointmentid: 1,
        processeddate: 1,
        
    
        
        // Lab processing details
        priority: 1,
        sortby: 1,
        sortbydate: 1,
        remark: 1,
        note: 1,
        
        // Financial information
        amount: 1,
        hmopercentagecover: 1,
        actualcost: 1,
        
        // Status fields
        status: 1,
        chemicalpathologyhemathologyreviewtstatus: 1,
        
        // Staff information
        raiseby: 1,
        staffname: 1,
        
        // File attachment
        filename: 1,
        
        // Patient demographic information
        gender: "$patient.gender",
        age: "$patient.age",
        patientCreatedAt: "$patient.createdAt",
        firstName: "$patient.firstName",
        lastName: "$patient.lastName",
        middleName: "$patient.middleName",
        MRN: "$patient.MRN",
        
        // Patient HMO information
        HMOId: "$patient.HMOId",
        HMOName: "$patient.HMOName",
        patienttype: "$patient.patienttype",
        
        // Contact information
        phoneNumber: "$patient.phoneNumber",
        email: "$patient.email",
        
        // Timestamps
        createdAt: 1,
        updatedAt: 1
      }
    }
  ];
};
export const reportprocedure = (filters: any) => {
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
        // Concatenate procedure array values into a single string
        procedure: {
          $cond: {
            if: { $isArray: "$procedure" },
            then: {
              $reduce: {
                input: { $ifNull: ["$procedure", []] },
                initialValue: "",
                in: {
                  $cond: {
                    if: { $eq: ["$$value", ""] },
                    then: "$$this",
                    else: { $concat: ["$$value", ", ", "$$this"] }
                  }
                }
              }
            },
            else: "$procedure"
          }
        }
      }
    },
    {
      $project: {
        // Procedure specific fields
        procedureid: 1,
        procedure: 1,
        procedureoutcome: 1,
        indicationdiagnosisprocedure: 1,
        appointmentdate: 1,
        clinic: 1,
       
        
        // Financial information
        amount: 1,
        hmopercentagecover: 1,
        actualcost: 1,
        
        // Status
        status: 1,
        
        // Staff information
        raiseby: 1,
        processby: 1,
        
        // Patient demographic information
        gender: "$patient.gender",
        age: "$patient.age",
        patientCreatedAt: "$patient.createdAt",
        firstName: "$patient.firstName",
        lastName: "$patient.lastName",
        middleName: "$patient.middleName",
        MRN: "$patient.MRN",
        
        // Patient HMO information
        HMOId: "$patient.HMOId",
        HMOName: "$patient.HMOName",
        patienttype: "$patient.patienttype",
        
        // Contact information
        phoneNumber: "$patient.phoneNumber",
        email: "$patient.email",
        
        // Timestamps
        createdAt: 1,
        updatedAt: 1
      }
    }
  ];
};
export const reportpharmacy = (filters: any) => {
  const matchConditions = buildFilters(filters);
  console.log("matchConditions", matchConditions);
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
      $project: {
        // Prescription specific fields
        prescription: 1,
        pharmacy: 1,
        prescriptionnote: 1,
        orderid: 1,
        appointmentid: 1,
        appointmentdate: 1,
        clinic: 1,
        
        // Dosage information
        dosageform: 1,
        strength: 1,
        dosage: 1,
        duration: 1,
        frequency: 1,
        route: 1,
        qty: 1,
        balance: 1,
        
        // Financial information
        amount: 1,
        hmopercentagecover: 1,
        actualcost: 1,
        
        // Status fields
        dispensestatus: 1,
        servedstatus: 1,
        
        // Staff information
        prescribersname: 1,
        pharmacistname: 1,
        
        // Remarks
        remark: 1,
        
        // Patient information (from prescription document)
        firstName: 1,
        lastName: 1,
        MRN: 1,
        HMOId: 1,
        HMOName: 1,
        HMOPlan: 1,
        isHMOCover: 1,
        
        // Patient demographics (from patient lookup)
        patientGender: "$patient.gender",
        patientAge: "$patient.age",
        patientCreatedAt: "$patient.createdAt",
        patientFirstName: "$patient.firstName",
        patientLastName: "$patient.lastName",
        patientMiddleName: "$patient.middleName",
        patientMRN: "$patient.MRN",
        
        // Patient HMO information from lookup
        patientHMOId: "$patient.HMOId",
        patientHMOName: "$patient.HMOName",
        patienttype: "$patient.patienttype",
        
        // Contact information
        phoneNumber: "$patient.phoneNumber",
        email: "$patient.email",
        
        // Timestamps
        createdAt: 1,
        updatedAt: 1
      }
    }
  ];
};

export const reportradiology = (filters: any) => {
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
      $project: {
        // Radiology specific fields
        testname: 1,
        testid: 1,
        department: 1,
        testresult: 1,
        typetestresult: 1,
        processeddate: 1,
        
        // Processing details
        note: 1,
        remark: 1,
        
        // Financial information
        amount: 1,
        hmopercentagecover: 1,
        actualcost: 1,
        
        // Status field
        status: 1,
        
        // Staff information
        raiseby: 1,
        processby: 1,
        
        // File attachment
        filename: 1,
        
        // Patient demographic information
        gender: "$patient.gender",
        age: "$patient.age",
        patientCreatedAt: "$patient.createdAt",
        firstName: "$patient.firstName",
        lastName: "$patient.lastName",
        middleName: "$patient.middleName",
        MRN: "$patient.MRN",
        
        // Patient HMO information
        HMOId: "$patient.HMOId",
        HMOName: "$patient.HMOName",
        patienttype: "$patient.patienttype",
        
        // Contact information
        phoneNumber: "$patient.phoneNumber",
        email: "$patient.email",
        
        // Timestamps
        createdAt: 1,
        updatedAt: 1
      }
    }
  ];
};
