
import configuration from "../../config";
import {readpaymentaggregate,readappointmentaggregate,readadmissionaggregate,readprocedureaggregate} from "../../dao/reports";
import {readallpayment}  from "../../dao/payment";
import {settings} from "../settings/settings";
export const reports = async (req:any, res:any) => {
try{

  //paymentcategory
  //cashieremail
var { querygroup, querytype, startdate, enddate }: any = req.params;
if (!querygroup) {
  throw new Error(`querygroup ${configuration.error.errorisrequired}`);
}

if (!startdate || !enddate) {
  var todaydate = new Date();
  enddate = todaydate;
  startdate = new Date(
    todaydate.getFullYear(),
    todaydate.getMonth() - 6,
    todaydate.getDate()
  );
} else {
  startdate = new Date(startdate);
  enddate = new Date(enddate);
}

const reportbyfinancialreport = [
  {
    $lookup: {
      from: "patientsmanagements",
      localField: "patient",
      foreignField: "_id",
      as: "patient",
    },
  },
    {   
            $match:{$and:[{paymentcategory: querygroup}, {createdAt:{ $gt: startdate, $lt: enddate }}]}   
    }
    
];

//admission
//referedward
//status

//appointment
//clinic

/*
patient: {
      type: Schema.Types.ObjectId,
      ref: "Patientsmanagement",
      default: null,
    },

    referedward:
  {
    type: Schema.Types.ObjectId,
    ref: "Wardmanagement",
    default: null,
  },
*/

const reportbyadmissionreport = [
  {
    $lookup: {
      from: "patientsmanagements",
      localField: "patient",
      foreignField: "_id",
      as: "patient",
    },
  },
  {
    $lookup: {
      from: "wardmanagements",
      localField: "referedward",
      foreignField: "_id",
      as: "referedward",
    },
  },
  {
    $unwind: "$referedward"        // Flatten the 'userDetails' array so we can access its fields directly
  },
  {
    $match:{$and:[{"referedward.wardname": querygroup}, {referddate:{ $gt: startdate, $lt: enddate }}]} 
  },
];

const reportbyappointmentreport = [
  {
    $lookup: {
      from: "patientsmanagements",
      localField: "patient",
      foreignField: "_id",
      as: "patient",
    },
  },
  {
    $match:{$and:[{clinic: querygroup}, {
      appointmentdate:{ $gt: startdate, $lt: enddate }}]} 
  },
];


//for scn and sra
/*
const reportbystorescnsra = [
  {
    $lookup: {
      from: "productshelves",
      localField: "shelfid",
      foreignField: "_id",
      as: "shelfid",
    },
  },
  {
    $match: {
      $and: [
        { store: querygroup },
        { createdAt: { $gt: startdate, $lt: enddate } },
      ],
    },
  },
];
const reportbystoresra = [
  {
    $lookup: {
      from: "productshelves",
      localField: "shelfid",
      foreignField: "_id",
      as: "shelfid",
    },
  },
  {
    $lookup: {
      from: "sras",
      localField: "sra",
      foreignField: "_id",
      as: "sra",
    },
  },
  {
    $match: {
      $and: [
        { store: querygroup },
        { createdAt: { $gt: startdate, $lt: enddate } },
      ],
    },
  },
];

//for request
const reportbystoresrequest = [
  {
    $lookup: {
      from: "productshelves",
      localField: "productkey",
      foreignField: "_id",
      as: "shelfid",
    },
  },
  {
    $match: {
      $and: [
        { store: querygroup },
        { createdAt: { $gt: startdate, $lt: enddate } },
      ],
    },
  },
];
//for transfer
const reportbystorestransfer = [
  {
    $lookup: {
      from: "productshelves",
      localField: "sendingshelfid",
      foreignField: "_id",
      as: "sendingshelfid",
    },
  },
  {
    $lookup: {
      from: "productshelves",
      localField: "receivingshelfid",
      foreignField: "_id",
      as: "receivingshelfid",
    },
  },
  {
    $match: {
      $and: [
        { "sendingshelfid.store": querygroup },
        { createdAt: { $gt: startdate, $lt: enddate } },
      ],
    },
  },
];
*/
var queryresult: any;

//var c = await configuration.settings2();


let {reports}:any = await settings();
console.log('settings',reports);
//Financial report
if (querytype == reports[0].querytype) {
  
  queryresult = await readpaymentaggregate(reportbyfinancialreport);
}  
else if(querytype == reports[1].querytype){
  queryresult= await readappointmentaggregate(reportbyappointmentreport);

}
else if(querytype == reports[2].querytype){
  queryresult= await readadmissionaggregate(reportbyadmissionreport);

}
else {
  throw new Error(`querytype ${configuration.error.errorisrequired}`);
}
res.json({ queryresult, status: true });


  }
  catch(e:any){
    console.log(e.message);
    res.json({status: false, msg:e.message});

  }

}
// cashier reconcillation
export const cashierreport = async (req:any, res:any) =>{
  try{

  //find cashier with status
   //paymentcategory
  //cashieremail
var {startdate, enddate, email }: any = req.params;
if (!startdate || !enddate) {
  var todaydate = new Date();
  enddate = todaydate;
  startdate = new Date(
    todaydate.getFullYear(),
    todaydate.getMonth(),
    todaydate.getDate()
  );
} else {
  startdate = new Date(startdate);
  enddate = new Date(enddate);
}

   
    var query ={cashieremail:email,createdAt:{ $gt: startdate, $lt: enddate }};
      var populatequery ='patient';
      const cashieraggregatependingpaid = [
        {   
        
          $match:{$and:[{status:configuration.status[3]},{cashieremail:email} , {createdAt:{ $gt: startdate, $lt: enddate }}]}   
  
  },
        {
          $group: {
            _id: "$cashieremail",                // Group by product
            totalAmount: { $sum: "$amount" },
            cashierid:{$first:"$cashierid"}
          }
        },
        {
          $project:{
            cashieremail:"$_id",
            totalAmount:1,
            cashierid:1,
            status:configuration.status[3],
            _id:0
  
          }
  
        }
          
      ];
      const queryresult = {paymentrecords: (await readallpayment(query,populatequery)).paymentdetails, paymentsummary:await readpaymentaggregate(cashieraggregatependingpaid)};
   
      res.json({
        queryresult,
        status: true,
      });


  //return total  
  }
  catch(e:any){
    res.json({status: false, msg:e.message});

  }

}
//report summary
export const reportsummary = async (req:any,res:any) =>{
  try{
    console.log("////////////////////////");
    var { querytype,startdate, enddate }: any = req.params;
    if (!startdate || !enddate) {
      var todaydate = new Date();
      enddate = todaydate;
      startdate = new Date(
        todaydate.getFullYear(),
        todaydate.getMonth(),
        todaydate.getDate()
      );
    } else {
      startdate = new Date(startdate);
      enddate = new Date(enddate);
    }
    
    let {summary}:any = await settings();
    const financialaggregatepaid = [
      {   
      
        $match:{$and:[{status:configuration.status[3]} , {createdAt:{ $gt: startdate, $lt: enddate }}]}   

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
    const financialaggregatependingpaid = [
      {   
      
        $match:{$and:[{status:configuration.status[2]} , {createdAt:{ $gt: startdate, $lt: enddate }}]}   

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
          status:configuration.status[2],
          _id:0

        }

      }
        
    ];
    const cashieraggregatepaid = [
      {   
      
        $match:{$and:[{status:configuration.status[3]} , {createdAt:{ $gt: startdate, $lt: enddate }}]}   

},
      {
        $group: {
          _id: "$cashieremail",                // Group by product
          totalAmount: { $sum: "$amount" },
          cashierid:{$first:"$cashierid"}
        }
      },
      {
        $project:{
          cashieremail:"$_id",
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
    //5 , 6 ,9
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
    
    //3,5,
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
        $unwind: "$referedward"        // Flatten the 'userDetails' array so we can access its fields directly
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
        $unwind: "$referedward"        // Flatten the 'userDetails' array so we can access its fields directly
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
        $unwind: "$referedward"        // Flatten the 'userDetails' array so we can access its fields directly
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
    //procedure aggregate
    //9, 7
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
        $unwind: "$payment"        // Flatten the 'userDetails' array so we can access its fields directly
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
        $unwind: "$payment"        // Flatten the 'userDetails' array so we can access its fields directly
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
    //clinical aggregate
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

    let queryresult:any; 
    
    if(querytype == summary[0]){
     //queryresult = {paid: await readpaymentaggregate(financialaggregatepaid), pendingpayment:await readpaymentaggregate(financialaggregatependingpaid)};
     queryresult = {paid: await readpaymentaggregate(financialaggregatepaid), grandtotal: await readpaymentaggregate(financialaggregategrandtotalpaid)};
    }
    else if(querytype == summary[1]){
    //cashier summary
    queryresult = {paid: await readpaymentaggregate(cashieraggregatepaid), grandtotal:await readpaymentaggregate(cashieraggregatepaidgrandtotal)};
    }
    else if(querytype == summary[2]){
      queryresult = {scheduled: await readappointmentaggregate(appointmentaggregatescheduled),complete:await readappointmentaggregate(appointmentaggregatecomplete), inprogress:await readappointmentaggregate(appointmentaggregateinprogress), totalnumberofappointments: await readappointmentaggregate(appointmentaggregatetotalnumberofappointments)};
//appointmentaggregatetotalnumberofappointments
    //appointment summary
    }
    else if(querytype == summary[3]){
    //wardadmission summary
    queryresult= {admited: await readadmissionaggregate(admissionaggregateadmited),transfered:await readadmissionaggregate(admissionaggregatetransfered),discharged:await readadmissionaggregate(admissionaggregatedischarged), totalnumberofadmissions: await readadmissionaggregate(admissionaggregatetotalnumberofadmissions)};
    }
    else if(querytype == summary[4]){
      console.log("procedure");
      queryresult ={paid: await readprocedureaggregate(procedureaggregatepaid), grandtotal: await readprocedureaggregate(totalprocedureaggregate)}

    }
    else if(querytype == summary[5]){
      //clinicalaggregate
      queryresult = {clinicalreport: await readappointmentaggregate(clinicalaggregate)};

    }
    else{
      throw new Error(`querytype ${configuration.error.errorisrequired}`);
    }
    

    res.json({ queryresult, status: true });
    


  }
  catch(e:any){
    res.json({status: false, msg:e.message});

  }
}


//add pharmacy 1 , pharmacy 2
//add agggreate appointbyicnd10