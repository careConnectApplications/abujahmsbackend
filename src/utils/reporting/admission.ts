
import status from "http-status";
import configuration from "../../config";
export const admissionaggregatereports=(startdate:any,enddate:any)=>{
const inpatientrecordspipeline = [
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
        $addFields: {
          gender: "$patientInfo.gender",
        },
      },

      {
        $facet: {
          // Brought Forward = admissions created BEFORE fromDate and still active
          broughtForward: [
            {
              $match: {
                createdAt: { $lt: startdate },
                status: configuration.admissionstatus[1],
              },
            },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],

          // New Admission = created within the period
          newAdmission: [
            {
              $match: {
                createdAt: { $gte: startdate, $lte: enddate},
                status: configuration.admissionstatus[1]
              },
            },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],

          // Discharges
          discharges: [
            {
              $match: {
                status: configuration.admissionstatus[5],
                updatedAt: { $gte: startdate, $lte: enddate },
              },
            },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],

          // Deaths
          deaths: [
            {
              $match: {
                dischargeReason: "Death",
                updatedAt: { $gte: startdate, $lte: enddate },
              },
            },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],

          // Referred In
          referredIn: [
            {
              $match: {
                referredIn: true,
                updatedAt: { $gte: startdate, $lte: enddate },
              },
            },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],

          // Referred Out
          referredOut: [
            {
              $match: {
                dischargeReason: "Referred Out",
                updatedAt: { $gte: startdate, $lte: enddate },
                status: configuration.admissionstatus[5]
              },
            },
            { $group: { _id: "$gender", count: { $sum: 1 } } },
          ],
        },
      },
    ];

const admissionaggregateadmited = [
      {
        $lookup: {
          from: "wardmanagements",
          localField: "referedward",
          foreignField: "_id",
          as: "referedward",
        },
      },
      {
        $unwind: {
          path: "$referedward",
          preserveNullAndEmptyArrays: true
        }
        
      },
      {
        $match:{$and:[{status:configuration.admissionstatus[1]}, {referddate:{ $gt: startdate, $lt: enddate }}]} 
      },
      {
        $group: {
          _id: "$referedward.wardname",                // Group by product
          Numberofadmission: { $sum: 1 },
        }
      },
      {
        $project:{
          wardname:"$_id",
          Numberofadmission:1,
          status:configuration.admissionstatus[1],
          _id:0

        }

      }
        
    ];
    const admissionaggregatetransfered = [
      {
        $lookup: {
          from: "wardmanagements",
          localField: "referedward",
          foreignField: "_id",
          as: "referedward",
        },
      },
      {
        $unwind: {
          path: "$referedward",
          preserveNullAndEmptyArrays: true
        }
        
      },
      {
        $match:{$and:[{status:configuration.admissionstatus[3]}, {referddate:{ $gt: startdate, $lt: enddate }}]} 
      },
      {
        $group: {
          _id: "$referedward.wardname",                // Group by product
          Numberofadmission: { $sum: 1 },
        }
      },
      {
        $project:{
          wardname:"$_id",
          Numberofadmission:1,
          status:configuration.admissionstatus[3],
          _id:0

        }

      }
        
    ];
    const admissionaggregatedischarged = [
      {
        $lookup: {
          from: "wardmanagements",
          localField: "referedward",
          foreignField: "_id",
          as: "referedward",
        },
      },
      {
        $unwind: {
          path: "$referedward",
          preserveNullAndEmptyArrays: true
        }
        
      },
      
      {
        $match:{$and:[{status:configuration.admissionstatus[5]}, {referddate:{ $gt: startdate, $lt: enddate }}]} 
      },
      {
        $group: {
          _id: "$referedward.wardname",                // Group by product
          Numberofadmission: { $sum: 1 },
        }
      },
      {
        $project:{
          wardname:"$_id",
          Numberofadmission:1,
          status:configuration.admissionstatus[5],
          _id:0

        }

      }
        
    ];
    const admissionaggregatetotalnumberofadmissions = [
     
     
      {
        $match:{$or:[{status:configuration.admissionstatus[1]},{status:configuration.admissionstatus[3]},{status:configuration.admissionstatus[5]}],referddate:{ $gt: startdate, $lt: enddate }} 
      },
      {
        $group: {
          _id: null,                // Group by product
          TotalNumberofadmission: { $sum: 1 },
        }
      },
      {
        $project:{
          TotalNumberofadmission:1,
          _id:0

       }

      }
        
    ];
    return {admissionaggregateadmited,admissionaggregatetransfered,admissionaggregatedischarged,admissionaggregatetotalnumberofadmissions,inpatientrecordspipeline}
}












