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
exports.createunits = void 0;
exports.getallunits = getallunits;
exports.getunitsbyclinic = getunitsbyclinic;
exports.getunitsbyclinicname = getunitsbyclinicname;
exports.updateunits = updateunits;
const units_1 = require("../../dao/units");
const clinics_1 = require("../../dao/clinics");
const otherservices_1 = require("../../utils/otherservices");
const audit_1 = require("../../dao/audit");
// add unit
var createunits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unit, clinicId } = req.body;
        const { firstName, lastName } = (req.user).user;
        var actor = `${firstName} ${lastName}`;
        (0, otherservices_1.validateinputfaulsyvalue)({ unit, clinicId });
        // Check if the clinic exists
        const foundClinic = yield (0, clinics_1.readoneclinic)({ _id: clinicId }, '');
        if (!foundClinic) {
            throw new Error(`Clinic with ID ${clinicId} does not exist`);
        }
        var id = `${unit[0]}${(0, otherservices_1.generateRandomNumber)(5)}${unit[unit.length - 1]}`;
        const foundUnit = yield (0, units_1.readoneunit)({ unit, clinicId }, '', '');
        // Check if unit already exists for this clinic
        if (foundUnit) {
            throw new Error(`Unit already exists for this clinic`);
        }
        const queryresult = yield (0, units_1.createunit)({ unit, clinicId, id });
        //create audit log
        yield (0, audit_1.createaudit)({ action: "Created Unit", actor, affectedentity: `${unit} for clinic ${foundClinic.clinic}` });
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.createunits = createunits;
// read all units
function getallunits(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, units_1.readallunits)({}, '', 'clinicId');
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
// get units by clinic
function getunitsbyclinic(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { clinicId } = req.params;
            (0, otherservices_1.validateinputfaulsyvalue)({ clinicId });
            const queryresult = yield (0, units_1.readunitsbyclinic)(clinicId, '', 'clinicId');
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
function getunitsbyclinicname(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { clinic } = req.params;
            (0, otherservices_1.validateinputfaulsyvalue)({ clinic });
            const foundClinic = yield (0, clinics_1.readoneclinic)({ clinic }, '');
            if (!foundClinic) {
                throw new Error(`Clinic with name ${clinic} does not exist`);
            }
            const queryresult = yield (0, units_1.readunitsbyclinic)(foundClinic._id, '', 'clinicId');
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
// update a unit
function updateunits(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { unit, clinicId } = req.body;
            const { firstName, lastName } = (req.user).user;
            var actor = `${firstName} ${lastName}`;
            (0, otherservices_1.validateinputfaulsyvalue)({ unit, id });
            // If clinicId is being updated, check if the new clinic exists
            if (clinicId) {
                const foundClinic = yield (0, clinics_1.readoneclinic)({ _id: clinicId }, '');
                if (!foundClinic) {
                    throw new Error(`Clinic with ID ${clinicId} does not exist`);
                }
            }
            var queryresult = yield (0, units_1.updateunit)(id, { unit, clinicId });
            yield (0, audit_1.createaudit)({ action: "Update Unit", actor, affectedentity: unit });
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
