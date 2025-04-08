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
exports.createdeliverynote = exports.readAlldeliverynoteByPatient = void 0;
exports.updatedeliverynote = updatedeliverynote;
const deliverynote_1 = require("../../dao/deliverynote");
const patientmanagement_1 = require("../../dao/patientmanagement");
const otherservices_1 = require("../../utils/otherservices");
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const config_1 = __importDefault(require("../../config"));
//get lab order by patient
const readAlldeliverynoteByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { patient } = req.params;
        const queryresult = yield (0, deliverynote_1.readalldeliverynotes)({ patient }, {}, 'patient');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAlldeliverynoteByPatient = readAlldeliverynoteByPatient;
//create vital charts
// Create a new schedule
const createdeliverynote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        //ensure the field type
        var { note, staffname } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ note, staffname });
        const patientrecord = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, '', '');
        //console.log(admissionrecord);   
        if (!patientrecord) {
            throw new Error(`Patient donot ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, deliverynote_1.createdeliverynotes)({ patient: patientrecord._id, note, staffname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createdeliverynote = createdeliverynote;
//insulin
function updatedeliverynote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { note, staffname } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ note, staffname });
            var queryresult = yield (0, deliverynote_1.updatedeliverynotes)(id, { note, staffname });
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
