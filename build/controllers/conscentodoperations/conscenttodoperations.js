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
exports.updatefillconscentform = exports.readconscentformbytheatreadmission = exports.fillconscentform = void 0;
const config_1 = __importDefault(require("../../config"));
const otherservices_1 = require("../../utils/otherservices");
const theatreadmission_1 = require("../../dao/theatreadmission");
const conscenttooperation_1 = require("../../dao/conscenttooperation");
const fillconscentform = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageBase64, nameofexplainer, nameofrepresentive, conscentdate, addressofrepresentaive, fullnameofwitness } = req.body;
        const { theatreadmission } = req.params;
        (0, otherservices_1.validateinputfaulsyvalue)({ theatreadmission, imageBase64, nameofexplainer, nameofrepresentive, conscentdate, addressofrepresentaive, fullnameofwitness });
        //theatre
        const filename = yield (0, otherservices_1.uploadbase64image)(imageBase64);
        //validate theatre admission
        var findAdmission = yield (0, theatreadmission_1.readonethearteadmission)({ _id: theatreadmission }, {}, '');
        if (!findAdmission) {
            throw new Error(`Theatre Admission ${config_1.default.error.erroralreadyexit}`);
        }
        //const queryresult:any =await updatethearteadmission(id,{status});
        //create conscent
        const conscentresult = yield (0, conscenttooperation_1.createconscentooperation)({ theatreadmission, nameofexplainer, nameofrepresentive, conscentdate, filename, addressofrepresentaive, fullnameofwitness });
        //update theatre admission
        const queryresult = yield (0, theatreadmission_1.updatethearteadmission)(theatreadmission, { conscent: conscentresult._id });
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.fillconscentform = fillconscentform;
//get lab order by patient
const readconscentformbytheatreadmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { theatreadmission } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, conscenttooperation_1.readoneconscentooperation)({ theatreadmission }, {}, 'theatreadmission');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readconscentformbytheatreadmission = readconscentformbytheatreadmission;
const updatefillconscentform = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageBase64, nameofexplainer, nameofrepresentive, conscentdate, addressofrepresentaive, fullnameofwitness } = req.body;
        const { id } = req.params;
        (0, otherservices_1.validateinputfaulsyvalue)({ id, nameofexplainer, nameofrepresentive, conscentdate, addressofrepresentaive, fullnameofwitness });
        //theatre
        let filename;
        if (imageBase64) {
            filename = yield (0, otherservices_1.uploadbase64image)(imageBase64);
        }
        //theatre
        //const filename = await uploadbase64image(imageBase64);
        //validate theatre admission
        var findAdmission = yield (0, conscenttooperation_1.readoneconscentooperation)({ _id: id }, {}, '');
        if (!findAdmission) {
            throw new Error(`Conscent Form ${config_1.default.error.erroralreadyexit}`);
        }
        //const queryresult:any =await updatethearteaadmission(id,{status});
        //create conscent
        const queryresult = yield (0, conscenttooperation_1.updateconscentooperation)(id, { filename, nameofexplainer, nameofrepresentive, conscentdate, addressofrepresentaive, fullnameofwitness });
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.updatefillconscentform = updatefillconscentform;
