import configuration from "../../config";

export const radiodiagnosisreports = (startdate: any, enddate: any) => {
  // Radio Diagnosis pipeline - Section G from the document
  const radioDiagnosisPipeline = [
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
        radiologytest: 1,
        patienttype: 1,
        referral: 1,
        gender: "$patientInfo.gender"
      }
    },
    {
      $facet: {
        // Plain X-Ray section
        plainXrayInpatients: [
          { $match: { radiologytest: "X-Ray", patienttype: "Inpatient" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        plainXrayOutpatients: [
          { $match: { radiologytest: "X-Ray", patienttype: "Outpatient" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        plainXrayReferral: [
          { $match: { radiologytest: "X-Ray", referral: true } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        
        // Ultrasound section
        ultrasoundInpatients: [
          { $match: { radiologytest: "Ultrasound", patienttype: "Inpatient" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        ultrasoundOutpatients: [
          { $match: { radiologytest: "Ultrasound", patienttype: "Outpatient" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        ultrasoundReferral: [
          { $match: { radiologytest: "Ultrasound", referral: true } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        
        // Other scans
        ctScan: [
          { $match: { radiologytest: "CT Scan" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        mammogram: [
          { $match: { radiologytest: "Mammogram" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        mri: [
          { $match: { radiologytest: "MRI" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        
        // Contrast procedures
        hsg: [
          { $match: { radiologytest: "HSG" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        ivu: [
          { $match: { radiologytest: "IVU" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        mcug: [
          { $match: { radiologytest: "MCUG" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        rug: [
          { $match: { radiologytest: "RUG" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        
        // Other readings
        ecg: [
          { $match: { radiologytest: "ECG" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        echo: [
          { $match: { radiologytest: "Echo" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]
      }
    }
  ];

  return { radioDiagnosisPipeline };
};
