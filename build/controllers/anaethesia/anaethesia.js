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
exports.createfoodgivens = exports.readallfoodgivenByTheatreAdmission = exports.createdruggivens = exports.readalldruggivenByTheatreAdmission = exports.updateanaethesiaform = exports.readreadoneanaethesiaformbytheatreadmission = exports.fillanaethesiaform = void 0;
exports.updatedruggivens = updatedruggivens;
exports.updatefoodgivens = updatefoodgivens;
const config_1 = __importDefault(require("../../config"));
const otherservices_1 = require("../../utils/otherservices");
const theatreadmission_1 = require("../../dao/theatreadmission");
const anaethesia_1 = require("../../dao/anaethesia");
const druggiven_1 = require("../../dao/druggiven");
const foodgiven_1 = require("../../dao/foodgiven");
const fillanaethesiaform = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { preopeassessment, allergies, weight, asa, temp, premedication, timegivenpremedication, timeoflastfood, vlinesite, cannulasize, technique, bloodloss, totalinput, postofinstruction } = req.body;
        const { theatreadmission } = req.params;
        const { firstName, lastName } = (req.user).user;
        var filledby = `${firstName} ${lastName}`;
        (0, otherservices_1.validateinputfaulsyvalue)({ theatreadmission, preopeassessment, allergies, weight, asa, temp, premedication, timegivenpremedication, timeoflastfood, vlinesite, cannulasize, technique, bloodloss, totalinput, postofinstruction });
        //validate theatre admission
        var findAdmission = yield (0, theatreadmission_1.readonethearteadmission)({ _id: theatreadmission }, {}, '');
        if (!findAdmission) {
            throw new Error(`Theatre Admission ${config_1.default.error.erroralreadyexit}`);
        }
        //const queryresult:any =await updatethearteadmission(id,{status});
        //create conscent
        const queryresult = yield (0, anaethesia_1.createanaethesia)({ theatreadmission, preopeassessment, allergies, weight, asa, temp, premedication, timegivenpremedication, timeoflastfood, vlinesite, cannulasize, technique, bloodloss, totalinput, postofinstruction, filledby });
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.fillanaethesiaform = fillanaethesiaform;
//get lab order by patient
const readreadoneanaethesiaformbytheatreadmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { theatreadmission } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, anaethesia_1.readoneanaethesia)({ theatreadmission }, {}, '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readreadoneanaethesiaformbytheatreadmission = readreadoneanaethesiaformbytheatreadmission;
const updateanaethesiaform = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { preopeassessment, allergies, weight, asa, temp, premedication, timegivenpremedication, timeoflastfood, vlinesite, cannulasize, technique, bloodloss, totalinput, postofinstruction } = req.body;
        const { id } = req.params;
        (0, otherservices_1.validateinputfaulsyvalue)({ id, preopeassessment, allergies, weight, asa, temp, premedication, timegivenpremedication, timeoflastfood, vlinesite, cannulasize, technique, bloodloss, totalinput, postofinstruction });
        //theatre
        //const filename = await uploadbase64image(imageBase64);
        //validate theatre admission
        var findAdmission = yield (0, anaethesia_1.readoneanaethesia)({ _id: id }, {}, '', '');
        if (!findAdmission) {
            throw new Error(`Anaethesia Form ${config_1.default.error.erroralreadyexit}`);
        }
        //const queryresult:any =await updatethearteaadmission(id,{status});
        //create conscent
        const queryresult = yield (0, anaethesia_1.updateanaethesia)(id, { preopeassessment, allergies, weight, asa, temp, premedication, timegivenpremedication, timeoflastfood, vlinesite, cannulasize, technique, bloodloss, totalinput, postofinstruction });
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.updateanaethesiaform = updateanaethesiaform;
//////////////////////////drugs given //////////////////////////////////////////////
const readalldruggivenByTheatreAdmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { anathesia } = req.params;
        const queryresult = yield (0, druggiven_1.readalldruggivens)({ anathesia }, {});
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readalldruggivenByTheatreAdmission = readalldruggivenByTheatreAdmission;
// Create a drug given
const createdruggivens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { anathesia } = req.params;
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        //blood sugar monitoring chart (contents: Date, Time, Test Type (drop down, RBS FBS), Value (mmol/l) , done by user acct.
        var { staffname, druggiven, timegiven, bp, pulse, temp } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ druggiven, timegiven, bp, pulse, temp });
        //frequency must inlcude
        //route must contain allowed options
        var findanathesia = yield (0, anaethesia_1.readoneanaethesia)({ _id: anathesia }, {}, '', '');
        if (!findanathesia) {
            throw new Error(`Anathesia record ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, druggiven_1.createdruggiven)({ druggiven, timegiven, bp, pulse, temp, staffname, anathesia: findanathesia._id });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createdruggivens = createdruggivens;
function updatedruggivens(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { staffname, druggiven, timegiven, bp, pulse, temp } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ druggiven, timegiven, bp, pulse, temp });
            var queryresult = yield (0, druggiven_1.updatedruggiven)(id, { druggiven, timegiven, bp, pulse, temp, staffname });
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
///////////////////////////////food given //////////////////////////////////////////
const readallfoodgivenByTheatreAdmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { anathesia } = req.params;
        const queryresult = yield (0, foodgiven_1.readallfoodgivens)({ anathesia }, {});
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readallfoodgivenByTheatreAdmission = readallfoodgivenByTheatreAdmission;
// Create a drug given
const createfoodgivens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { anathesia } = req.params;
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        //blood sugar monitoring chart (contents: Date, Time, Test Type (drop down, RBS FBS), Value (mmol/l) , done by user acct.
        var { staffname, foodgiven, timegiven, bp, pulse, temp } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ foodgiven, timegiven, bp, pulse, temp });
        //frequency must inlcude
        //route must contain allowed options
        var findanathesia = yield (0, anaethesia_1.readoneanaethesia)({ _id: anathesia }, {}, '', '');
        if (!findanathesia) {
            throw new Error(`Anathesia record ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, foodgiven_1.createfoodgiven)({ foodgiven, timegiven, bp, pulse, temp, staffname, anathesia: findanathesia._id });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createfoodgivens = createfoodgivens;
function updatefoodgivens(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { staffname, foodgiven, timegiven, bp, pulse, temp } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ foodgiven, timegiven, bp, pulse, temp });
            var queryresult = yield (0, foodgiven_1.updatefoodgiven)(id, { foodgiven, timegiven, bp, pulse, temp, staffname });
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
