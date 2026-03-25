import configuration from "../../config";
export const appointmentaggregatereports=(startdate:any,enddate:any)=>{
const outpatientdepartmentpipeline = [
  
    {
      $match: {
        createdAt: { $gte: startdate, $lt: enddate },
      },
    },
    
    {
     $lookup: {
        from: "patientsmanagements", // collection name of Patientsmanagement
        localField: "patient",
        foreignField: "_id",
        as: "patientInfo",
      },
    },
    { $unwind: "$patientInfo" },
    {
      $project: {
        clinic: 1,
        appointmenttype: 1,
        category: 1,
        gender: "$patientInfo.gender",
        patientCreatedAt: "$patientInfo.createdAt",
        patient: "$patient",
        
      },
    },
 
    {
      $facet: {
        newAdult: [
          { $match: { category: configuration.cliniccategory[0],patientCreatedAt: { $gte: startdate, $lt: enddate } } },
          { $group: { _id: { patient: "$patient", gender: "$gender" } } },
          { $group: { _id: "$_id.gender", count: { $sum: 1 } } },
        ],
         
        newPaediatrics: [
          { $match: { category: configuration.cliniccategory[1],patientCreatedAt: { $gte: startdate, $lt: enddate },} },
          { $group: { _id: { patient: "$patient", gender: "$gender" } } },
          { $group: { _id: "$_id.gender", count: { $sum: 1 } } },
        ],
        familyMedicine: [
          { $match: { category: configuration.cliniccategory[0] } },
          { $group: { _id: "$gender", count: { $sum: 1 } } },
        ],
        popd: [
          { $match: { category: configuration.cliniccategory[1] } },
          { $group: { _id: "$gender", count: { $sum: 1 } } },
        ],
        
      },
      
    },
    
  
  ];

  
const appointmentaggregatescheduled = [
      {   
      
        $match:{$and:[{status:configuration.status[5]} , {
          appointmentdate:{ $gt: startdate, $lt: enddate }}]}   

},
      {
       $group: {
          _id: "$clinic",                // Group by product
          Numberofappointment: { $sum: 1 },
        }
      },
      {
        $project:{
          clinic:"$_id",
          Numberofappointment:1,
          status:configuration.status[5],
          _id:0

        }

      }
        
    ];
    const appointmentaggregatecomplete = [
      {   
      
        $match:{$and:[{status:configuration.status[6]} , {
          appointmentdate:{ $gt: startdate, $lt: enddate }}]}   

},
      {
        $group: {
          _id: "$clinic",                // Group by product
          Numberofappointment: { $sum: 1 },
        }
      },
      {
        $project:{
          clinic:"$_id",
          Numberofappointment:1,
          status:configuration.status[6],
          _id:0

        }

      }
        
    ];
    const appointmentaggregateinprogress = [
      {   
      
        $match:{$and:[{status:configuration.status[9]} , {
          appointmentdate:{ $gt: startdate, $lt: enddate }}]}   

},
      {
        $group: {
          _id: "$clinic",                // Group by product
          Numberofappointment: { $sum: 1 },
        }
      },
      {
        $project:{
          clinic:"$_id",
          Numberofappointment:1,
          status:configuration.status[9],
          _id:0

        }

      }
        
    ];
    
    const appointmentaggregatetotalnumberofappointments = [
      {   
      
        $match:{$or:[{status:configuration.status[5]},{status:configuration.status[6]},{status:configuration.status[9]}],appointmentdate:{ $gt: startdate, $lt: enddate }}   

},
      {
        $group: {
          _id: null,                // Group by product
          GrandTotalNumberofappointment: { $sum: 1 },
        }
      },
      {
        $project:{
          GrandTotalNumberofappointment:1,
          _id:0

        }

      }
        
    ];
    const clinicalaggregate = [
          {   
          
            $match:{appointmentdate:{ $gt: startdate, $lt: enddate }}   
    
    },
          {
            $group: {
              _id:{
              $ifNull: ["$clinicalencounter.diagnosisicd10", "No Diagnosis"]             // Group by product
              },
              Numberofappointment: { $sum: 1 },
            }
          },
          {
            $project:{
              diagnosis:"$_id",
              Numberofappointment:1,
              _id:0
    
            }
    
          }
            
        ];
    const accidentEmergencyRecordsPipeline = [
      {
        $match: {
          createdAt: { $gte: startdate, $lt: enddate },
          category: configuration.cliniccategory[2], // Assuming "Accident & Emergency" is represented by "Adult"
        },
      },
      {
        $lookup: {from: "patientsmanagements",
          localField: "patient",
          foreignField: "_id",
          as: "patientInfo",
        },
      },
      { $unwind: "$patientInfo" },
      {
        $project: {
          appointmenttype: 1,
          gender: "$patientInfo.gender",
          category: 1,
          "clinicalencounter.outcome": 1,
          referredIn: 1, 
        },
      },
      {
        $facet: {
          accidentAndEmergencyAttendance: [
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],
          roadTrafficAccident: [
            { $match: { accidentType: { $ne: null } } },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],
          epuAttendance: [
            { $match: { unit: configuration.unitcategory[0] } },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],
          /*
          dressing: [
            { $match: { appointmenttype: "Dressing" } },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],
          */
          aAndEDeath: [
            { $match: { "clinicalencounter.outcome": configuration.encounterplanoutcome[0] } },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],
          epuDeath: [
            {
              $match: {
              unit: configuration.unitcategory[0],
              "clinicalencounter.outcome": configuration.encounterplanoutcome[0],
              },
            },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],
          broughtInDeath: [
            { $match: { arrivalMode: configuration.arrivalMode[3] } },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],
          bidInEpu: [
            {
              $match: {
                arrivalMode: configuration.arrivalMode[3],
                unit: configuration.unitcategory[0]
              },
            },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],
          outpatientsReferredIn: [
            { $match: { arrivalMode: configuration.arrivalMode[2] } },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],
          outpatientsReferredOut: [
            { $match: { "clinicalencounter.outcome": configuration.encounterplanoutcome[1] } },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],
        },
      },
    ];
    return {appointmentaggregatescheduled,appointmentaggregatecomplete,appointmentaggregateinprogress,appointmentaggregatetotalnumberofappointments,clinicalaggregate,outpatientdepartmentpipeline, accidentEmergencyRecordsPipeline}
}
    

