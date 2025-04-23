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
exports.createinsulin = exports.readAllinsulinByPatient = exports.readallinsulinByAdmission = void 0;
exports.updateinsulin = updateinsulin;
const insulin_1 = require("../../dao/insulin");
const admissions_1 = require("../../dao/admissions");
const otherservices_1 = require("../../utils/otherservices");
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const config_1 = __importDefault(require("../../config"));
// Get all lab records
const readallinsulinByAdmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admission } = req.params;
        const queryresult = yield (0, insulin_1.readallinsulins)({ admission }, { dateandtimeofinsulinadministration: 1, rbsvalue: 1, typeofinsulin: 1, dosage: 1, route: 1, staffname: 1, createdAt: 1, updatedAt: 1 }, '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readallinsulinByAdmission = readallinsulinByAdmission;
//get lab order by patient
const readAllinsulinByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { patient } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, insulin_1.readallinsulins)({ patient }, { dateandtimeofinsulinadministration: 1, rbsvalue: 1, typeofinsulin: 1, dosage: 1, route: 1, staffname: 1, createdAt: 1, updatedAt: 1 }, '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllinsulinByPatient = readAllinsulinByPatient;
//create vital charts
// Create a new schedule
const createinsulin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //dateandtimeofinsulinadministration,typeofinsulin,dosage,route,
        // rbsvalue, 
        // typeofinsulin,
        //  dosage,
        //  route,
        //  served by user profile 
        const { id } = req.params;
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        //var { dateandtimeofbloodglucosemonitoring,premealbloodglucoselevel,postmealbloodglucoselevel,fastingbloodglucose,dateandtimeofinsulinadministration,typeofinsulin,dosage,route,mealtimes,carbonhydrateintakeestimation,symtoms,interventionprovided,staffname} = req.body;
        var { dateandtimeofinsulinadministration, rbsvalue, typeofinsulin, dosage, route, staffname } = req.body;
        //validateinputfaulsyvalue({dateandtimeofbloodglucosemonitoring,premealbloodglucoselevel,postmealbloodglucoselevel,fastingbloodglucose,dateandtimeofinsulinadministration,typeofinsulin,dosage,route,mealtimes,carbonhydrateintakeestimation,symtoms,interventionprovided,staffname});
        (0, otherservices_1.validateinputfaulsyvalue)({ dateandtimeofinsulinadministration, typeofinsulin, rbsvalue, dosage, route, staffname });
        //frequency must inlcude
        //route must contain allowed options
        const admissionrecord = yield (0, admissions_1.readoneadmission)({ _id: id }, {}, '');
        //console.log(admissionrecord);   
        if (!admissionrecord) {
            throw new Error(`Admission donot ${config_1.default.error.erroralreadyexit}`);
        }
        //const queryresult=await createinsulins({referedward:admissionrecord.referedward,admission:admissionrecord._id,patient:admissionrecord.patient,dateandtimeofbloodglucosemonitoring,premealbloodglucoselevel,postmealbloodglucoselevel,fastingbloodglucose,dateandtimeofinsulinadministration,typeofinsulin,dosage,route,mealtimes,carbonhydrateintakeestimation,symtoms,interventionprovided,staffname});
        const queryresult = yield (0, insulin_1.createinsulins)({ referedward: admissionrecord.referedward, admission: admissionrecord._id, patient: admissionrecord.patient, dateandtimeofinsulinadministration, typeofinsulin, rbsvalue, dosage, route, staffname });
        //dateandtimeofinsulinadministration,rbsvalue,typeofinsulin,dosage,route,staffname
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createinsulin = createinsulin;
//insulin
function updateinsulin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { dateandtimeofinsulinadministration, rbsvalue, typeofinsulin, dosage, route, staffname } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ dateandtimeofinsulinadministration, typeofinsulin, rbsvalue, dosage, route, staffname });
            var queryresult = yield (0, insulin_1.updateinsulins)(id, { dateandtimeofinsulinadministration, rbsvalue, typeofinsulin, dosage, route, staffname });
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
