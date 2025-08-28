import configuration from "../../config";

export const specialconsultativereports = (startdate: any, enddate: any) => {
  // Special Consultative pipeline - Section I from the document
  const specialConsultativePipeline = [
    {
      $match: {
        appointmentdate: { $gte: startdate, $lt: enddate }
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
        clinic: 1,
        appointmenttype: 1,
        category: 1,
        gender: "$patientInfo.gender"
      }
    },
    {
      $facet: {
        // 1. Obstetrics & Gynecology Unit
        obstetricsGynecologyAttendance: [
          { $match: { clinic: "Obstetrics & Gynecology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        antenatalRegistrationNew: [
          { $match: { clinic: "Ante-Natal", appointmenttype: "New" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        antenatalFollowUp: [
          { $match: { clinic: "Ante-Natal", appointmenttype: "Follow-up" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        postNatalAttendance: [
          { $match: { clinic: "Post-Natal" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        
        // 2. Internal Medicine (MOPD)
        cardiology: [
          { $match: { clinic: "Cardiology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        gastroenterology: [
          { $match: { clinic: "Gastroenterology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        neurology: [
          { $match: { clinic: "Neurology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        nephrology: [
          { $match: { clinic: "Nephrology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        endocrinology: [
          { $match: { clinic: "Endocrinology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        comprehensiveClinicNew: [
          { $match: { clinic: "Comprehensive Clinic", appointmenttype: "New" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        comprehensiveClinicOld: [
          { $match: { clinic: "Comprehensive Clinic", appointmenttype: "Follow-up" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        dermatologyClinic: [
          { $match: { clinic: "Dermatology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        haematology: [
          { $match: { clinic: "Haematology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        dialysis: [
          { $match: { clinic: "Dialysis" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        
        // 3. Surgical Outpatient Clinic (SOPD)
        pediatricSurgeryClinic: [
          { $match: { clinic: "Pediatric Surgery" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        neuroSurgeryClinic: [
          { $match: { clinic: "Neuro Surgery" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        urologyClinic: [
          { $match: { clinic: "Urology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        orthopedicClinic: [
          { $match: { clinic: "Orthopedic" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        generalSurgeryClinic: [
          { $match: { clinic: "General Surgery" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        plasticSurgeryClinic: [
          { $match: { clinic: "Plastic Surgery" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        
        // 4. Dental Unit
        dentalSurgery: [
          { $match: { clinic: "Dental Surgery" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        dentalClinic: [
          { $match: { clinic: "Dental Clinic" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        maxillofacialSurgery: [
          { $match: { clinic: "Maxillofacial Surgery" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        
        // 5. ENT Unit
        entClinic: [
          { $match: { clinic: "ENT Clinic" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        entSurgery: [
          { $match: { clinic: "ENT Surgery" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        
        // 6. Ophthalmology Unit
        ophthalmologyClinic: [
          { $match: { clinic: "Ophthalmology" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        ophthalmologicSurgery: [
          { $match: { clinic: "Ophthalmologic Surgery" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        optometricUnit: [
          { $match: { clinic: "Optometry" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        
        // 7. Behavioural/Mental Unit
        behaviorMentalUnitAdult: [
          { $match: { clinic: "Mental Health", category: "Adult" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        behaviorMentalUnitPaed: [
          { $match: { clinic: "Mental Health", category: "Paediatrics" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        psychologyCounselling: [
          { $match: { clinic: "Psychology Counselling" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        
        // 8. Other Clinics
        dotClinicNew: [
          { $match: { clinic: "DOT Clinic", appointmenttype: "New" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        dotClinicOld: [
          { $match: { clinic: "DOT Clinic", appointmenttype: "Follow-up" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        physiotherapyUnit: [
          { $match: { clinic: "Physiotherapy" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        nutritionClinic: [
          { $match: { clinic: "Nutrition" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        paediatricClinic: [
          { $match: { clinic: "Paediatric Clinic" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        familyPlanningNew: [
          { $match: { clinic: "Family Planning", appointmenttype: "New" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ],
        familyPlanningFollowUp: [
          { $match: { clinic: "Family Planning", appointmenttype: "Follow-up" } },
          { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]
      }
    }
  ];

  return { specialConsultativePipeline };
};
