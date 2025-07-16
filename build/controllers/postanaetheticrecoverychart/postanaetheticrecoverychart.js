"use strict";
//postanaetheticrecoverychart
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
exports.createvitalsignscores = exports.readallvitalsignscoreByTheatreAdmission = exports.updatepostanaetheticrecoverychartform = exports.readonepostanaetheticrecoverychartformbytheatreadmission = exports.fillpostanaetheticrecoverychartform = void 0;
exports.updatevitalsignscores = updatevitalsignscores;
const config_1 = __importDefault(require("../../config"));
const otherservices_1 = require("../../utils/otherservices");
const theatreadmission_1 = require("../../dao/theatreadmission");
const postanaetheticrecoverychart_1 = require("../../dao/postanaetheticrecoverychart");
const vitalsignscore_1 = require("../../dao/vitalsignscore");
const fillpostanaetheticrecoverychartform = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { score, timeofdischarge, treatmentgiveninrecoveryroom, commentsbyrecoverynurseorwardnurse, commentsbyanaesthetist } = req.body;
        const { theatreadmission } = req.params;
        const { firstName, lastName } = (req.user).user;
        var filledby = `${firstName} ${lastName}`;
        (0, otherservices_1.validateinputfaulsyvalue)({ theatreadmission, score, timeofdischarge, treatmentgiveninrecoveryroom, commentsbyrecoverynurseorwardnurse, commentsbyanaesthetist });
        //validate theatre admission
        var findAdmission = yield (0, theatreadmission_1.readonethearteadmission)({ _id: theatreadmission }, {}, '');
        if (!findAdmission) {
            throw new Error(`Theatre Admission ${config_1.default.error.erroralreadyexit}`);
        }
        //const queryresult:any =await updatethearteadmission(id,{status});
        //create conscent
        const queryresult = yield (0, postanaetheticrecoverychart_1.createpostanaetheticrecoverychart)({ theatreadmission, score, timeofdischarge, treatmentgiveninrecoveryroom, commentsbyrecoverynurseorwardnurse, commentsbyanaesthetist, filledby });
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.fillpostanaetheticrecoverychartform = fillpostanaetheticrecoverychartform;
//get lab order by patient
const readonepostanaetheticrecoverychartformbytheatreadmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { theatreadmission } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, postanaetheticrecoverychart_1.readonepostanaetheticrecoverychart)({ theatreadmission }, {}, '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readonepostanaetheticrecoverychartformbytheatreadmission = readonepostanaetheticrecoverychartformbytheatreadmission;
const updatepostanaetheticrecoverychartform = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { score, timeofdischarge, treatmentgiveninrecoveryroom, commentsbyrecoverynurseorwardnurse, commentsbyanaesthetist } = req.body;
        const { id } = req.params;
        (0, otherservices_1.validateinputfaulsyvalue)({ id, score, timeofdischarge, treatmentgiveninrecoveryroom, commentsbyrecoverynurseorwardnurse, commentsbyanaesthetist });
        //theatre
        //const filename = await uploadbase64image(imageBase64);
        //validate theatre admission
        var findAdmission = yield (0, postanaetheticrecoverychart_1.readonepostanaetheticrecoverychart)({ _id: id }, {}, '', '');
        if (!findAdmission) {
            throw new Error(`Postanaetheticrecoverychart Form ${config_1.default.error.erroralreadyexit}`);
        }
        //const queryresult:any =await updatethearteaadmission(id,{status});
        //create conscent
        const queryresult = yield (0, postanaetheticrecoverychart_1.updatepostanaetheticrecoverychart)(id, { score, timeofdischarge, treatmentgiveninrecoveryroom, commentsbyrecoverynurseorwardnurse, commentsbyanaesthetist });
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.updatepostanaetheticrecoverychartform = updatepostanaetheticrecoverychartform;
///////////////////////////////vital signs score //////////////////////////////////////////
const readallvitalsignscoreByTheatreAdmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postanaetheticrecoverychart } = req.params;
        const queryresult = yield (0, vitalsignscore_1.readallvitalsignscores)({ postanaetheticrecoverychart }, {});
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readallvitalsignscoreByTheatreAdmission = readallvitalsignscoreByTheatreAdmission;
// Create a drug given
const createvitalsignscores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postanaetheticrecoverychart } = req.params;
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        //blood sugar monitoring chart (contents: Date, Time, Test Type (drop down, RBS FBS), Value (mmol/l) , done by user acct.
        var { staffname, consciousness, ventilation, movement, total, bp, pulserate, respiration, color, temperature, time } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ consciousness, ventilation, movement, total, bp, pulserate, respiration, color, temperature, time });
        //frequency must inlcude
        //route must contain allowed options
        var findpostanaetheticrecoverychart = yield (0, postanaetheticrecoverychart_1.readonepostanaetheticrecoverychart)({ _id: postanaetheticrecoverychart }, {}, '', '');
        if (!findpostanaetheticrecoverychart) {
            throw new Error(`Postanaetheticrecoverychart form ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, vitalsignscore_1.createvitalsignscore)({ staffname, postanatheticrecoverychart: findpostanaetheticrecoverychart._id, consciousness, ventilation, movement, total, bp, pulserate, respiration, color, temperature, time, });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createvitalsignscores = createvitalsignscores;
function updatevitalsignscores(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { staffname, consciousness, ventilation, movement, total, bp, pulserate, respiration, color, temperature, time } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ consciousness, ventilation, movement, total, bp, pulserate, respiration, color, temperature, time });
            var queryresult = yield (0, vitalsignscore_1.updatevitalsignscore)(id, { staffname, consciousness, ventilation, movement, total, bp, pulserate, respiration, color, temperature, time });
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
