import configuration from "../../config";
export const cashieraggregatereports=(startdate:any,enddate:any)=>{
const cashieraggregatepaid = [
      {   
      
        $match:{$and:[{status:configuration.status[3]} , {createdAt:{ $gt: startdate, $lt: enddate }}]}   

},
      {
        $group: {
          _id: "$cashieremail",                // Group by product
          totalAmount: { $sum: "$amount" },
          cashierid:{$first:"$cashierid"},
          tempcashiername: {
           $push: {
          $cond: [{ $ne: ["$cashiername", null] }, "$cashiername", "$$REMOVE"]
           }
          },
          
          //cashiername:{$first:"$cashiername"}
        }
      },
      {
        $addFields: {
          cashiername: { $arrayElemAt: ["$tempcashiername", 0] }
        }
      },
      {
        $project:{
          cashieremail:"$_id",
          cashiername:1,
          totalAmount:1,
          cashierid:1,
          status:configuration.status[3],
          _id:0

        }

      }
        
    ];
    const cashieraggregatepaidgrandtotal = [
      {   
      
        $match:{$and:[{status:configuration.status[3]} , {createdAt:{ $gt: startdate, $lt: enddate }}]}   

},
      {
        $group: {
          _id: null,                // Group by product
          grandtotalAmount: { $sum: "$amount" }
        }
      },
      {
        $project:{
          grandtotalAmount:1,
          _id:0

        }

      }
        
    ];
    return {cashieraggregatepaid,cashieraggregatepaidgrandtotal}
}