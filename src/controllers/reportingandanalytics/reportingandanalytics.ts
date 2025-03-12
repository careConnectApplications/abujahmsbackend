
export const financialreportreport = async (req:any, res:any) => {
try{
  /*
  //paymentcategory
  //cashieremail
var { querygroup, querytype, startdate, enddate }: any = req.params;
const temstore = configuration.allstorevalues;
if (!querygroup || !temstore.includes(querygroup)) {
  throw new Error(configuration.error.errorwrongshelf);
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
/*
const reportbystore = [
    {   
            $match:{$and:[{store: querygroup}, {createdAt:{ $gt: startdate, $lt: enddate }}]}   
    }
    
];
*/
/*
const reportbystore = [
  {
    $match: { store: querygroup },
  },
];
//for scn and sra
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
var queryresult: any;
if (querytype == configuration.querytype[0]) {
  queryresult = await readshelfaggregate(reportbystore);
} else if (querytype == configuration.querytype[1]) {
  queryresult = await readscnaggregate(reportbystorescnsra);
} else if (querytype == configuration.querytype[2]) {
  queryresult = await readsraaggregate(reportbystoresra);
} else if (querytype == configuration.querytype[3]) {
  queryresult = await readrequestaggregate(reportbystoresrequest);
} else if (querytype == configuration.querytype[4]) {
  queryresult = await readtransferaggregate(reportbystorestransfer);
} else {
  throw new Error(configuration.error.errorwrongquerygroup);
}
res.json({ queryresult, status: true });
*/

  }
  catch(e:any){

  }

}