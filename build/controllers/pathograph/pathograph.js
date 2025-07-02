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
exports.createpathographs = exports.readAllpathographByPatient = void 0;
exports.updatepathographs = updatepathographs;
exports.markascomplete = markascomplete;
const pathograph_1 = require("../../dao/pathograph");
const patientmanagement_1 = require("../../dao/patientmanagement");
const otherservices_1 = require("../../utils/otherservices");
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const config_1 = __importDefault(require("../../config"));
//get lab order by patient
const readAllpathographByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { patient } = req.params;
        const queryresult = yield (0, pathograph_1.readallpathograph)({ patient }, {}, 'patient');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllpathographByPatient = readAllpathographByPatient;
//create vital charts
// Create a new schedule
const createpathographs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        var { selectdate, temperature, pulse, bloodpressuresystolic, bloodpressurediastolic, respiratoryrate, foetalheartrate, liquor, moulding, cervicaldilationb, descentofhead, contraction, doseofoxytocinadministered, urineprotein, urineacetone, urinevolume, effecement, staffname } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ selectdate, temperature, pulse, bloodpressuresystolic, bloodpressurediastolic, respiratoryrate, foetalheartrate, liquor, moulding, cervicaldilationb, descentofhead, contraction, doseofoxytocinadministered, urineprotein, urineacetone, urinevolume, effecement, staffname });
        //frequency must inlcude
        //route must contain allowed options
        const patientrecord = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, '', '');
        //console.log(admissionrecord);   
        if (!patientrecord) {
            throw new Error(`Patient donot ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, pathograph_1.createpathograph)({ patient: patientrecord._id, selectdate, temperature, pulse, bloodpressuresystolic, bloodpressurediastolic, respiratoryrate, foetalheartrate, liquor, moulding, cervicaldilationb, descentofhead, contraction, doseofoxytocinadministered, urineprotein, urineacetone, urinevolume, effecement, staffname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createpathographs = createpathographs;
//insulin
function updatepathographs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { selectdate, temperature, pulse, bloodpressuresystolic, bloodpressurediastolic, respiratoryrate, foetalheartrate, liquor, moulding, cervicaldilationb, descentofhead, contraction, doseofoxytocinadministered, urineprotein, urineacetone, urinevolume, effecement, staffname } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ selectdate, temperature, pulse, bloodpressuresystolic, bloodpressurediastolic, respiratoryrate, foetalheartrate, liquor, moulding, cervicaldilationb, descentofhead, contraction, doseofoxytocinadministered, urineprotein, urineacetone, urinevolume, effecement, staffname });
            var queryresult = yield (0, pathograph_1.updatepathograph)(id, { selectdate, temperature, pulse, bloodpressuresystolic, bloodpressurediastolic, respiratoryrate, foetalheartrate, liquor, moulding, cervicaldilationb, descentofhead, contraction, doseofoxytocinadministered, urineprotein, urineacetone, urinevolume, effecement, staffname });
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
//deactivate a user
function markascomplete(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const queryresult = yield (0, pathograph_1.updatepathograph)(id, { status: config_1.default.status[6] });
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
