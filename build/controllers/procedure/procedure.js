"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadprocedureresult = exports.readAllprocedureByClinic = exports.readAllprocedureByPatient = exports.scheduleprocedureorder = void 0;
exports.updateprocedures = updateprocedures;
const mongoose_1 = __importDefault(require("mongoose"));
const otherservices_1 = require("../../utils/otherservices");
const patientmanagement_1 = require("../../dao/patientmanagement");
const appointment_1 = require("../../dao/appointment");
const procedure_1 = require("../../dao/procedure");
const price_1 = require("../../dao/price");
const payment_1 = require("../../dao/payment");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
const hmocategorycover_1 = require("../../dao/hmocategorycover");
const { ObjectId } = mongoose_1.default.Types;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const procedure_helper_1 = require("./procedure.helper");
const config_1 = __importDefault(require("../../config"));
exports.scheduleprocedureorder = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    let { procedure, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes, appointmentid } = req.body;
    const { firstName, lastName } = (req.user).user;
    const raiseby = `${firstName} ${lastName}`;
    const procedureid = String(Date.now());
    (0, otherservices_1.validateinputfaulsyvalue)({ id, procedure });
    // find patient
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, "", "");
    if (!foundPatient) {
        throw new Error(`Patient ${config_1.default.error.erroralreadyexit}`);
    }
    console.log("foundPatient", foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.insurance);
    // HMO coverage %
    const insurance = yield (0, hmocategorycover_1.readonehmocategorycover)({ hmoId: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.insurance, category: config_1.default.category[5] }, { hmopercentagecover: 1 });
    console.log("insurance", insurance);
    const hmopercentagecover = (_a = insurance === null || insurance === void 0 ? void 0 : insurance.hmopercentagecover) !== null && _a !== void 0 ? _a : 0;
    // validate appointment if provided
    let appointment;
    if (appointmentid) {
        appointmentid = new ObjectId(appointmentid);
        appointment = yield (0, appointment_1.readoneappointment)({ _id: appointmentid }, {}, "");
        if (!appointment) {
            throw new Error(`Appointment ${config_1.default.error.erroralreadyexit}`);
        }
    }
    // 🔑 Strategy: HMO vs Self-Pay
    const strategyFn = !(foundPatient.isHMOCover == config_1.default.ishmo[1] || foundPatient.isHMOCover == true)
        ? procedure_helper_1.SelfPayProcedureStrategy
        : procedure_helper_1.HmoProcedureStrategy;
    const context = (0, procedure_helper_1.ProcedureScheduleContext)(strategyFn);
    const queryresult = yield context.execute({
        id,
        procedure,
        clinic,
        indicationdiagnosisprocedure,
        appointmentdate,
        cptcodes,
        dxcodes,
        appointmentid,
        raiseby,
        procedureid,
        foundPatient,
        hmopercentagecover,
    });
    res.status(200).json({ queryresult, status: true });
}));
/*
export var scheduleprocedureorder = async (req: any, res: any) => {
  try {
    //accept _id from request
    const { id } = req.params;
    var { procedure, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes, appointmentid } = req.body;

    const { firstName, lastName } = (req.user).user;
    const raiseby = `${firstName} ${lastName}`;
    var procedureid: any = String(Date.now());
    var proceduresid = [];
    //var paymentids = [];
    validateinputfaulsyvalue({ id, procedure });
    //find the record in appointment and validate
    const foundPatient: any = await readonepatient({ _id: id }, {}, '', '');
    //category
    if (!foundPatient) {
      throw new Error(`Patient donot ${configuration.error.erroralreadyexit}`);

    }
    let insurance:any = await readonehmocategorycover({hmoId:foundPatient?.insurance, category:configuration.category[5]},{hmopercentagecover:1});
    var hmopercentagecover=insurance?.hmopercentagecover ?? 0;
    var appointment: any;
    if (appointmentid) {
      appointmentid = new ObjectId(appointmentid);
      appointment = await readoneappointment({ _id: appointmentid }, {}, '');
      if (!appointment) {
        //create an appointment
        throw new Error(`Appointment donot ${configuration.error.erroralreadyexit}`);

      }


    }

   
    //loop through all test and create record in lab order
    for (var i = 0; i < procedure.length; i++) {
      //search for price of test name
      var testPrice: any = await readoneprice({ servicetype: procedure[i] });
      if (!testPrice) {
        throw new Error(`${configuration.error.errornopriceset}  ${procedure[i]}`);
      }
      const amount =calculateAmountPaidByHMO(Number(hmopercentagecover), Number(testPrice.amount));

     /*
      let paymentreference;

      //search for patient under admission. if the patient is admitted the patient admission number will be use as payment reference
      var findAdmission = await readoneadmission({ patient: id, status: { $ne: configuration.admissionstatus[5] } }, {}, '');
      if (findAdmission) {
        paymentreference = findAdmission.admissionid;

      }
      else {
        paymentreference = procedureid;
      }
              //create payment
      if (foundPatient?.isHMOCover == configuration.ishmo[0]) {

        var createpaymentqueryresult = await createpayment({ firstName: foundPatient?.firstName, lastName: foundPatient?.lastName, MRN: foundPatient?.MRN, phoneNumber: foundPatient?.phoneNumber, paymentreference, paymentype: procedure[i], paymentcategory: configuration.category[5], patient: id, amount: Number(testPrice.amount) })

        //create testrecordn
        var procedurerecord = await createprocedure({ procedure: procedure[i], patient: id, payment: createpaymentqueryresult._id, procedureid, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes, raiseby });
        proceduresid.push(procedurerecord._id);
        paymentids.push(createpaymentqueryresult._id);
      }
      else {
        // var createpaymentqueryresult =await createpayment({paymentreference,paymentype:procedure[i],paymentcategory:testsetting[0].category,patient:id,amount:Number(testPrice.amount)})

        //create testrecordn
        var procedurerecord = await createprocedure({ procedure: procedure[i], patient: id, procedureid, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes, raiseby });
        proceduresid.push(procedurerecord._id);
        //paymentids.push(createpaymentqueryresult._id);
      }
        */
/*
       var procedurerecord = await createprocedure({ procedure: procedure[i], patient: id, procedureid, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes, raiseby,status: configuration.otherstatus[0],amount });
        proceduresid.push(procedurerecord._id);
       

    }
    let queryresult=await updatepatient(id, { $push: { prcedure: proceduresid } });
/*
    if (foundPatient?.isHMOCover == configuration.ishmo[0]) {
      queryresult = await updatepatient(id, { $push: { prcedure: proceduresid, payment: paymentids } });
    }
    else {
      queryresult = await updatepatient(id, { $push: { prcedure: proceduresid } });

    }
      */
/*
if (appointmentid) {
 await updateappointment(appointment._id, { $push: { procedure: proceduresid } });
 //procedure

}
res.status(200).json({ queryresult, status: true });

}
catch (error: any) {
console.log("error", error);
res.status(403).json({ status: false, msg: error.message });

}

}
*/
//get lab order by patient
const readAllprocedureByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const queryresult = yield (0, procedure_1.readallprocedure)({ patient: id }, {}, 'patient', 'payment');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllprocedureByPatient = readAllprocedureByPatient;
//get lab order by clinic
const readAllprocedureByClinic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clinic } = req.params;
        const queryresult = yield (0, procedure_1.readallprocedure)({ clinic }, {}, 'patient', 'payment');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllprocedureByClinic = readAllprocedureByClinic;
//update radiology
function updateprocedures(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { procedure, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ id, procedure });
            var testPrice = yield (0, price_1.readoneprice)({ servicetype: procedure });
            if (!testPrice) {
                throw new Error(`${config_1.default.error.errornopriceset}  ${procedure}`);
            }
            //      const {servicetypedetails} = await readallservicetype({category: configuration.category[5]},{type:1,category:1,department:1,_id:0});
            //  var testsetting = servicetypedetails.filter(item => (item.type).includes(procedure));
            /*
            if(!testsetting || testsetting.length < 1){
              throw new Error(`${procedure} donot ${configuration.error.erroralreadyexit} in ${configuration.category[5]} as a service type  `);
          }
              */
            //check that the status is not complete
            var myprocedurestatus = yield (0, procedure_1.readoneprocedure)({ _id: id }, {}, '');
            if (myprocedurestatus.status !== config_1.default.status[9]) {
                throw new Error(`${config_1.default.error.errortasknotpending} `);
            }
            yield (0, payment_1.updatepayment)({ _id: myprocedurestatus.payment }, { paymentype: procedure, amount: Number(testPrice.amount) });
            var queryresult = yield (0, procedure_1.updateprocedure)(id, { procedure, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes });
            //update price
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//process result
//upload patients photo
var uploadprocedureresult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName } = (req.user).user;
        const { id } = req.params;
        var response = yield (0, procedure_1.readoneprocedure)({ _id: id }, {}, 'patient');
        if (response.status !== config_1.default.status[9]) {
            throw new Error(`Procedure Record ${config_1.default.error.errortasknotpending}`);
        }
        const { patient } = response;
        //validate payment
        if (patient.isHMOCover == config_1.default.ishmo[0]) {
            var paymentrecord = yield (0, payment_1.readonepayment)({ _id: response.payment });
            if (paymentrecord.status !== config_1.default.status[3]) {
                throw new Error(config_1.default.error.errorpayment);
            }
        }
        const processby = `${firstName} ${lastName}`;
        const file = req.files.file;
        const { procedureoutcome } = req.body;
        //procedureoutcome
        const fileName = file.name;
        const filename = "procedure" + (0, uuid_1.v4)();
        let allowedextension = ['.jpg', '.png', '.jpeg', '.pdf'];
        let uploadpath = `${process.cwd()}/${config_1.default.useruploaddirectory}`;
        const extension = path.extname(fileName);
        const renamedurl = `${filename}${extension}`;
        //upload pix to upload folder
        yield (0, otherservices_1.uploaddocument)(file, filename, allowedextension, uploadpath);
        //update pix name in patient
        const queryresult = yield (0, procedure_1.updateprocedure)(id, { $push: { procedureresult: renamedurl }, status: config_1.default.status[7], processby, procedureoutcome });
        res.json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        //logger.error(e.message);
        res.json({ status: false, msg: e.message });
    }
});
exports.uploadprocedureresult = uploadprocedureresult;
