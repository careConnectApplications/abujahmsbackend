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
exports.createvitalchart = exports.readAllvitalsByPatient = exports.readallvitalchartByAdmission = void 0;
exports.updatevitalchart = updatevitalchart;
const vitalcharts_1 = require("../../dao/vitalcharts");
const admissions_1 = require("../../dao/admissions");
const otherservices_1 = require("../../utils/otherservices");
const patientmanagement_1 = require("../../dao/patientmanagement");
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const config_1 = __importDefault(require("../../config"));
// Get all lab records
const readallvitalchartByAdmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admission } = req.params;
        const queryresult = yield (0, vitalcharts_1.readallvitalcharts)({ admission }, {}, 'patient', 'admission');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readallvitalchartByAdmission = readallvitalchartByAdmission;
//get lab order by patient
const readAllvitalsByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { patient } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, vitalcharts_1.readallvitalcharts)({ patient }, {}, 'patient', 'admission');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllvitalsByPatient = readAllvitalsByPatient;
//create vital charts
// Create a new schedule
const createvitalchart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // admission,patient,height,weight,temperature,heartrate,bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,bmi,painscore,rbs,gcs,wardname,staffname,
        const { id } = req.params;
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        var { height, weight, temperature, heartrate, bloodpressuresystolic, bloodpressurediastolic, respiration, saturation, painscore, rbs, gcs, staffname } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ height, weight, temperature, heartrate, bloodpressuresystolic, bloodpressurediastolic, respiration, saturation, painscore, rbs, gcs, staffname });
        var bmi = weight / ((height / 100) * (height / 100));
        const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, '', '');
        var admissionrecord;
        if (foundPatient) {
            admissionrecord = {
                patient: id,
                referedward: new ObjectId(),
                _id: new ObjectId(),
            };
        }
        else {
            admissionrecord = yield (0, admissions_1.readoneadmission)({ _id: id }, {}, '');
            if (!admissionrecord) {
                throw new Error(`Admission donot ${config_1.default.error.erroralreadyexit}`);
            }
        }
        const queryresult = yield (0, vitalcharts_1.createvitalcharts)({ referedward: admissionrecord.referedward, admission: admissionrecord._id, patient: admissionrecord.patient, bmi, height, weight, temperature, heartrate, bloodpressuresystolic, bloodpressurediastolic, respiration, saturation, painscore, rbs, gcs, staffname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createvitalchart = createvitalchart;
//update vitalcharts
function updatevitalchart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { height, weight, temperature, heartrate, bloodpressuresystolic, bloodpressurediastolic, respiration, saturation, painscore, rbs, gcs, staffname } = req.body;
            //validateinputfaulsyvalue({height,weight,temperature,heartrate,bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,staffname});
            var bmi;
            if (height && weight)
                bmi = weight / ((height / 100) * (height / 100));
            var queryresult = yield (0, vitalcharts_1.updatevitalcharts)(id, { bmi, height, weight, temperature, heartrate, bloodpressuresystolic, bloodpressurediastolic, respiration, saturation, painscore, rbs, gcs, staffname, status: config_1.default.status[6] });
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
