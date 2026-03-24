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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatehistologyrequestform = exports.readhistologyrequestformytheatreadmission = exports.fillhistologyrequestform = void 0;
<<<<<<< HEAD
=======
const config_1 = __importDefault(require("../../config"));
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
const otherservices_1 = require("../../utils/otherservices");
const theatreadmission_1 = require("../../dao/theatreadmission");
const histology_1 = require("../../dao/histology");
const fillhistologyrequestform = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { theatreadmission } = req.params;
        const { africannonafrican, historyofpresentillness, presentingcomplaint, findingonphysicalexamination, otherfindings, anatomicalsiteofbiopsy, grossappearanceoflesion, previousreportwithnumberanddate, nameofconsultant } = req.body;
        const { firstName, lastName } = (req.user).user;
        var filledby = `${firstName} ${lastName}`;
        (0, otherservices_1.validateinputfaulsyvalue)({ theatreadmission, africannonafrican, historyofpresentillness, presentingcomplaint, findingonphysicalexamination, otherfindings, anatomicalsiteofbiopsy, grossappearanceoflesion, previousreportwithnumberanddate, nameofconsultant });
        //theatre
        //validate theatre admission
        var findAdmission = yield (0, theatreadmission_1.readonethearteadmission)({ _id: theatreadmission }, {}, '');
        if (!findAdmission) {
<<<<<<< HEAD
            throw new Error(`Theatre Admission does not exist`);
=======
            throw new Error(`Theatre Admission donot ${config_1.default.error.erroralreadyexit}`);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
        }
        const queryresult = yield (0, histology_1.createhistologyrequest)({ theatreadmission, africannonafrican, historyofpresentillness, presentingcomplaint, findingonphysicalexamination, otherfindings, anatomicalsiteofbiopsy, grossappearanceoflesion, previousreportwithnumberanddate, nameofconsultant, filledby });
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.fillhistologyrequestform = fillhistologyrequestform;
//get lab order by patient
const readhistologyrequestformytheatreadmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { theatreadmission } = req.params;
        //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
        const queryresult = yield (0, histology_1.readonehistology)({ theatreadmission }, {}, '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readhistologyrequestformytheatreadmission = readhistologyrequestformytheatreadmission;
const updatehistologyrequestform = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { africannonafrican, historyofpresentillness, presentingcomplaint, findingonphysicalexamination, otherfindings, anatomicalsiteofbiopsy, grossappearanceoflesion, previousreportwithnumberanddate, nameofconsultant } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ id, africannonafrican, historyofpresentillness, presentingcomplaint, findingonphysicalexamination, otherfindings, anatomicalsiteofbiopsy, grossappearanceoflesion, previousreportwithnumberanddate, nameofconsultant });
        //theatre
        //const filename = await uploadbase64image(imageBase64);
        //validate theatre admission
        var findhistologyrequestform = yield (0, histology_1.readonehistology)({ _id: id }, {}, '');
        if (!findhistologyrequestform) {
<<<<<<< HEAD
            throw new Error(`Histology Request Form already exists`);
=======
            throw new Error(`Histology Request Form ${config_1.default.error.erroralreadyexit}`);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
        }
        //const queryresult:any =await updatethearteadmission(id,{status});
        //create conscent
        const queryresult = yield (0, histology_1.updatehistology)(id, { africannonafrican, historyofpresentillness, presentingcomplaint, findingonphysicalexamination, otherfindings, anatomicalsiteofbiopsy, grossappearanceoflesion, previousreportwithnumberanddate, nameofconsultant });
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.updatehistologyrequestform = updatehistologyrequestform;
