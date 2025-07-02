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
exports.createtubefeedingchart = exports.readAlltubefeedingchartByPatient = exports.readalltubefeedingchartByAdmission = void 0;
exports.updatetubefeedingchart = updatetubefeedingchart;
const tubefeedingchart_1 = require("../../dao/tubefeedingchart");
const admissions_1 = require("../../dao/admissions");
const otherservices_1 = require("../../utils/otherservices");
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const config_1 = __importDefault(require("../../config"));
// Get all lab records
const readalltubefeedingchartByAdmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admission } = req.params;
        const queryresult = yield (0, tubefeedingchart_1.readalltubefeedingcharts)({ admission }, { Datetimefeeds: 1, amount: 1, feed: 1, staffname: 1, createdAt: 1, updatedAt: 1 }, '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readalltubefeedingchartByAdmission = readalltubefeedingchartByAdmission;
//get lab order by patient
const readAlltubefeedingchartByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { patient } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, tubefeedingchart_1.readalltubefeedingcharts)({ patient }, { Datetimefeeds: 1, amount: 1, feed: 1, staffname: 1, createdAt: 1, updatedAt: 1 }, '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAlltubefeedingchartByPatient = readAlltubefeedingchartByPatient;
const createtubefeedingchart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        var { Datetimefeeds, amount, feed, staffname } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ Datetimefeeds, amount, feed, staffname });
        const admissionrecord = yield (0, admissions_1.readoneadmission)({ _id: id }, {}, '');
        console.log(admissionrecord);
        if (!admissionrecord) {
            throw new Error(`Admission donot ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, tubefeedingchart_1.createtubefeedingcharts)({ referedward: admissionrecord.referedward, admission: admissionrecord._id, patient: admissionrecord.patient, Datetimefeeds, amount, feed, staffname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createtubefeedingchart = createtubefeedingchart;
//update vitalcharts
function updatetubefeedingchart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { Datetimefeeds, amount, feed, staffname } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ Datetimefeeds, amount, feed, staffname });
            var queryresult = yield (0, tubefeedingchart_1.updatetubefeedingcharts)(id, { Datetimefeeds, amount, feed, staffname });
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
