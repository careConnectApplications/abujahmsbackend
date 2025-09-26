export const maternityreports = (startdate: any, enddate: any) => {
  // BABIES DATA pipelines - Using ThirdStageLabour collection
  const liveBirthPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "newBorn.newBornStatus": "Live Birth"
      }
    },
    
    
    {
      $lookup: {
        from: "birthregisters",
        localField: "patient",
        foreignField: "patient",
        as: "birthRegister"
      }
    },
    {
      $unwind: {
        path: "$birthRegister",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$birthRegister.sex",
        count: { $sum: 1 }
      }
    }
      
  ];

  const freshStillBirthPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        $or: [
          { "newBorn.newBornStatus": "Fresh Still Birth" },
          { "babiesData.freshStillBirth": true }
        ]
      }
    },
    {
      $lookup: {
        from: "birthregisters",
        localField: "patient",
        foreignField: "patient",
        as: "birthRegister"
      }
    },
    {
      $unwind: {
        path: "$birthRegister",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$birthRegister.sex",
        count: { $sum: 1 }
      }
    }
  ];

  const maceratedStillBirthPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        $or: [
          { "newBorn.newBornStatus": "Macerated Still Birth" },
          { "babiesData.maceratedStillBirth": true }
        ]
      }
    },
    {
      $lookup: {
        from: "birthregisters",
        localField: "patient",
        foreignField: "patient",
        as: "birthRegister"
      }
    },
    {
      $unwind: {
        path: "$birthRegister",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$birthRegister.sex",
        count: { $sum: 1 }
      }
    }
  ];

  const asphyxiaPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        $or: [
          { "babiesData.asphyxia": true },
          { "newBorn.apgarScore5Min": { $lt: 7 } } // Low APGAR indicates asphyxia
        ]
      }
    },
    {
      $lookup: {
        from: "birthregisters",
        localField: "patient",
        foreignField: "patient",
        as: "birthRegister"
      }
    },
    {
      $unwind: {
        path: "$birthRegister",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$birthRegister.sex",
        count: { $sum: 1 }
      }
    }
  ];

  const lowBirthWeightPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        $or: [
          { "babiesData.lowBirthWeight": true },
          { "newBorn.weightKg": { $lt: "2.5" } }
        ]
      }
    },
    {
      $lookup: {
        from: "birthregisters",
        localField: "patient",
        foreignField: "patient",
        as: "birthRegister"
      }
    },
    {
      $unwind: {
        path: "$birthRegister",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$birthRegister.sex",
        count: { $sum: 1 }
      }
    }
  ];

  const macrosomicBabiesPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        $or: [
          { "babiesData.macrosomicBabies": true },
          { "newBorn.weightKg": { $gte: "4.5" } }
        ]
      }
    },
    {
      $lookup: {
        from: "birthregisters",
        localField: "patient",
        foreignField: "patient",
        as: "birthRegister"
      }
    },
    {
      $unwind: {
        path: "$birthRegister",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$birthRegister.sex",
        count: { $sum: 1 }
      }
    }
  ];

  const earlyNeoNatalDeathPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "babiesData.earlyNeoNatalDeath": true
      }
    },
    {
      $lookup: {
        from: "birthregisters",
        localField: "patient",
        foreignField: "patient",
        as: "birthRegister"
      }
    },
    {
      $unwind: {
        path: "$birthRegister",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$birthRegister.sex",
        count: { $sum: 1 }
      }
    }
  ];

  const bornBeforeArrivalPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        $or: [
          { "babiesData.bornBeforeArrival": true },
          { "delivery.bornBeforeArrival": true }
        ]
      }
    },
    {
      $lookup: {
        from: "birthregisters",
        localField: "patient",
        foreignField: "patient",
        as: "birthRegister"
      }
    },
    {
      $unwind: {
        path: "$birthRegister",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$birthRegister.sex",
        count: { $sum: 1 }
      }
    }
  ];

  const preMaturityPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "babiesData.preMaturity": true
      }
    },
    {
      $lookup: {
        from: "birthregisters",
        localField: "patient",
        foreignField: "patient",
        as: "birthRegister"
      }
    },
    {
      $unwind: {
        path: "$birthRegister",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$birthRegister.sex",
        count: { $sum: 1 }
      }
    }
  ];

  // Neonatal death from MortalityRegister
  const neoNatalDeathPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        neonatalDeath: { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: "$sex",
        count: { $sum: 1 }
      }
    }
  ];

  // MOTHERS DATA pipelines
  
  // Booked cases - checking FirstStageLabour for booking
  const bookedCasesPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate }
      }
    },
    {
      $lookup: {
        from: "firststageLabours",
        localField: "patient",
        foreignField: "patient",
        as: "firstStage"
      }
    },
    {
      $match: {
        "firstStage": { $ne: [] } // Has first stage records indicates booked
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const unbookedCasesPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate }
      }
    },
    {
      $lookup: {
        from: "firststageLabours",
        localField: "patient",
        foreignField: "patient",
        as: "firstStage"
      }
    },
    {
      $match: {
        "firstStage": { $eq: [] } // No first stage records indicates unbooked
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  // TYPE OF DELIVERY pipelines - Using ThirdStageLabour
  const svdPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.typeofDelivery": "SVD"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const vacuumDeliveryPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.typeofDelivery": "Vacuum Delivery"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const forcepsDeliveryPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.typeofDelivery": "Forceps Delivery"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const electiveCaesareanPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.typeofDelivery": "Elective Caesarean Section"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const emergencyCaesareanPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.typeofDelivery": "Emergency Caesarean Section"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  // Also check SecondStageLabour for mode of delivery
  const svdFromSecondStagePipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        modeOfDelivery: "Spontaneous Vaginal Delivery (SVD)"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const csFromSecondStagePipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        $or: [
          { modeOfDelivery: "C-Section (CS)" },
          { modeOfDelivery: "Emergency C.S" }
        ]
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  // MULTIPLE GESTATION pipelines
  const twinDeliveryPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.multipleGestation": "Twin Delivery"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const tripletDeliveryPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.multipleGestation": "Triplet Delivery"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const quadrupletDeliveryPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.multipleGestation": "Quadruplet Delivery"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  // OBSTETRIC COMPLICATIONS pipelines
  const breechPresentationPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        $or: [
          { "delivery.obstetricComplication": "Breech Presentation" },
          { obstetricComplication: "Breech Presentation" }
        ]
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const inductionOfLabourPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        $or: [
          { "delivery.obstetricComplication": "Induction of Labour" },
          { inducedLabour: true }
        ]
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const pretermLabourPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricComplication": "Preterm Labour"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const manualRemovalOfPlacentaPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricComplication": "Manual Removal of Placenta"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const postPartumHemorrhagePipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricComplication": "Post-Partum Hemorrhage (PPH)"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const prematureRuptureOfMembranePipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricComplication": "Premature Rapture of Membrane (PROM)"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const antePartumHemorrhagePipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricComplication": "Ante Partum Hemorrhage (APH)"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const placentaPreviaPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricComplication": "Placenta Previa"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const abruptioPlacentaPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricComplication": "Abruptio Placenta"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const preEclampsiaPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricComplication": "Pre - Eclampsia"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const eclampsiaPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricComplication": "Eclampsia"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const maternalDeathPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        $or: [
          { "mother.statusAfterDelivery": "Dead" },
          { "delivery.obstetricComplication": "Maternal Death" }
        ]
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  // Also check MortalityRegister for maternal deaths
  const maternalDeathFromMortalityPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        maternalMortality: true
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const pregnancyInducedHypertensionPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricComplication": "Pregnancy Induced Hypertension (PIH)"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  // MVA and Abortion pipelines
  const mvaPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.mva": { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const missedAbortionPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.mva": "Missed"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const inducedAbortionPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.mva": "Induced"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const criminalAbortionPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.mva": "Criminal"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  // OBSTETRIC FISTULA SERVICES pipelines
  const newFistulaCasesPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricsFistulaServices": "New cases (Women presenting with Fistula)"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const admittedFistulaCasesPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricsFistulaServices": "Admitted Fistula cases"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const firstRepairPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricsFistulaServices": "First Repair"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const secondRepairPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricsFistulaServices": "Second Repair"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const surgeryForFistulaRepairPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricsFistulaServices": "Surgery for Fistula repair"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const dischargesAfterFistulaSurgeryPipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricsFistulaServices": "Discharges after Fistula surgery"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  const closedAndDryFistulaAtDischargePipeline = [
    {
      $match: {
        createdAt: { $gte: startdate, $lte: enddate },
        "delivery.obstetricsFistulaServices": "Closed and dry Fistula at discharge"
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ];

  return {
    // Babies Data
    liveBirthPipeline,
    freshStillBirthPipeline,
    maceratedStillBirthPipeline,
    asphyxiaPipeline,
    lowBirthWeightPipeline,
    macrosomicBabiesPipeline,
    earlyNeoNatalDeathPipeline,
    bornBeforeArrivalPipeline,
    preMaturityPipeline,
    neoNatalDeathPipeline,

    // Mothers Data - Booking Status  
    bookedCasesPipeline,
    unbookedCasesPipeline,

    // Type of Delivery
    svdPipeline,
    vacuumDeliveryPipeline,
    forcepsDeliveryPipeline,
    electiveCaesareanPipeline,
    emergencyCaesareanPipeline,
    svdFromSecondStagePipeline,
    csFromSecondStagePipeline,

    // Multiple Gestation
    twinDeliveryPipeline,
    tripletDeliveryPipeline,
    quadrupletDeliveryPipeline,

    // Obstetric Complications
    breechPresentationPipeline,
    inductionOfLabourPipeline,
    pretermLabourPipeline,
    manualRemovalOfPlacentaPipeline,
    postPartumHemorrhagePipeline,
    prematureRuptureOfMembranePipeline,
    antePartumHemorrhagePipeline,
    placentaPreviaPipeline,
    abruptioPlacentaPipeline,
    preEclampsiaPipeline,
    eclampsiaPipeline,
    maternalDeathPipeline,
    maternalDeathFromMortalityPipeline,
    pregnancyInducedHypertensionPipeline,
    mvaPipeline,
    missedAbortionPipeline,
    inducedAbortionPipeline,
    criminalAbortionPipeline,

    // Obstetric Fistula Services
    newFistulaCasesPipeline,
    admittedFistulaCasesPipeline,
    firstRepairPipeline,
    secondRepairPipeline,
    surgeryForFistulaRepairPipeline,
    dischargesAfterFistulaSurgeryPipeline,
    closedAndDryFistulaAtDischargePipeline
  };
};
