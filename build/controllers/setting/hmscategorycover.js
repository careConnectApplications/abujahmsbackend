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
exports.createhmocategorycovercontroller = void 0;
exports.getallhmocategorycovercontroller = getallhmocategorycovercontroller;
exports.updatehmocategorycovercontroller = updatehmocategorycovercontroller;
const config_1 = __importDefault(require("../../config"));
const hmocategorycover_1 = require("../../dao/hmocategorycover");
const hmomanagement_1 = require("../../dao/hmomanagement");
const otherservices_1 = require("../../utils/otherservices");
const audit_1 = require("../../dao/audit");
// Create HMO Category Cover
var createhmocategorycovercontroller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hmoId, category, isprimaryhmo, hmopercentagecover } = req.body;
        const { firstName, lastName } = (req.user).user;
        var actor = `${firstName} ${lastName}`;
        (0, otherservices_1.validateinputfaulsyvalue)({ hmoId, category, hmopercentagecover });
        const foundHmo = yield (0, hmomanagement_1.readonehmomanagement)({ _id: hmoId }, '');
        //update servicetype for New Patient Registration
        if (!foundHmo) {
            throw new Error(`HMO doesnt ${config_1.default.error.erroralreadyexit}`);
        }
        //validate category
        //update servicetype for New Patient Registration
        if (!(config_1.default.category).includes(category)) {
            throw new Error(`service category doesnt ${config_1.default.error.erroralreadyexit}`);
        }
        // Check if category already exists for same HMO
        const foundCover = yield (0, hmocategorycover_1.readonehmocategorycover)({ hmoId, category, hmopercentagecover }, "");
        if (foundCover) {
            throw new Error(`HMO Category Cover ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, hmocategorycover_1.createhmocategorycover)({
            hmoId: foundHmo._id,
            category,
            isprimaryhmo,
            hmopercentagecover,
            createdBy: actor
        });
        yield (0, audit_1.createaudit)({
            action: "Create HMO Category Cover",
            actor,
            affectedentity: `${category} - ${hmoId}`
        });
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.createhmocategorycovercontroller = createhmocategorycovercontroller;
// Get all HMO Category Covers
function getallhmocategorycovercontroller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, hmocategorycover_1.readallhmocategorycover)({}, "");
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
// Update HMO Category Cover
function updatehmocategorycovercontroller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { _id } = req.params;
            const { hmoId, category, isprimaryhmo, hmopercentagecover } = req.body;
            const { firstName, lastName } = (req.user).user;
            var actor = `${firstName} ${lastName}`;
            (0, otherservices_1.validateinputfaulsyvalue)({ _id, hmoId, category, hmopercentagecover });
            const foundHmo = yield (0, hmomanagement_1.readonehmomanagement)({ _id: hmoId }, '');
            //update servicetype for New Patient Registration
            if (!foundHmo) {
                throw new Error(`HMO doesnt ${config_1.default.error.erroralreadyexit}`);
            }
            yield (0, audit_1.createaudit)({
                action: "Update HMO Category Cover",
                actor,
                affectedentity: `${category} - ${hmoId}`
            });
            const queryresult = yield (0, hmocategorycover_1.updatehmocategorycover)(_id, {
                hmoId: foundHmo._id,
                category,
                isprimaryhmo,
                hmopercentagecover
            });
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
