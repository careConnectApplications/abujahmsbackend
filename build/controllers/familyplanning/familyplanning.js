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
exports.createfamilyplanning = exports.readAllfamilyplanningByPatient = void 0;
exports.updatefamilyplanning = updatefamilyplanning;
const familyplanning_1 = require("../../dao/familyplanning");
const patientmanagement_1 = require("../../dao/patientmanagement");
const otherservices_1 = require("../../utils/otherservices");
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const config_1 = __importDefault(require("../../config"));
//get lab order by patient
const readAllfamilyplanningByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { patient } = req.params;
        const queryresult = yield (0, familyplanning_1.readallfamilyplannings)({ patient }, {}, 'patient');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readAllfamilyplanningByPatient = readAllfamilyplanningByPatient;
//create vital charts
// Create a new schedule
const createfamilyplanning = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        //ensure the field type
        var { weight, bloodpressuresystolic, parity, counsellingonfamilyplanning, counsellingonpostpartumfamilyplanning, firsttimemodernfamilyplanninguser, emergencycontraception, typeoffamilyplanningclient, oralpillsname, orapillsquantity, oralnewacceptor, oralrevisit, nameofinjectable, injectablequantity, selfinjection, injectableacceptor, injectablerevisit, typeofiud, iudinnewacceptor, iudinrevisit, iudoutnewacceptor, iudoutrevisit, typeofbarriermethods, barrierquantity, barriernewacceptor, barrierrevisit, typeofimplants, implantsinnewacceptor, implantsinrevisit, implantsoutnewacceptor, implantsoutrevisit, voluntorysterilization, naturalemthodsnewacceptorforcyclebeads, naturalemthodsrevisitforcyclebeads, naturalemthodsnewacceptorforothers, naturalemthodsrevisitforothers, referredoralpills, referredinjectable, referredip, referredintrauterinedevice, referredsurgicalreferred, referredmedicalreferred, staffname } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ weight, bloodpressuresystolic, parity, counsellingonfamilyplanning, counsellingonpostpartumfamilyplanning, firsttimemodernfamilyplanninguser, emergencycontraception, typeoffamilyplanningclient, oralpillsname, orapillsquantity, oralnewacceptor, oralrevisit, nameofinjectable, injectablequantity, selfinjection, injectableacceptor, injectablerevisit, typeofiud, iudinnewacceptor, iudinrevisit, iudoutnewacceptor, iudoutrevisit, typeofbarriermethods, barrierquantity, barriernewacceptor, barrierrevisit, typeofimplants, implantsinnewacceptor, implantsinrevisit, implantsoutnewacceptor, implantsoutrevisit, voluntorysterilization, naturalemthodsnewacceptorforcyclebeads, naturalemthodsrevisitforcyclebeads, naturalemthodsnewacceptorforothers, naturalemthodsrevisitforothers, referredoralpills, referredinjectable, referredip, referredintrauterinedevice, referredsurgicalreferred, referredmedicalreferred, staffname });
        //validateinputyesno({oralnewacceptor,oralrevisit,injectableacceptor,injectablerevisit,iudinnewacceptor,iudinrevisit,iudoutnewacceptor,iudoutrevisit,barriernewacceptor,barrierrevisit,implantsinnewacceptor,implantsinrevisit,implantsoutnewacceptor,implantsoutrevisit,naturalemthodsnewacceptorforcyclebeads,naturalemthodsrevisitforcyclebeads,naturalemthodsnewacceptorforothers,naturalemthodsrevisitforothers,referredoralpills,referredinjectable,referredip,referredintrauterinedevice,referredsurgicalreferred,referredmedicalreferred}); 
        //frequency must inlcude
        //route must contain allowed options
        const patientrecord = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, '', '');
        //console.log(admissionrecord);   
        if (!patientrecord) {
            throw new Error(`Patient donot ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, familyplanning_1.createfamilyplannings)({ patient: patientrecord._id, weight, bloodpressuresystolic, parity, counsellingonfamilyplanning, counsellingonpostpartumfamilyplanning, firsttimemodernfamilyplanninguser, emergencycontraception, typeoffamilyplanningclient, oralpillsname, orapillsquantity, oralnewacceptor, oralrevisit, nameofinjectable, injectablequantity, selfinjection, injectableacceptor, injectablerevisit, typeofiud, iudinnewacceptor, iudinrevisit, iudoutnewacceptor, iudoutrevisit, typeofbarriermethods, barrierquantity, barriernewacceptor, barrierrevisit, typeofimplants, implantsinnewacceptor, implantsinrevisit, implantsoutnewacceptor, implantsoutrevisit, voluntorysterilization, naturalemthodsnewacceptorforcyclebeads, naturalemthodsrevisitforcyclebeads, naturalemthodsnewacceptorforothers, naturalemthodsrevisitforothers, referredoralpills, referredinjectable, referredip, referredintrauterinedevice, referredsurgicalreferred, referredmedicalreferred, staffname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createfamilyplanning = createfamilyplanning;
//insulin
function updatefamilyplanning(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { weight, bloodpressuresystolic, parity, counsellingonfamilyplanning, counsellingonpostpartumfamilyplanning, firsttimemodernfamilyplanninguser, emergencycontraception, typeoffamilyplanningclient, oralpillsname, orapillsquantity, oralnewacceptor, oralrevisit, nameofinjectable, injectablequantity, selfinjection, injectableacceptor, injectablerevisit, typeofiud, iudinnewacceptor, iudinrevisit, iudoutnewacceptor, iudoutrevisit, typeofbarriermethods, barrierquantity, barriernewacceptor, barrierrevisit, typeofimplants, implantsinnewacceptor, implantsinrevisit, implantsoutnewacceptor, implantsoutrevisit, voluntorysterilization, naturalemthodsnewacceptorforcyclebeads, naturalemthodsrevisitforcyclebeads, naturalemthodsnewacceptorforothers, naturalemthodsrevisitforothers, referredoralpills, referredinjectable, referredip, referredintrauterinedevice, referredsurgicalreferred, referredmedicalreferred, staffname } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ weight, bloodpressuresystolic, parity, counsellingonfamilyplanning, counsellingonpostpartumfamilyplanning, firsttimemodernfamilyplanninguser, emergencycontraception, typeoffamilyplanningclient, oralpillsname, orapillsquantity, oralnewacceptor, oralrevisit, nameofinjectable, injectablequantity, selfinjection, injectableacceptor, injectablerevisit, typeofiud, iudinnewacceptor, iudinrevisit, iudoutnewacceptor, iudoutrevisit, typeofbarriermethods, barrierquantity, barriernewacceptor, barrierrevisit, typeofimplants, implantsinnewacceptor, implantsinrevisit, implantsoutnewacceptor, implantsoutrevisit, voluntorysterilization, naturalemthodsnewacceptorforcyclebeads, naturalemthodsrevisitforcyclebeads, naturalemthodsnewacceptorforothers, naturalemthodsrevisitforothers, referredoralpills, referredinjectable, referredip, referredintrauterinedevice, referredsurgicalreferred, referredmedicalreferred, staffname });
            var queryresult = yield (0, familyplanning_1.updatefamilyplannings)(id, { weight, bloodpressuresystolic, parity, counsellingonfamilyplanning, counsellingonpostpartumfamilyplanning, firsttimemodernfamilyplanninguser, emergencycontraception, typeoffamilyplanningclient, oralpillsname, orapillsquantity, oralnewacceptor, oralrevisit, nameofinjectable, injectablequantity, selfinjection, injectableacceptor, injectablerevisit, typeofiud, iudinnewacceptor, iudinrevisit, iudoutnewacceptor, iudoutrevisit, typeofbarriermethods, barrierquantity, barriernewacceptor, barrierrevisit, typeofimplants, implantsinnewacceptor, implantsinrevisit, implantsoutnewacceptor, implantsoutrevisit, voluntorysterilization, naturalemthodsnewacceptorforcyclebeads, naturalemthodsrevisitforcyclebeads, naturalemthodsnewacceptorforothers, naturalemthodsrevisitforothers, referredoralpills, referredinjectable, referredip, referredintrauterinedevice, referredsurgicalreferred, referredmedicalreferred, staffname });
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
