export const maternityReturnAggregates = (startdate: any, enddate: any) => {
  // Section J - Babies Data
  const babiesData = [
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
        liveBirth: [
          { $match: { birthOutcome: "Live Birth" } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        stillBirth: [
          { $match: { birthOutcome: "Still Birth" } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        asphyxia: [
          { $match: { birthComplication: { $regex: /asphyxia/i } } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        lowBirthWeight: [
          { $match: { 
            $or: [
              { birthWeight: { $lt: 2500 } },
              { birthComplication: { $regex: /low birth weight/i } }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        newbornDeath: [
          { $match: { 
            $or: [
              { birthOutcome: { $regex: /neonatal death/i } },
              { birthOutcome: { $regex: /newborn death/i } }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        normalBirth: [
          { $match: { 
            $and: [
              { birthOutcome: "Live Birth" },
              { birthComplication: { $in: [null, "", "None", "Normal"] } }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        birthAsphyxiaWithResuscitation: [
          { $match: { 
            $and: [
              { birthComplication: { $regex: /asphyxia/i } },
              { resuscitation: true }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        pretermBirth: [
          { $match: { 
            $or: [
              { gestationalAge: { $lt: 37 } },
              { birthType: { $regex: /preterm/i } }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        birthDefects: [
          { $match: { 
            $or: [
              { birthComplication: { $regex: /defect/i } },
              { birthComplication: { $regex: /anomaly/i } },
              { birthComplication: { $regex: /congenital/i } }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ]
      }
    }
  ];

  // Section J - Mothers Data
  const mothersData = [
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
        bookingStatus: {
          booked: [
            { $match: { bookingStatus: { $in: ["Booked", "ANC Registered"] } } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ],
          unbooked: [
            { $match: { 
              $or: [
                { bookingStatus: { $in: ["Unbooked", "Not Registered"] } },
                { bookingStatus: { $exists: false } },
                { bookingStatus: null }
              ]
            } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ]
        },
        typeOfDelivery: {
          normalVaginal: [
            { $match: { deliveryType: { $regex: /normal|vaginal|svd/i } } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ],
          assistedVaginal: [
            { $match: { deliveryType: { $regex: /assisted|vacuum|forceps/i } } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ],
          caesarean: [
            { $match: { deliveryType: { $regex: /caesarean|c-section|cs/i } } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ]
        },
        obstetricComplications: {
          pph: [
            { $match: { 
              $or: [
                { complication: { $regex: /postpartum hemorrhage|pph/i } },
                { complication: { $regex: /post-partum hemorrhage/i } }
              ]
            } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ],
          eclampsia: [
            { $match: { complication: { $regex: /eclampsia/i } } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ],
          obstructedLabour: [
            { $match: { complication: { $regex: /obstructed labour|obstructed labor/i } } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ],
          sepsis: [
            { $match: { complication: { $regex: /sepsis|infection/i } } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ],
          rupturredUterus: [
            { $match: { complication: { $regex: /rupture|ruptured uterus/i } } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ],
          retainedPlacenta: [
            { $match: { complication: { $regex: /retained placenta/i } } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ]
        },
        mvaServices: [
          { $match: { 
            $or: [
              { procedure: { $regex: /mva|manual vacuum aspiration/i } },
              { serviceType: { $regex: /mva/i } }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ],
        fistulaServices: {
          screening: [
            { $match: { serviceType: { $regex: /fistula screening/i } } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ],
          repair: [
            { $match: { serviceType: { $regex: /fistula repair/i } } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ],
          rehabilitation: [
            { $match: { serviceType: { $regex: /fistula rehabilitation/i } } },
            { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
          ]
        },
        maternalDeath: [
          { $match: { 
            $or: [
              { outcome: { $regex: /maternal death/i } },
              { deathType: "Maternal" }
            ]
          } },
          { $group: { _id: "$patient.gender", count: { $sum: 1 } } }
        ]
      }
    }
  ];

  return { babiesData, mothersData };
};
