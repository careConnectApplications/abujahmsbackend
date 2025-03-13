
import configuration from "../../config";
export const financialreportreport = async (req:any, res:any) => {
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
    $match:{$and:[{"referedward.wardname": querygroup}, {createdAt:{ $gt: startdate, $lt: enddate }}]} 
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
    $match:{$and:[{clinic: querygroup}, {createdAt:{ $gt: startdate, $lt: enddate }}]} 
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
//Financial report
if (querytype == configuration.reports[0].querytype) {
  //queryresult = await readshelfaggregate(reportbystore);
}  else {
 // throw new Error(configuration.error.errorwrongquerygroup);
}
res.json({ queryresult, status: true });


  }
  catch(e:any){

  }

}