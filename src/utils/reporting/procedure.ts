import configuration from "../../config";
export const procedureaggregatereports=(startdate:any,enddate:any)=>{

const procedureaggregatepaid = [
      {
        $lookup: {
          from: "payments",
          localField: "payment",
          foreignField: "_id",
          as: "payment",
        },
      },
      {
        $unwind: {
          path: "$payment",
          preserveNullAndEmptyArrays: true
        }
        
      },
      {
        $match:{"payment.status":configuration.status[3],createdAt:{ $gt: startdate, $lt: enddate }} 
      },
           
     
      {
        $group: {
          _id: "$clinic",                // Group by product
          Numberofprocedures: { $sum: 1 },
          totalAmount: { $sum: "$payment.amount" }
        }
      },
      {
        $project:{
          clinic:"$_id",
          Numberofprocedures:1,
          totalAmount:1,
          _id:0

        }

      }
        
        
    ];
    const totalprocedureaggregate = [
      {
        $lookup: {
          from: "payments",
          localField: "payment",
          foreignField: "_id",
          as: "payment",
        },
      },
      {
        $unwind: {
          path: "$payment",
          preserveNullAndEmptyArrays: true
        }
        
      },
      
 
     
      {
        $match:{"payment.status":configuration.status[3],createdAt:{ $gt: startdate, $lt: enddate }} 
      },
           
     
      {
        $group: {
          _id: null,                // Group by product
          TotalNumberofprocedures: { $sum: 1 },
          GrandtotalAmount: { $sum: "$payment.amount" }
        }
      },
      {
        $project:{
         
          TotalNumberofprocedures:1,
          GrandtotalAmount:1,
          _id:0

        }

      }
        
        
    ];
    return {procedureaggregatepaid,totalprocedureaggregate}
}