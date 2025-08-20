"use strict";
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
exports.labresultprocessinghemathologychemicalpathology = exports.readallscheduledlaboptimizedhemathologyandchemicalpathology = exports.sorthemathologyandchemicalpathology = exports.confirmlaborder = exports.listlabreportbypatient = exports.printlabreport = exports.listlabreport = exports.readallscheduledlaboptimized = exports.readallscheduledlab = exports.readAllLabByPatient = exports.readalllabb = void 0;
exports.labresultprocessing = labresultprocessing;
const lab_1 = require("../../dao/lab");
const otherservices_1 = require("../../utils/otherservices");
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const users_1 = require("../../dao/users");
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const lab_helper_1 = require("./lab.helper");
const lab_helper_2 = require("./lab.helper");
//adjust lab to view from department
// Get all lab records
const readalllabb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        //const queryresult = await readalllab({department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, lab_1.readalllab)({}, {}, 'patient', 'appointment', 'payment');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readalllabb = readalllabb;
//get lab order by patient
const readAllLabByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { id } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, lab_1.readalllab)({ patient: id }, {}, 'patient', 'appointment', 'payment');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllLabByPatient = readAllLabByPatient;
//lab processing
function labresultprocessing(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { subcomponents } = req.body;
            const { email, staffId } = (req.user).user;
            //find id and validate
            var lab = yield (0, lab_1.readonelab)({ _id: id }, {}, '');
            //if not lab or status !== scheduled return error
            if (!lab || lab.status !== config_1.default.status[5]) {
                throw new Error(config_1.default.error.errorservicetray);
            }
            (0, otherservices_1.validateinputfaulsyvalue)({ lab, subcomponents });
            const user = yield (0, users_1.readone)({ email, staffId });
            //loop through array of subcomponent 
            for (var i = 0; i < subcomponents.length; i++) {
                //throw error if no subcomponent
                const { subcomponent, result, nranges, unit } = subcomponents[i];
                // validateinputfaulsyvalue({subcomponent,result,nranges,unit})
                (0, otherservices_1.validateinputfaulsyvalue)({ subcomponent });
            }
            var processeddate = new Date();
            //update test, lab technical name and test status
            var queryresult = yield (0, lab_1.updatelab)({ _id: id }, { $push: { testresult: subcomponents }, status: config_1.default.status[7], processeddate, staffname: user === null || user === void 0 ? void 0 : user._id });
            //update status of appointment
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
//view all schedule lab
// Get all lab records
const readallscheduledlab = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clinic } = (req.user).user;
        //const queryresult = await readalllab({department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, lab_1.readalllab)({ $or: [{ status: config_1.default.status[5] }, { status: config_1.default.status[13] }, { status: config_1.default.status[14] }], department: clinic }, {}, 'patient', 'appointment', 'payment');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readallscheduledlab = readallscheduledlab;
const readallscheduledlaboptimized = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var { status, firstName, MRN, HMOId, lastName, phoneNumber, testname } = req.query;
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 150;
        const filter = {};
        var statusfilter = status ? { status } : testname ? { testname } : {};
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
                } // Deconstruct the patient array (from the lookup)
            },
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    testresult: 1,
                    testname: 1,
                    updatedAt: 1,
                    testid: 1,
                    department: 1,
                    firstName: "$patient.firstName",
                    lastName: "$patient.lastName",
                    phoneNumber: "$patient.phoneNumber",
                    MRN: "$patient.MRN",
                    patient: "$patient",
                    HMOId: "$patient.HMOId",
                    HMOName: "$patient.HMOName",
                    status: 1,
                }
            },
            {
                $match: filter
            },
        ];
        const queryresult = yield (0, lab_1.optimizedreadalllab)(aggregatequery, page, size);
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readallscheduledlaboptimized = readallscheduledlaboptimized;
//lab reports
const listlabreport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // find related
        const { clinic } = (req.user).user;
        const query = { status: config_1.default.status[7], department: clinic };
        const queryresult = yield (0, lab_1.readlabaggregate)([
            {
                $lookup: {
                    from: "appointments",
                    localField: "appointment",
                    foreignField: "_id",
                    as: "appointments",
                },
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
                $match: query,
            },
            {
                $group: {
                    _id: "$appointment",
                    MRN: { $first: { $first: "$patient.MRN" } },
                    firstName: { $first: { $first: "$patient.firstName" } },
                    lastName: { $first: { $first: "$patient.lastName" } },
                    phoneNumber: { $first: { $first: "$patient.phoneNumber" } },
                    appointmentid: { $first: "$appointmentid" },
                    //appointmentid: {$first: {$first:"$appointments.appointmentid"}},
                    appointmentdate: { $first: { $first: "$appointments.appointmentdate" } },
                    createdAt: { $first: "$createdAt" }
                },
            },
            { $sort: { createdAt: -1 } },
        ]);
        res.json({
            queryresult,
            status: true,
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.listlabreport = listlabreport;
//print lab report
const printlabreport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        //const queryresult = await readalllab({department:clinic},{},'patient','appointment','payment');
        var populatequery = {
            path: "staffname",
            select: {
                firstName: 1,
                middleName: 1,
                _id: 0
            },
        };
        var patientpopulatequery = {
            path: "patient",
            select: {
                MRN: 1,
                firstName: 1,
                lastName: 1,
                age: 1,
                gender: 1
                //_id:0
            },
        };
        const { id } = req.params;
        const queryresult = yield (0, lab_1.readalllab)({ appointment: id, testresult: { $exists: true, $not: { $size: 0 } } }, { testname: 1, testid: 1, testresult: 1, status: 1, appointmentid: 1, createdAt: 1, processeddate: 1 }, populatequery, patientpopulatequery, '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.printlabreport = printlabreport;
//list lab report by patient
//lab reports
const listlabreportbypatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const objectId = new ObjectId(id);
        // find related
        //const query = { patient._id:id};
        const query = { patient: objectId, status: config_1.default.status[7] };
        const queryresult = yield (0, lab_1.readlabaggregate)([
            {
                $match: query,
            },
            {
                $lookup: {
                    from: "appointments",
                    localField: "appointment",
                    foreignField: "_id",
                    as: "appointments",
                },
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
                    _id: "$appointment",
                    MRN: { $first: { $first: "$patient.MRN" } },
                    firstName: { $first: { $first: "$patient.firstName" } },
                    lastName: { $first: { $first: "$patient.lastName" } },
                    phoneNumber: { $first: { $first: "$patient.phoneNumber" } },
                    appointmentid: { $first: { $first: "$appointments.appointmentid" } },
                    appointmentdate: { $first: { $first: "$appointments.appointmentdate" } }
                },
            },
            { $sort: { createdAt: -1 } },
        ]);
        res.json({
            queryresult,
            status: true,
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.listlabreportbypatient = listlabreportbypatient;
//this endpoint is use to accept or reject lab order
//isHMOCover: { $eq: configuration.ishmo[0] }
exports.confirmlaborder = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { option, remark } = req.body;
    const { id } = req.params;
    (0, otherservices_1.validateinputfaulsyvalue)({ id });
    const lab = yield (0, lab_1.readonelab)({ _id: id }, {}, "patient");
    if (lab.status !== config_1.default.status[14]) {
        throw new Error(config_1.default.error.errorLabStatus);
    }
    const { patient } = lab;
    // choose strategy based on isHMOCover
    const strategyFn = !(patient.isHMOCover == config_1.default.ishmo[1] || patient.isHMOCover == true)
        ? lab_helper_1.HmoLabConfirmationStrategy
        : lab_helper_1.SelfPayLabConfirmationStrategy;
    const context = (0, lab_helper_2.LabConfirmationContext)(strategyFn);
    const queryresult = yield context.execute({
        id,
        option,
        remark,
        lab,
        patient
    });
    res.status(200).json({ queryresult, status: true });
}));
// differentiate hemathology and histopathology
exports.sorthemathologyandchemicalpathology = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { labcategory } = req.body;
    const { email } = (req.user).user;
    var status;
    if (labcategory == config_1.default.labcategory[0]) {
        status = config_1.default.hematologyandchemicalpathologystatus[0];
    }
    else if (labcategory == config_1.default.labcategory[1]) {
        status = config_1.default.hematologyandchemicalpathologystatus[1];
    }
    else {
        throw new Error("Wrong Lab Category detected");
    }
    //find id and validate
    var lab = yield (0, lab_1.readonelab)({ _id: id }, {}, '');
    //if not lab or status !== scheduled return error
    if (!lab || lab.status !== config_1.default.status[5]) {
        throw new Error(config_1.default.error.errorservicetray);
    }
    (0, otherservices_1.validateinputfaulsyvalue)({ lab, labcategory });
    var sortbydate = new Date();
    var queryresult = yield (0, lab_1.updatelab)({ _id: id }, { status, labcategory, sortbydate, sortby: email });
    //update status of appointment
    res.status(200).json({
        queryresult,
        status: true
    });
}));
// get all scheduled hemathology and chemical pathology
exports.readallscheduledlaboptimizedhemathologyandchemicalpathology = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var { status, firstName, MRN, HMOId, lastName, phoneNumber, testname, labcategory } = req.query;
    (0, otherservices_1.validateinputfaulsyvalue)({ labcategory });
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    const filter = {};
    var statusfilter = status ? { status } : testname ? { testname } : {};
    statusfilter.labcategory = labcategory;
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
            } // Deconstruct the patient array (from the lookup)
        },
        {
            $project: {
                _id: 1,
                createdAt: 1,
                testname: 1,
                updatedAt: 1,
                testid: 1,
                department: 1,
                chemicalpathologyreport: 1,
                peripheralbloodfilmreport: 1,
                testresult: 1,
                ADHbonemarrowaspirationreport: 1,
                firstName: "$patient.firstName",
                lastName: "$patient.lastName",
                phoneNumber: "$patient.phoneNumber",
                MRN: "$patient.MRN",
                patient: "$patient",
                HMOId: "$patient.HMOId",
                HMOName: "$patient.HMOName",
                status: 1,
            }
        },
        {
            $match: filter
        },
    ];
    const queryresult = yield (0, lab_1.optimizedreadalllab)(aggregatequery, page, size);
    res.status(200).json({
        queryresult,
        status: true
    });
}));
//process hemathology and chemical pathology result
//lab processing
exports.labresultprocessinghemathologychemicalpathology = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get id
    const { id } = req.params;
    var { labreporttypehematologychemicalpathology } = req.query;
    (0, otherservices_1.validateinputfaulsyvalue)({ labreporttypehematologychemicalpathology });
    const { comment, summary, redbloodcell, whitebloodcell, platelet, impression, suggestion } = req.body;
    const { clinicalnotes, boneconsistency, aspiration, erythroidratio, erythropoiesis, leucopoesis, megakaryopoiesis, plasmacells, abnomalcells, ironstore, conclusion } = req.body;
    const { firstName, lastName } = (req.user).user;
    const reportedby = `${firstName} ${lastName}`;
    //find id and validate
    var lab = yield (0, lab_1.readonelab)({ _id: id }, {}, '');
    //if not lab or status !== scheduled return error
    if (!lab || !(lab.status == config_1.default.status[7])) {
        throw new Error("Lab Techician is Yet to enter result for this test");
    }
    const peripheralbloodfilmreport = { status: config_1.default.hematologyandchemicalpathologystatus[2], reportedby, summary, redbloodcell, whitebloodcell, platelet, impression, suggestion };
    const ADHbonemarrowaspirationreport = { status: config_1.default.hematologyandchemicalpathologystatus[2], reportedby, clinicalnotes, boneconsistency, aspiration, erythroidratio, erythropoiesis, leucopoesis, megakaryopoiesis, plasmacells, abnomalcells, ironstore, conclusion };
    const chemicalpathologyreport = { status: config_1.default.hematologyandchemicalpathologystatus[3], reportedby, comment };
    var processeddate = new Date();
    var queryresult;
    (0, otherservices_1.validateinputfaulsyvalue)({ lab });
    if (labreporttypehematologychemicalpathology == config_1.default.labreporttypehematologychemicalpathology[0]) {
        queryresult = yield (0, lab_1.updatelab)({ _id: id }, { labcategory: config_1.default.labcategory[0], peripheralbloodfilmreport, chemicalpathologyhemathologyreviewtstatus: config_1.default.hematologyandchemicalpathologystatus[2], processeddate });
    }
    else if (labreporttypehematologychemicalpathology == config_1.default.labreporttypehematologychemicalpathology[1]) {
        queryresult = yield (0, lab_1.updatelab)({ _id: id }, { labcategory: config_1.default.labcategory[0], ADHbonemarrowaspirationreport, chemicalpathologyhemathologyreviewtstatus: config_1.default.hematologyandchemicalpathologystatus[2], processeddate });
    }
    else if (labreporttypehematologychemicalpathology == config_1.default.labreporttypehematologychemicalpathology[2]) {
        queryresult = yield (0, lab_1.updatelab)({ _id: id }, { labcategory: config_1.default.labcategory[1], chemicalpathologyreport, chemicalpathologyhemathologyreviewtstatus: config_1.default.hematologyandchemicalpathologystatus[3], processeddate });
    }
    else {
        throw new Error("Wrong Lab Category report detected");
    }
    //update status of appointment
    res.status(200).json({
        queryresult,
        status: true
    });
}));
// get all rejected orders
//report for hemathology
//report for histopathology
//Add note field for lab
//Add priority as a field under lab, priority should be either (urgent or routine)
//Include the prices of radiology, lab, procedure in Dr create order
//Rejected orders should be added in a seperate tab
