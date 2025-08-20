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
exports.updatePatientFluidBalancing = exports.updatePatientClinicalInformation = exports.updatePatientToHmo = exports.uploadpix = exports.updatepatients = exports.createpatients = void 0;
exports.searchpartient = searchpartient;
exports.getallhmopatients = getallhmopatients;
exports.bulkuploadhmopatients = bulkuploadhmopatients;
exports.updateauthorizationcode = updateauthorizationcode;
exports.getallpatients = getallpatients;
exports.getonepatients = getonepatients;
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const path = __importStar(require("path"));
const hmomanagement_1 = require("../../dao/hmomanagement");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../../config"));
const price_1 = require("../../dao/price");
const payment_1 = require("../../dao/payment");
const otherservices_1 = require("../../utils/otherservices");
const appointment_1 = require("../../dao/appointment");
const audit_1 = require("../../dao/audit");
const patientmanagement_1 = require("../../dao/patientmanagement");
const hmocategorycover_1 = require("../../dao/hmocategorycover");
const errors_1 = require("../../errors");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
//search patients 
function searchpartient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //var settings = await configuration.settings();
            var selectquery = {
                "title": 1, "firstName": 1, "status": 1, "middleName": 1, "lastName": 1, "country": 1, "stateOfResidence": 1, "LGA": 1, "address": 1, "age": 1, "dateOfBirth": 1, "gender": 1, "nin": 1, "phoneNumber": 1, "email": 1, "oldMRN": 1, "nextOfKinName": 1, "nextOfKinRelationship": 1, "nextOfKinPhoneNumber": 1, "nextOfKinAddress": 1,
                "maritalStatus": 1, "disability": 1, "occupation": 1, "isHMOCover": 1, "HMOName": 1, "HMOId": 1, "HMOPlan": 1, "MRN": 1, "createdAt": 1, "passport": 1
            };
            const { searchparams } = req.params;
            const queryresult = yield (0, patientmanagement_1.readallpatient)({
                $or: [
                    // { lastName: { $regex: searchparams, $options: 'i' } },
                    // { firstName: { $regex: searchparams, $options: 'i' } },
                    {
                        "$expr": {
                            "$regexMatch": {
                                "input": {
                                    "$concat": [
                                        { "$ifNull": ["$firstName", ""] },
                                        " ",
                                        { "$ifNull": ["$lastName", ""] }
                                    ]
                                },
                                "regex": searchparams,
                                "options": "i"
                            }
                        }
                    },
                    { HMOId: { $regex: searchparams, $options: 'i' } },
                    { MRN: { $regex: searchparams, $options: 'i' } },
                    { phoneNumber: { $regex: searchparams, $options: 'i' } }
                ]
            }, selectquery, '', '');
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
        }
    });
}
function getallhmopatients(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //var settings = await configuration.settings();
            var selectquery = {
                "title": 1, "firstName": 1, "status": 1, "middleName": 1, "lastName": 1, "country": 1, "stateOfResidence": 1, "LGA": 1, "address": 1, "age": 1, "dateOfBirth": 1, "gender": 1, "nin": 1, "phoneNumber": 1, "email": 1, "oldMRN": 1, "nextOfKinName": 1, "nextOfKinRelationship": 1, "nextOfKinPhoneNumber": 1, "nextOfKinAddress": 1,
                "maritalStatus": 1, "subscriptionPaidUntil": 1, "disability": 1, "occupation": 1, "isHMOCover": 1, "HMOName": 1, "HMOId": 1, "HMOPlan": 1, "MRN": 1, "createdAt": 1, "passport": 1
            };
            //var populatequery="payment";
            const queryresult = yield (0, patientmanagement_1.readallpatient)({ isHMOCover: config_1.default.ishmo[1] }, selectquery, '', '');
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//bulk upload users
function bulkuploadhmopatients(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { firstName, lastName } = (req.user).user;
            var actor = `${firstName} ${lastName}`;
            const file = req.files.file;
            const { HMOName } = req.body;
            const filename = config_1.default.hmouploadfilename;
            let allowedextension = ['.csv', '.xlsx'];
            let uploadpath = `${process.cwd()}/${config_1.default.useruploaddirectory}`;
            //acieve document
            yield (0, patientmanagement_1.updatepatientmanybyquery)({ HMOName }, { status: config_1.default.status[15] });
            const gethmo = yield (0, hmomanagement_1.readonehmomanagement)({ hmoname: HMOName }, { _id: 1, hmopercentagecover: 1 });
            if (!gethmo) {
                throw new Error("HMONAME does not exist");
            }
            //await createpatientachieve(patientdetails);
            //delete patient management
            //await deletePatietsByCondition({HMOName});
            var columnmapping = {
                A: "title",
                B: "firstName",
                C: "middleName",
                D: "lastName",
                E: "country",
                F: "stateOfResidence",
                G: "LGA",
                H: "address",
                I: "age",
                J: "dateOfBirth",
                K: "gender",
                L: "nin",
                M: "phoneNumber",
                N: "email",
                O: "oldMRN",
                P: "nextOfKinName",
                Q: "nextOfKinRelationship",
                R: "nextOfKinPhoneNumber",
                S: "nextOfKinAddress",
                T: "maritalStatus",
                U: "disability",
                V: "occupation",
                W: "HMOPlan",
                X: "HMOId"
            };
            yield (0, otherservices_1.uploaddocument)(file, filename, allowedextension, uploadpath);
            //convert uploaded excel to json
            var convert_to_json = (0, otherservices_1.convertexceltojson)(`${uploadpath}/${filename}${path.extname(file.name)}`, config_1.default.hmotemplate, columnmapping);
            //save to database
            var { hmo } = convert_to_json;
            if (hmo.length > 0) {
                for (var i = 0; i < hmo.length; i++) {
                    hmo[i].isHMOCover = config_1.default.ishmo[1];
                    hmo[i].HMOName = HMOName;
                    hmo[i].insurance = gethmo._id;
                    const { phoneNumber, firstName, lastName, gender, HMOId } = hmo[i];
                    (0, otherservices_1.validateinputfaulsyvalue)({ phoneNumber, firstName, lastName, gender, HMOId });
                    console.log((phoneNumber.toString()).length);
                    if ((phoneNumber.toString()).length !== 11 && (phoneNumber.toString()).length !== 10) {
                        throw new Error(`${phoneNumber} ${config_1.default.error.errorelevendigit}`);
                    }
                    if (hmo[i].dateOfBirth)
                        hmo[i].age = (0, moment_1.default)().diff((0, moment_1.default)(hmo[i].dateOfBirth), 'years');
                    //if not dateObirth but age calculate date of birth
                    if (!hmo[i].dateOfBirth && hmo[i].age)
                        hmo[i].dateOfBirth = (0, moment_1.default)().subtract(Number(hmo[i].age), 'years').format('YYYY-MM-DD');
                    /*
                    const foundUser:any =  await readonepatient({phoneNumber},{},'','');
                    //category
                    if(foundUser && phoneNumber !== configuration.defaultphonenumber){
                        throw new Error(`Patient ${configuration.error.erroralreadyexit}`);
             
                    }
                        */
                    var uniqunumber = yield (0, otherservices_1.storeUniqueNumber)(4);
                    // chaorten the MRN to alphanumeric 
                    hmo[i].MRN = uniqunumber;
                    hmo[i].status = config_1.default.status[1];
                    hmo[i].password = config_1.default.defaultPassword;
                    const createpatientqueryresult = yield (0, patientmanagement_1.createpatientifnotexit)({ HMOId: hmo[i].HMOId, HMOName }, hmo[i]);
                }
            }
            yield (0, audit_1.createaudit)({ action: "Bulk Uploaded HMO Patient", actor, affectedentity: HMOName });
            res.status(200).json({ status: true, queryresult: 'Bulk upload was successfull' });
        }
        catch (e) {
            //logger.error(e.message);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//update authorization code
function updateauthorizationcode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { authorizationcode } = req.body;
            var queryresult = yield (0, patientmanagement_1.updatepatient)(id, { authorizationcode });
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
//add patiient
var createpatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { alternatePhoneNumber, bloodGroup, genotype, bp, heartRate, temperature } = req.body;
        var appointmentid = String(Date.now());
        if (!(req.body.isHMOCover)) {
            req.body.isHMOCover = config_1.default.ishmo[0];
        }
        if (!(req.body.isHMOCover == config_1.default.ishmo[1] || req.body.isHMOCover == true)) {
            delete req.body.authorizationcode;
            delete req.body.facilitypateintreferedfrom;
        }
        req.body.appointmentcategory = config_1.default.category[3];
        req.body.appointmenttype = config_1.default.category[3];
        var { facilitypateintreferedfrom, authorizationcode, policecase, physicalassault, sexualassault, policaename, servicenumber, policephonenumber, division, dateOfBirth, phoneNumber, firstName, lastName, gender, clinic, reason, appointmentdate, appointmentcategory, appointmenttype, isHMOCover, HMOName, HMOId, HMOPlan } = req.body;
        //validation
        (0, otherservices_1.validateinputfaulsyvalue)({ phoneNumber, firstName, lastName, gender, isHMOCover });
        //define the service type
        if (authorizationcode) {
            req.body.patienttype = config_1.default.patienttype[1];
        }
        let gethmo;
        //define the service type
        if (isHMOCover == config_1.default.ishmo[1] || isHMOCover == true) {
            (0, otherservices_1.validateinputfaulsyvalue)({ HMOName, HMOId, HMOPlan });
            gethmo = yield (0, hmomanagement_1.readonehmomanagement)({ hmoname: req.body.HMOName }, { _id: 1, hmopercentagecover: 1 });
            if (!gethmo) {
                throw new Error("HMONAME does not exist");
            }
            req.body.insurance = gethmo._id;
        }
        //get token from header and extract clinic
        //check for 11 digit
        if (phoneNumber.length !== 11) {
            throw new Error(config_1.default.error.errorelevendigit);
        }
        if (alternatePhoneNumber && alternatePhoneNumber.length !== 11) {
            throw new Error(config_1.default.error.errorelevendigit);
        }
        if (dateOfBirth)
            req.body.age = (0, moment_1.default)().diff((0, moment_1.default)(dateOfBirth), 'years');
        //if not dateObirth but age calculate date of birth
        if (!dateOfBirth && req.body.age)
            req.body.dateOfBirth = (0, moment_1.default)().subtract(Number(req.body.age), 'years').format('YYYY-MM-DD');
        var selectquery = {
            "title": 1, "firstName": 1, "middleName": 1, "lastName": 1, "country": 1, "stateOfResidence": 1, "LGA": 1, "address": 1, "age": 1, "dateOfBirth": 1, "gender": 1, "nin": 1, "phoneNumber": 1, "email": 1, "oldMRN": 1, "nextOfKinName": 1, "nextOfKinRelationship": 1, "nextOfKinPhoneNumber": 1, "nextOfKinAddress": 1,
            "maritalStatus": 1, "disability": 1, "occupation": 1, "isHMOCover": 1, "HMOName": 1, "HMOId": 1, "HMOPlan": 1, "MRN": 1, "createdAt": 1, "passport": 1
        };
        const foundUser = yield (0, patientmanagement_1.readonepatient)({ phoneNumber }, selectquery, '', '');
        //category
        if (foundUser && phoneNumber !== config_1.default.defaultphonenumber) {
            throw new Error(`Patient ${config_1.default.error.erroralreadyexit}`);
        }
        var { isHMOCover } = req.body;
        var [newRegistrationPrice, annualsubscriptionnewRegistrationPrice, cardfeenewRegistrationPrice] = yield Promise.all([
            (0, price_1.readoneprice)({
                servicecategory: config_1.default.category[3],
                servicetype: config_1.default.category[3]
            }),
            (0, price_1.readoneprice)({
                servicecategory: config_1.default.category[8],
                servicetype: config_1.default.category[8]
            }),
            (0, price_1.readoneprice)({
                servicecategory: config_1.default.category[9],
                servicetype: config_1.default.category[9]
            })
        ]);
        //use age to calculate price
        if (!newRegistrationPrice || !annualsubscriptionnewRegistrationPrice || !cardfeenewRegistrationPrice) {
            throw new Error(`Price for ${config_1.default.category[3]}  or ${config_1.default.category[8]} or ${config_1.default.category[9]} is not set`);
        }
        const clinicalInformation = {
            bloodGroup, genotype, bp, heartRate, temperature
        };
        req.body.clinicalInformation = clinicalInformation;
        var uniqunumber = yield (0, otherservices_1.storeUniqueNumber)(4);
        // chaorten the MRN to alphanumeric 
        req.body.MRN = uniqunumber;
        req.body.password = config_1.default.defaultPassword;
        //other validations
        var payment = [];
        //create payment
        //create payment for only none hmo patient
        let queryappointmentresult;
        let queryresult;
        let vitals;
        const [insurance, annualsubscription, cardfee] = yield Promise.all([
            (0, hmocategorycover_1.readonehmocategorycover)({ hmoId: gethmo === null || gethmo === void 0 ? void 0 : gethmo._id, category: config_1.default.category[3] }, { hmopercentagecover: 1 }),
            (0, hmocategorycover_1.readonehmocategorycover)({ hmoId: gethmo === null || gethmo === void 0 ? void 0 : gethmo._id, category: config_1.default.category[8] }, { hmopercentagecover: 1 }),
            (0, hmocategorycover_1.readonehmocategorycover)({ hmoId: gethmo === null || gethmo === void 0 ? void 0 : gethmo._id, category: config_1.default.category[9] }, { hmopercentagecover: 1 })
        ]);
        var hmopercentagecover = (_a = insurance === null || insurance === void 0 ? void 0 : insurance.hmopercentagecover) !== null && _a !== void 0 ? _a : 0;
        var annualsubscriptionhmopercentagecover = (_b = annualsubscription === null || annualsubscription === void 0 ? void 0 : annualsubscription.hmopercentagecover) !== null && _b !== void 0 ? _b : 0;
        var cardfeehmopercentagecover = (_c = cardfee === null || cardfee === void 0 ? void 0 : cardfee.hmopercentagecover) !== null && _c !== void 0 ? _c : 0;
        var amount = (0, otherservices_1.calculateAmountPaidByHMO)(Number(hmopercentagecover), Number(newRegistrationPrice.amount));
        var annualsubscriptionamount = (0, otherservices_1.calculateAmountPaidByHMO)(Number(annualsubscriptionhmopercentagecover), Number(annualsubscriptionnewRegistrationPrice.amount));
        var cardfeeamountamount = (0, otherservices_1.calculateAmountPaidByHMO)(Number(cardfeehmopercentagecover), Number(cardfeenewRegistrationPrice.amount));
        //var annualsubscriptionamount =calculateAmountPaidByHMO(Number(hmopercentagecover), Number(newRegistrationPrice.amount));
        //var cardfeeamount =calculateAmountPaidByHMO(Number(hmopercentagecover), Number(newRegistrationPrice.amount));
        if (amount == 0 && annualsubscriptionamount == 0 && cardfeeamountamount == 0) {
            req.body.status = config_1.default.status[1];
        }
        const createpatientqueryresult = yield (0, patientmanagement_1.createpatient)(req.body);
        if (amount == 0 && annualsubscriptionamount == 0 && cardfeeamountamount == 0) {
            if (appointmentdate) {
                queryappointmentresult = yield (0, appointment_1.createappointment)({ policecase, physicalassault, sexualassault, policaename, servicenumber, policephonenumber, division, appointmentid, patient: createpatientqueryresult._id, clinic, reason, appointmentdate, appointmentcategory, appointmenttype, vitals: vitals._id, firstName, lastName, MRN: createpatientqueryresult === null || createpatientqueryresult === void 0 ? void 0 : createpatientqueryresult.MRN, HMOId: createpatientqueryresult === null || createpatientqueryresult === void 0 ? void 0 : createpatientqueryresult.HMOId, HMOName: createpatientqueryresult === null || createpatientqueryresult === void 0 ? void 0 : createpatientqueryresult.HMOName });
                queryresult = yield (0, patientmanagement_1.updatepatient)(createpatientqueryresult._id, { $push: { appointment: queryappointmentresult._id } });
            }
        }
        else {
            //add year suscription fee
            //add 
            const [createpaymentqueryresult, annualsubscriptioncreatepaymentqueryresult, cardfeecreatepaymentqueryresult] = yield Promise.all([
                (0, payment_1.createpayment)({
                    firstName,
                    lastName,
                    MRN: req.body.MRN,
                    phoneNumber,
                    paymentreference: req.body.MRN,
                    paymentype: newRegistrationPrice.servicetype,
                    paymentcategory: newRegistrationPrice.servicecategory,
                    patient: createpatientqueryresult._id,
                    amount
                }),
                (0, payment_1.createpayment)({
                    firstName,
                    lastName,
                    MRN: req.body.MRN,
                    phoneNumber,
                    paymentreference: req.body.MRN,
                    paymentype: annualsubscriptionnewRegistrationPrice.servicetype,
                    paymentcategory: annualsubscriptionnewRegistrationPrice.servicecategory,
                    patient: createpatientqueryresult._id,
                    amount: annualsubscriptionamount
                }),
                (0, payment_1.createpayment)({
                    firstName,
                    lastName,
                    MRN: req.body.MRN,
                    phoneNumber,
                    paymentreference: req.body.MRN,
                    paymentype: cardfeenewRegistrationPrice.servicetype,
                    paymentcategory: cardfeenewRegistrationPrice.servicecategory,
                    patient: createpatientqueryresult._id,
                    amount: cardfeeamountamount
                })
            ]);
            // const createappointmentpaymentqueryresult =await createpayment({paymentreference:appointmentid,paymentype:appointmenttype,paymentcategory:appointmentcategory,patient:createpatientqueryresult._id,amount:Number(appointmentPrice.amount)})
            payment.push(createpaymentqueryresult._id);
            payment.push(annualsubscriptioncreatepaymentqueryresult._id);
            payment.push(cardfeecreatepaymentqueryresult._id);
            //payment.push(createappointmentpaymentqueryresult._id);
            //update createpatientquery
            if (appointmentdate) {
                queryappointmentresult = yield (0, appointment_1.createappointment)({ policecase, physicalassault, sexualassault, policaename, servicenumber, policephonenumber, division, status: config_1.default.status[5], appointmentid, payment: createpaymentqueryresult._id, patient: createpatientqueryresult._id, clinic, reason, appointmentdate, appointmentcategory, appointmenttype, vitals: vitals._id, MRN: createpatientqueryresult === null || createpatientqueryresult === void 0 ? void 0 : createpatientqueryresult.MRN, HMOId: createpatientqueryresult === null || createpatientqueryresult === void 0 ? void 0 : createpatientqueryresult.HMOId, HMOName: createpatientqueryresult === null || createpatientqueryresult === void 0 ? void 0 : createpatientqueryresult.HMOName });
                queryresult = yield (0, patientmanagement_1.updatepatient)(createpatientqueryresult._id, { payment, $push: { appointment: queryappointmentresult._id } });
            }
        }
        res.status(200).json({
            queryresult: appointmentdate ? queryresult : createpatientqueryresult,
            status: true
        });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.createpatients = createpatients;
//read all patients
function getallpatients(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //apply pagination
            const page = parseInt(req.query.page) || 1;
            const size = parseInt(req.query.size) || 150;
            const filter = {};
            // Add filters based on query parameters
            if (req.query.firstName) {
                //console.log(req.query.firstName)
                filter.firstName = new RegExp(req.query.firstName, 'i'); // Case-insensitive search for name
            }
            if (req.query.MRN) {
                filter.MRN = new RegExp(req.query.MRN, 'i');
            }
            if (req.query.HMOId) {
                filter.HMOId = new RegExp(req.query.HMOId, 'i'); // Case-insensitive search for email
            }
            if (req.query.lastName) {
                filter.lastName = new RegExp(req.query.lastName, 'i'); // Case-insensitive search for email
            }
            if (req.query.phoneNumber) {
                filter.phoneNumber = new RegExp(req.query.phoneNumber, 'i'); // Case-insensitive search for email
            }
            if (req.query.email) {
                filter.email = new RegExp(req.query.email, 'i'); // Case-insensitive search for email
            }
            //var settings = await configuration.settings();
            var selectquery = {
                "title": 1, "firstName": 1, "status": 1, "middleName": 1, "lastName": 1, "country": 1, "stateOfResidence": 1, "LGA": 1, "address": 1, "age": 1, "dateOfBirth": 1, "gender": 1, "nin": 1, "phoneNumber": 1, "email": 1, "oldMRN": 1, "nextOfKinName": 1, "nextOfKinRelationship": 1, "nextOfKinPhoneNumber": 1, "nextOfKinAddress": 1,
                "maritalStatus": 1, "disability": 1, "subscriptionPaidUntil": 1, "occupation": 1, "isHMOCover": 1, "HMOName": 1, "HMOId": 1, "HMOPlan": 1, "MRN": 1, "createdAt": 1, "passport": 1, "authorizationcode": 1, "patienttype": 1
            };
            //var populatequery="payment";
            var populatequery = {
                path: "payment",
                // match: { paymentcategory: { $eq: settings.servicecategory[0].category } },
                match: { paymentcategory: { $eq: config_1.default.category[3] } },
                select: {
                    status: 1,
                    paymentype: 1
                },
            };
            var populateappointmentquery = "appointment";
            const queryresult = yield (0, patientmanagement_1.readallpatientpaginated)(filter, selectquery, populatequery, populateappointmentquery, page, size);
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//get record for a particular patient
function getonepatients(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            var selectquery = {
                "title": 1, "firstName": 1, "middleName": 1, "lastName": 1, "country": 1, "stateOfResidence": 1, "LGA": 1, "address": 1, "age": 1, "dateOfBirth": 1, "gender": 1, "nin": 1, "phoneNumber": 1, "email": 1, "oldMRN": 1, "nextOfKinName": 1, "nextOfKinRelationship": 1, "nextOfKinPhoneNumber": 1, "nextOfKinAddress": 1,
                "maritalStatus": 1, "disability": 1, "occupation": 1, "isHMOCover": 1, "HMOName": 1, "HMOId": 1, "HMOPlan": 1, "MRN": 1, "createdAt": 1, "passport": 1
            };
            var populatequery = 'payment';
            const queryresult = yield (0, patientmanagement_1.readonepatient)({ _id: id }, selectquery, populatequery, 'appointment');
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
//update a patient
exports.updatepatients = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get id
    const { id, status } = req.params;
    const { bloodGroup, genotype, bp, heartRate, temperature, specialNeeds } = req.body;
    //reject if status update
    if (status) {
    }
    if (!id)
        return next(new errors_1.ApiError(400, "Patient Id is not provided!"));
    const _Id = new mongoose_1.default.Types.ObjectId(id);
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: _Id }, {}, '', '');
    if (!foundPatient) {
        return next(new errors_1.ApiError(404, `Patient do not ${config_1.default.error.erroralreadyexit}`));
    }
    const clinicalInformation = {
        bloodGroup, genotype, bp, heartRate, temperature
    };
    req.body.clinicalInformation = clinicalInformation;
    var queryresult = yield (0, patientmanagement_1.updatepatient)(id, req.body);
    if (!queryresult)
        return next(new errors_1.ApiError(401, "update failed"));
    res.status(200).json({
        queryresult,
        status: true
    });
}));
//upload patients photo
var uploadpix = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.files);
        const file = req.files.file;
        const fileName = file.name;
        const filename = "patientpassport" + (0, uuid_1.v4)();
        let allowedextension = ['.jpg', '.png', '.jpeg'];
        let uploadpath = `${process.cwd()}/${config_1.default.useruploaddirectory}`;
        const extension = path.extname(fileName);
        const renamedurl = `${filename}${extension}`;
        //upload pix to upload folder
        yield (0, otherservices_1.uploaddocument)(file, filename, allowedextension, uploadpath);
        const { id } = req.params;
        //update pix name in patient
        const queryresult = yield (0, patientmanagement_1.updatepatient)(id, { passport: renamedurl });
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
exports.uploadpix = uploadpix;
exports.updatePatientToHmo = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return next(new errors_1.ApiError(400, "Patient Id is not provided!"));
    //const _appointmentId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(appointmentId);
    const _Id = new mongoose_1.default.Types.ObjectId(id);
    ///Step 2: Read the Appointment and populate the patient field.
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: _Id }, {}, '', '');
    /// fetch patient info
    if (!foundPatient) {
        return next(new errors_1.ApiError(404, `Patient do not ${config_1.default.error.erroralreadyexit}`));
    }
    /// check if patient hmo is false
    if (foundPatient.isHMOCover === config_1.default.ishmo[1]) {
        return next(new errors_1.ApiError(401, `patient already has an HMO`));
    }
    /// if hmo is true return an error
    /// then convert to true
    const updatedPatient = yield (0, patientmanagement_1.updatepatient)(id, { isHMOCover: config_1.default.ishmo[1], previouslyNotHmo: true });
    /// save db
    res.status(200).json({
        status: true,
        message: "patient hmo info updated successfully",
        data: updatedPatient
    });
}));
exports.updatePatientClinicalInformation = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { bloodGroup, genotype, bp, heartRate, temperature, specialNeeds } = req.body;
    if (!id)
        return next(new errors_1.ApiError(400, "Patient Id is not provided!"));
    const _Id = new mongoose_1.default.Types.ObjectId(id);
    const { _id: userId } = (req.user).user;
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: _Id }, {}, '', '');
    if (!foundPatient) {
        return next(new errors_1.ApiError(404, `Patient do not ${config_1.default.error.erroralreadyexit}`));
    }
    const clinicalInformation = {
        bloodGroup, genotype, bp, heartRate, temperature
    };
    const updatedPatient = yield (0, patientmanagement_1.updatepatientbyanyquery)(_Id, {
        clinicalInformation: clinicalInformation,
        specialNeeds,
        updatedBy: userId
    });
    res.status(200).json({
        status: true,
        data: updatedPatient
    });
}));
exports.updatePatientFluidBalancing = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalInput, totalOutput } = req.body;
    const { patientId } = req.params;
    const { _id: userId } = (req.user).user;
    if (!patientId) {
        return next(new errors_1.ApiError(400, config_1.default.error.errorPatientIdIsRequired));
    }
    const _patientId = new mongoose_1.default.Types.ObjectId(patientId);
    const patient = yield (0, patientmanagement_1.readonepatient)({ _id: _patientId }, {}, '', '');
    if (!patient) {
        return next(new errors_1.ApiError(404, "Patient not found."));
    }
    const balance = (totalInput || 0) - (totalOutput || 0);
    const newFluidRecord = {
        totalInput,
        totalOutput,
        balance,
        createdBy: userId,
    };
    const updatedPatient = yield (0, patientmanagement_1.updatepatientbyanyquery)(_patientId, {
        $push: {
            fluidBalance: newFluidRecord
        }
    });
    res.status(200).json({
        status: true,
        data: updatedPatient
    });
}));
