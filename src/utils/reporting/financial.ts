import configuration from "../../config";

export const financialreports=(startdate:any,enddate:any)=>{
const financialaggregatepaid = [
      {   
      
        $match:{$and:[{status:configuration.status[3]} , {updatedAt:{ $gt: startdate, $lt: enddate }}]}   

},
      {
        $group: {
          _id: "$paymentcategory",                // Group by product
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $project:{
          paymentcategory:"$_id",
          totalAmount:1,
          status:configuration.status[3],
          _id:0

        }

      }
        
    ];
    const financialaggregategrandtotalpaid = [
      {   
      
        $match:{$and:[{status:configuration.status[3]} , {updatedAt:{ $gt: startdate, $lt: enddate }}]}   

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
    return {financialaggregatepaid,financialaggregategrandtotalpaid}
}