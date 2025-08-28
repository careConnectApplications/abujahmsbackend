export const facilityAttendanceAggregates = (startdate: any, enddate: any) => {
  // Section L - Total Facility Attendance
  const totalFacilityAttendance = [
    {
      $match: {
        $and: [
          { createdAt: { $gt: startdate, $lt: enddate } }
        ]
      }
    },
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
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $facet: {
        totalPatients: [
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        newPatients: [
          { $match: { visitType: { $in: ["New", "First Visit", "Initial"] } } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        revisitPatients: [
          { $match: { visitType: { $in: ["Revisit", "Follow-up", "Return"] } } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        referredIn: [
          { $match: { 
            $or: [
              { referralType: "Referred In" },
              { referralSource: { $exists: true, $ne: null } }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        referredOut: [
          { $match: { 
            $or: [
              { referralType: "Referred Out" },
              { referredTo: { $exists: true, $ne: null } }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        emergencyVisits: [
          { $match: { 
            $or: [
              { visitType: { $regex: /emergency/i } },
              { department: { $regex: /emergency|a&e|accident/i } }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        outpatientVisits: [
          { $match: { 
            $or: [
              { visitType: { $regex: /outpatient|opd/i } },
              { department: { $regex: /outpatient|opd/i } },
              { serviceType: "Outpatient" }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        inpatientAdmissions: [
          { $match: { 
            $or: [
              { visitType: { $regex: /admission|inpatient/i } },
              { admissionStatus: { $exists: true } },
              { serviceType: "Inpatient" }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        dayCase: [
          { $match: { 
            $or: [
              { visitType: { $regex: /day case|day surgery/i } },
              { serviceType: "Day Case" }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        pediatricAttendance: [
          { $match: { 
            $or: [
              { department: { $regex: /pediatric|paediatric|children/i } },
              { "patient.age": { $lt: 18 } }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        adultAttendance: [
          { $match: { 
            $or: [
              { department: { $regex: /adult|general/i } },
              { "patient.age": { $gte: 18 } }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        nhisPatients: [
          { $match: { 
            $or: [
              { paymentMethod: { $regex: /nhis|insurance/i } },
              { "patient.isHMOCover": true }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        privatePatients: [
          { $match: { 
            $and: [
              { paymentMethod: { $regex: /cash|private|self/i } },
              { "patient.isHMOCover": { $ne: true } }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ]
      }
    }
  ];

  // Monthly attendance trends
  const monthlyAttendanceTrends = [
    {
      $match: {
        $and: [
          { createdAt: { $gt: startdate, $lt: enddate } }
        ]
      }
    },
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
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          gender: "$patient.gender"
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: {
          month: "$_id.month",
          year: "$_id.year"
        },
        Male: { 
          $sum: {
            $cond: [{ $eq: ["$_id.gender", "Male"] }, "$count", 0]
          }
        },
        Female: { 
          $sum: {
            $cond: [{ $eq: ["$_id.gender", "Female"] }, "$count", 0]
          }
        },
        Total: { $sum: "$count" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    },
    {
      $project: {
        _id: 0,
        Period: {
          $concat: [
            { $toString: "$_id.month" },
            "/",
            { $toString: "$_id.year" }
          ]
        },
        Male: 1,
        Female: 1,
        Total: 1
      }
    }
  ];

  // Department-wise attendance
  const departmentAttendance = [
    {
      $match: {
        $and: [
          { createdAt: { $gt: startdate, $lt: enddate } }
        ]
      }
    },
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
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          department: { $ifNull: ["$department", "General"] },
          gender: "$patient.gender"
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.department",
        Male: { 
          $sum: {
            $cond: [{ $eq: ["$_id.gender", "Male"] }, "$count", 0]
          }
        },
        Female: { 
          $sum: {
            $cond: [{ $eq: ["$_id.gender", "Female"] }, "$count", 0]
          }
        },
        Total: { $sum: "$count" }
      }
    },
    {
      $sort: { Total: -1 }
    },
    {
      $project: {
        _id: 0,
        Department: "$_id",
        Male: 1,
        Female: 1,
        Total: 1
      }
    }
  ];

  return { 
    totalFacilityAttendance, 
    monthlyAttendanceTrends,
    departmentAttendance 
  };
};
