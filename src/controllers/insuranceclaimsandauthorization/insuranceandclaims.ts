
import { NextFunction, Request, Response } from "express";
import {optimizedreadallradiology,readallradiology } from "../../dao/radiology";
import {readallprocedure,readprocedureaggregateoptimized} from "../../dao/procedure";
import {optimizedreadprescriptionaggregate,readallprescription} from "../../dao/prescription";
import {optimizedreadalllab,readalllab} from "../../dao/lab";
import {getAllPaginatedHistopathologyRecords} from "../../dao/histopathology.dao";
import configuration from "../../config";
import catchAsync from "../../utils/catchAsync";


export const groupreadAwaitingAuthorizationRadiologyoptimized = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    var {  firstName, MRN, HMOId, lastName, phoneNumber, testname} = req.query;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    const filter: any = {};
    var statusfilter: any = { status:configuration.otherstatus[0] };
    // Add filters based on query parameters
    if (firstName) {
      filter.firstName = new RegExp(firstName, 'i'); // Case-insensitive search for name
    }
    if (MRN) {
      filter.MRN = new RegExp(MRN, 'i');
    }
    if (HMOId) {
      filter.HMOId = new RegExp(HMOId, 'i'); // Case-insensitive search for email
    }
    if (lastName) {
      filter.lastName = new RegExp(lastName, 'i'); // Case-insensitive search for email
    }
    if (phoneNumber) {
      filter.phoneNumber = new RegExp(phoneNumber, 'i'); // Case-insensitive search for email
    }
    let aggregatequery =
      [
        {
          $match: statusfilter
        },
        
        {
          $lookup: {
            from: 'patientsmanagements',
            localField: 'patient',
            foreignField: '_id',
            as: 'patient'
          }
        },
    
        {
          $unwind: {
            path: '$patient',
            preserveNullAndEmptyArrays: true

          }  // Deconstruct the patient array (from the lookup)
        },
        {
            $group: {
              _id: "$testid",
                createdAt: { $first: "$createdAt" },
                testname: { $first: "$testname" },
                testid: { $first: "$testid" },
                department: { $first: "$department" },
                raiseby: { $first: "$raiseby" },
                HMOId: { $first: "$patient.HMOId" },
                HMOName: { $first: "$patient.HMOName" },
                status: { $first: "$status" },
                totalamount: { $sum: "$amount" },
                MRN: { $first: "$patient.MRN" },
                firstName: { $first: "$patient.firstName" },
                lastName: { $first: "$patient.lastName" },
                phoneNumber: { $first: "$patient.phoneNumber" }


            }
        },
        {
          $project: {
            _id: 1,
            createdAt: 1,
            testid: 1,
            department: 1,
            raiseby: 1,
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            MRN: 1,
            HMOId: 1,
            HMOName: 1,
            totalamount: 1,
            status: 1,
            

          }
        },
        {
          $match: filter
        },
      ];
    const queryresult = await optimizedreadallradiology(aggregatequery, page, size);



    res.status(200).json({
      queryresult,
      status: true
    });




});

//////////////////////procedure ////////////////////////////
export const groupreadAwaitingAuthorizationProcedureoptimized = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

    var {  firstName, MRN, HMOId, lastName, phoneNumber} = req.query;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    const filter: any = {};
    var statusfilter: any = { status:configuration.otherstatus[0] };
    // Add filters based on query parameters
    if (firstName) {
      filter.firstName = new RegExp(firstName, 'i'); // Case-insensitive search for name
    }
    if (MRN) {
      filter.MRN = new RegExp(MRN, 'i');
    }
    if (HMOId) {
      filter.HMOId = new RegExp(HMOId, 'i'); // Case-insensitive search for email
    }
    if (lastName) {
      filter.lastName = new RegExp(lastName, 'i'); // Case-insensitive search for email
    }
    if (phoneNumber) {
      filter.phoneNumber = new RegExp(phoneNumber, 'i'); // Case-insensitive search for email
    }
    let aggregatequery =
      [
        {
          $match: statusfilter
        },
        
        {
          $lookup: {
            from: 'patientsmanagements',
            localField: 'patient',
            foreignField: '_id',
            as: 'patient'
          }
        },
    
        {
          $unwind: {
            path: '$patient',
            preserveNullAndEmptyArrays: true

          }  // Deconstruct the patient array (from the lookup)
        },
        {
            $group: {
              _id: "$procedureid",
                createdAt: { $first: "$createdAt" },
                procedure: { $first: "$procedure" },
                procedureid: { $first: "$procedureid" },
                raiseby: { $first: "$raiseby" },
                HMOId: { $first: "$patient.HMOId" },
                HMOName: { $first: "$patient.HMOName" },
                status: { $first: "$status" },
                totalamount: { $sum: "$amount" },
                MRN: { $first: "$patient.MRN" },
                firstName: { $first: "$patient.firstName" },
                lastName: { $first: "$patient.lastName" },
                phoneNumber: { $first: "$patient.phoneNumber" }


            }
        },
        {
          $project: {
            _id: 1,
            createdAt: 1,
            procedureid: 1,
            procedure: 1,
            raiseby: 1,
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            MRN: 1,
            HMOId: 1,
            HMOName: 1,
            totalamount: 1,
            status: 1,
            

          }
        },
        {
          $match: filter
        },
      ];
    const queryresult = await readprocedureaggregateoptimized(aggregatequery, page, size);



    res.status(200).json({
      queryresult,
      status: true
    });

});


export const readAllprocedureAwaitingAuthorization = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  

    const { id } = req.params;
    const queryresult = await readallprocedure({ patient: id }, {}, 'patient', '');
    res.status(200).json({
      queryresult,
      status: true
    });

});


/////////////////////////pharmaccy /////////////////
export const readallPharmacyAwaitingAuthorization = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

   const {patient} = req.params;
    const queryresult = await readallprescription({patient},{},'patient','appointment','payment');
    res.status(200).json({
      queryresult,
      status:true
    }); 

});

export const groupreadawatingauthorizationpharmacytransaction = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
   
      const query ={ dispensestatus:configuration.otherstatus[0] };
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
      const ordergroup = [
       //look up patient
       {
        $match:query
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
          $group: {
            _id: "$orderid",
            orderid: {$first: "$orderid"},
            createdAt: { $first: "$createdAt" },
            prescribersname: { $first: "$prescribersname" },
            firstName:{$first: "$patient.firstName"},
            lastName:{$first: "$patient.lastName"},
            MRN:{$first: "$patient.MRN"},
            status: { $first: "$status" },
            totalamount: { $sum: "$amount" },
            phoneNumber:{$first: "$patient.phoneNumber"},
            isHMOCover:{$first: "$patient.isHMOCover"},
            HMOName:{$first: "$patient.HMOName"},
            HMOId:{$first: "$patient.HMOId"},
            HMOPlan:{$first: "$patient.HMOPlan"},
            appointmentid:{$first: "$appointmentid"}   
          },
        },
        {
          $project:{
            _id:0,
            orderid: 1,
            createdAt: 1,
            prescribersname: 1,
            firstName:1,
            lastName:1,
            totalamount:1,
            phoneNumber:1,
            MRN:1,
            isHMOCover:1,
            HMOName:1,
            HMOId:1,
            HMOPlan:1,
            status:1,
            appointmentid:1   
          }
        },
        
        { $sort: { createdAt: -1 } },
        
        
      ];
  
      const queryresult = await optimizedreadprescriptionaggregate(ordergroup,page,size);
      res.json({
        queryresult,
        status: true,
      });
  
      
   
  })
  //////////////////////////////////lab ///////////////////////
  export const groupreadawatingauthorizationlabtransaction = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

      const query = { status:configuration.otherstatus[0]};
       const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
      const queryresult = await optimizedreadalllab([
         {
         
          $match: query,
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
          $group: {
            _id: "$testid",
            MRN:{$first: {$first:"$patient.MRN"}},
            firstName:{$first: {$first:"$patient.firstName"}},
            lastName:{$first: {$first:"$patient.lastName"}},
            phoneNumber:{$first: {$first:"$patient.phoneNumber"}},
            isHMOCover:{$first: "$patient.isHMOCover"},
            HMOName:{$first: "$patient.HMOName"},
            HMOId:{$first: "$patient.HMOId"},
            HMOPlan:{$first: "$patient.HMOPlan"},
            appointmentid: {$first:"$appointmentid"},
            testid: {$first:"$testid"},
            status: {$first:"$status"},
            totalamount: { $sum: "$amount" },
            createdAt: {$first:"$createdAt"},
            raiseby: {$first:"$raiseby"}
           
            
          },
          
          
        },
        
  
  
        
        { $sort: { createdAt: -1 } },
        
      ],page,size);
     
     
      
  
      res.json({
        queryresult,
        status: true,
      });
   
  });

///////////////////////////////histopathology ///////////////////////
export const readallhistopathologyAwaitingAuthorization = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

     const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    //const queryresult = await readallhistopathology({department:clinic},{},'patient','appointment','payment');
    const queryresult = await getAllPaginatedHistopathologyRecords({status:configuration.otherstatus[0],page,size});
    res.status(200).json({
      queryresult,
      status:true
    }); 

});

export const readallbyreferenceid = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const { referencenumber } = req.query;
    const {referencecategory} = req.query;
    let queryresult;

    if(referencecategory == configuration.referencecategory[0] ){
     //lab
     queryresult=await readalllab({testid:referencenumber, status:configuration.otherstatus[0]},{},'patient','appointment','');


    }
    
    else if(referencecategory == configuration.referencecategory[1] ){
//radiology
queryresult=await readallradiology({testid:referencenumber, status:configuration.otherstatus[0]},{},'patient','');
    }
    else if(referencecategory == configuration.referencecategory[2] ){//procedure
        queryresult=await readallprocedure({procedureid:referencenumber, status:configuration.otherstatus[0]},{},'patient','');
          }
          else if(referencecategory == configuration.referencecategory[3] ){//pharmacy
            //pharmacy  
            queryresult=await readallprescription({orderid:referencenumber, dispensestatus:configuration.otherstatus[0]},{},'patient','','');

          }
          else{
            throw new Error( "Invalid reference category");
          }

    res.status(200).json({
      queryresult,
      status:true
    }); 

})
