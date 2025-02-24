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
exports.listlabreportbypatient = exports.printlabreport = exports.listlabreport = exports.readallscheduledlab = exports.readAllLabByPatient = exports.readalllabb = void 0;
exports.labresultprocessing = labresultprocessing;
const lab_1 = require("../../dao/lab");
const otherservices_1 = require("../../utils/otherservices");
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const users_1 = require("../../dao/users");
const config_1 = __importDefault(require("../../config"));
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
            (0, otherservices_1.validateinputfaulsyvalue)({ lab, subcomponents });
            const user = yield (0, users_1.readone)({ email, staffId });
            //loop through array of subcomponent 
            for (var i = 0; i < subcomponents.length; i++) {
                //throw error if no subcomponent
                const { subcomponent, result, nranges, unit } = subcomponents[i];
                (0, otherservices_1.validateinputfaulsyvalue)({ subcomponent, result, nranges, unit });
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
        //const {clinic} = (req.user).user;
        //const queryresult = await readalllab({department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, lab_1.readalllab)({ status: config_1.default.status[5] }, {}, 'patient', 'appointment', 'payment');
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
//lab reports
const listlabreport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // find related
        const query = { status: config_1.default.status[7] };
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
