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
exports.confirmradiologyorder = exports.uploadradiologyresult = exports.enterradiologyresult = exports.readAllRadiologyoptimized = exports.readAllRadiology = exports.readAllRadiologyByPatient = exports.radiologyorder = void 0;
exports.updateradiologys = updateradiologys;
const mongoose_1 = __importDefault(require("mongoose"));
const otherservices_1 = require("../../utils/otherservices");
const patientmanagement_1 = require("../../dao/patientmanagement");
const appointment_1 = require("../../dao/appointment");
const servicetype_1 = require("../../dao/servicetype");
const radiology_1 = require("../../dao/radiology");
const price_1 = require("../../dao/price");
const payment_1 = require("../../dao/payment");
const hmocategorycover_1 = require("../../dao/hmocategorycover");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
const admissions_1 = require("../../dao/admissions");
const radiology_helper_1 = require("./radiology.helper");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const { ObjectId } = mongoose_1.default.Types;
const config_1 = __importDefault(require("../../config"));
//lab order
var radiologyorder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //accept _id from request
        const { id } = req.params;
        var { testname, note, appointmentid, imageBase64 } = req.body;
        const { firstName, lastName } = (req.user).user;
        const raiseby = `${firstName} ${lastName}`;
        var testid = String(Date.now());
        var testsid = [];
        //var paymentids =[];
        (0, otherservices_1.validateinputfaulsyvalue)({ id, testname, note });
        //find the record in appointment and validate
        const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, 'insurance', '');
        //category
        if (!foundPatient) {
            throw new Error(`Patient donot ${config_1.default.error.erroralreadyexit}`);
        }
        let insurance = yield (0, hmocategorycover_1.readonehmocategorycover)({ hmoId: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.insurance._id, category: config_1.default.category[4] }, { hmopercentagecover: 1 });
        var hmopercentagecover = (_a = insurance === null || insurance === void 0 ? void 0 : insurance.hmopercentagecover) !== null && _a !== void 0 ? _a : 0;
        var appointment;
        if (appointmentid) {
            appointmentid = new ObjectId(appointmentid);
            appointment = yield (0, appointment_1.readoneappointment)({ _id: appointmentid }, {}, '');
            if (!appointment) {
                //create an appointment
                throw new Error(`Appointment donot ${config_1.default.error.erroralreadyexit}`);
            }
        }
        let filename;
        if (imageBase64)
            filename = yield (0, otherservices_1.uploadbase64image)(imageBase64);
        //loop through all test and create record in lab order
        for (var i = 0; i < testname.length; i++) {
            //search for price of test name
            var testPrice = yield (0, price_1.readoneprice)({ servicetype: testname[i] });
            if (!testPrice) {
                throw new Error(`${config_1.default.error.errornopriceset}  ${testname[i]}`);
            }
            let amount = (0, otherservices_1.calculateAmountPaidByHMO)(Number(hmopercentagecover), Number(testPrice.amount));
            //create payment
            //var createpaymentqueryresult =await createpayment({paymentreference:id,paymentype:testname[i],paymentcategory:testsetting[0].category,patient:id,amount:Number(testPrice.amount)})
            let testrecord = yield (0, radiology_1.createradiology)({ hmopercentagecover,
                actualcost: testPrice.amount, note, testname: testname[i], patient: id, testid, raiseby, amount, filename });
            //create testrecordn 
            testsid.push(testrecord._id);
            //paymentids.push(createpaymentqueryresult._id);
        }
        var queryresult = yield (0, patientmanagement_1.updatepatient)(id, { $push: { radiology: testsid } });
        //update appointment with radiology orders
        //radiology
        if (appointmentid) {
            yield (0, appointment_1.updateappointment)(appointment._id, { $push: { radiology: testsid } });
        }
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        console.log("error", error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.radiologyorder = radiologyorder;
//get lab order by patient
const readAllRadiologyByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const queryresult = yield (0, radiology_1.readallradiology)({ patient: id }, {}, 'patient', 'payment');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllRadiologyByPatient = readAllRadiologyByPatient;
//get lab order 
const readAllRadiology = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryresult = yield (0, radiology_1.readallradiology)({}, {}, 'patient', 'payment');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllRadiology = readAllRadiology;
//get lab order 
const readAllRadiologyoptimized = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var { status, firstName, MRN, HMOId, lastName, phoneNumber, testname, testid } = req.query;
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 150;
        const filter = {};
        var statusfilter = status ? { status } : testname ? { testname } : testid ? { testid } : {};
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
        let aggregatequery = [
            {
                $match: statusfilter
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'payment',
                    foreignField: '_id',
                    as: 'payment'
                }
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
                    path: '$payment', // Deconstruct the payment array (from the lookup)
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$patient',
                    preserveNullAndEmptyArrays: true
                } // Deconstruct the patient array (from the lookup)
            },
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    testname: 1,
                    updatedAt: 1,
                    testid: 1,
                    testresult: 1,
                    department: 1,
                    typetestresult: 1,
                    raiseby: 1,
                    firstName: "$patient.firstName",
                    lastName: "$patient.lastName",
                    phoneNumber: "$patient.phoneNumber",
                    MRN: "$patient.MRN",
                    patient: "$patient",
                    HMOId: "$patient.HMOId",
                    HMOName: "$patient.HMOName",
                    payment: "$payment",
                    status: 1,
                }
            },
            {
                $match: filter
            },
        ];
        const queryresult = yield (0, radiology_1.optimizedreadallradiology)(aggregatequery, page, size);
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllRadiologyoptimized = readAllRadiologyoptimized;
//update radiology
function updateradiologys(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            //check that the status is not complete
            var myradiologystatus = yield (0, radiology_1.readoneradiology)({ _id: id }, {}, 'patient');
            if (myradiologystatus.status !== config_1.default.status[13]) {
                throw new Error(`${config_1.default.error.errortasknotpending} `);
            }
            var { testname, note } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ testname, note });
            var testPrice = yield (0, price_1.readoneprice)({ servicetype: testname });
            if (!testPrice) {
                throw new Error(`${config_1.default.error.errornopriceset}  ${testname}`);
            }
            const { servicetypedetails } = yield (0, servicetype_1.readallservicetype)({ category: config_1.default.category[4] }, { type: 1, category: 1, department: 1, _id: 0 });
            var testsetting = servicetypedetails.filter(item => (item.type).includes(testname));
            if (!testsetting || testsetting.length < 1) {
                throw new Error(`${testname} donot ${config_1.default.error.erroralreadyexit} in ${config_1.default.category[4]} as a service type  `);
            }
            // await updatepayment({_id:myradiologystatus.payment},{paymentype:testname,amount:Number(testPrice.amount)});
            var queryresult = yield (0, radiology_1.updateradiology)(id, { testname, note });
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
var enterradiologyresult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName } = (req.user).user;
        const { id } = req.params;
        const { typetestresult } = req.body;
        var response = yield (0, radiology_1.readoneradiology)({ _id: id }, {}, 'patient');
        // validate patient status
        if (response.status !== config_1.default.status[9]) {
            throw new Error(`Radiology Record ${config_1.default.error.errortasknotpending}`);
        }
        const { patient } = response;
        //validate payment
        var findAdmission = yield (0, admissions_1.readoneadmission)({ patient: patient._id, status: { $ne: config_1.default.admissionstatus[5] } }, {}, '');
        if (!findAdmission && patient.isHMOCover == config_1.default.ishmo[0]) {
            var paymentrecord = yield (0, payment_1.readonepayment)({ _id: response.payment });
            if (paymentrecord.status !== config_1.default.status[3]) {
                throw new Error(config_1.default.error.errorpayment);
            }
        }
        const processby = `${firstName} ${lastName}`;
        var queryresult = yield (0, radiology_1.updateradiology)(id, { typetestresult, status: config_1.default.status[7], processby });
        res.json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.json({ status: false, msg: e.message });
    }
});
exports.enterradiologyresult = enterradiologyresult;
//typeresult
//typetestresult
//process result
//upload patients photo
var uploadradiologyresult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName } = (req.user).user;
        const { id } = req.params;
        var response = yield (0, radiology_1.readoneradiology)({ _id: id }, {}, 'patient');
        // validate patient status
        if (response.status !== config_1.default.status[9]) {
            throw new Error(`Radiology Record ${config_1.default.error.errortasknotpending}`);
        }
        const { patient } = response;
        //validate payment
        var findAdmission = yield (0, admissions_1.readoneadmission)({ patient: patient._id, status: { $ne: config_1.default.admissionstatus[5] } }, {}, '');
        if (!findAdmission && patient.isHMOCover == config_1.default.ishmo[0]) {
            var paymentrecord = yield (0, payment_1.readonepayment)({ _id: response.payment });
            if (paymentrecord.status !== config_1.default.status[3]) {
                throw new Error(config_1.default.error.errorpayment);
            }
        }
        const processby = `${firstName} ${lastName}`;
        const file = req.files.file;
        const fileName = file.name;
        const filename = "radiology" + (0, uuid_1.v4)();
        let allowedextension = ['.jpg', '.png', '.jpeg', '.pdf', '.docx', 'doc'];
        let uploadpath = `${process.cwd()}/${config_1.default.useruploaddirectory}`;
        const extension = path.extname(fileName);
        const renamedurl = `${filename}${extension}`;
        //upload pix to upload folder
        yield (0, otherservices_1.uploaddocument)(file, filename, allowedextension, uploadpath);
        //update pix name in patient
        const queryresult = yield (0, radiology_1.updateradiology)(id, { $push: { testresult: renamedurl }, status: config_1.default.status[7], processby });
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
exports.uploadradiologyresult = uploadradiologyresult;
exports.confirmradiologyorder = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { option, remark } = req.body;
    console.log("option", option, "remark", remark);
    const { id } = req.params;
    (0, otherservices_1.validateinputfaulsyvalue)({ id });
    const radiology = yield (0, radiology_1.readoneradiology)({ _id: id }, {}, "patient");
    if (radiology.status !== config_1.default.status[14]) {
        throw new Error(config_1.default.error.errorRadiologyStatus);
    }
    const { patient } = radiology;
    // choose strategy based on isHMOCover
    const strategyFn = !(patient.isHMOCover == config_1.default.ishmo[1] || patient.isHMOCover == true)
        ? radiology_helper_1.SelfPayRadiologyConfirmationStrategy
        : radiology_helper_1.HmoRadiologyConfirmationStrategy;
    const context = (0, radiology_helper_1.RadiologyConfirmationContext)(strategyFn);
    const queryresult = yield context.execute({
        id,
        option,
        remark,
        radiology,
        patient,
    });
    res.status(200).json({ queryresult, status: true });
}));
