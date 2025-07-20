
import configuration from "../../config";
export const admissionaggregatereports=(startdate:any,enddate:any)=>{

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
    return {admissionaggregateadmited,admissionaggregatetransfered,admissionaggregatedischarged,admissionaggregatetotalnumberofadmissions}
}