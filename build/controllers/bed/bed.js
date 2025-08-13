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
exports.updatebeds = exports.getallbeds = exports.softDeleteBed = exports.getAvailableBedsByWard = exports.createbeds = void 0;
const config_1 = __importDefault(require("../../config"));
const audit_1 = require("../../dao/audit");
const otherservices_1 = require("../../utils/otherservices");
const bed_1 = require("../../dao/bed");
const wardmanagement_1 = require("../../dao/wardmanagement");
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const { ObjectId } = mongoose_1.default.Types;
// Create a new bed
exports.createbeds = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { wardid, bednumber } = req.body;
    const { firstName, lastName } = req.user.user;
    const actor = `${firstName} ${lastName}`;
    const id = new ObjectId(wardid);
    (0, otherservices_1.validateinputfaulsyvalue)({ wardid });
    const foundWard = yield (0, wardmanagement_1.readonewardmanagement)({ _id: id }, '');
    if (!foundWard) {
        throw new Error(`Ward doesnt ${config_1.default.error.erroralreadyexit}`);
    }
    // Check for existing bed with same number in the same ward
    const existing = yield (0, bed_1.readonebed)({ bednumber, ward: id }, '');
    if (existing) {
        throw new Error(`Bed ${config_1.default.error.erroralreadyexit}`);
    }
    const queryresult = yield (0, bed_1.createbed)({
        bednumber,
        ward: id,
        status: config_1.default.bedstatus[0],
        assignedPatient: null,
        assignedDate: null
    });
    yield (0, wardmanagement_1.updatewardmanagement)(id, { $inc: { vacantbed: 1 } });
    yield (0, audit_1.createaudit)({ action: "Created Bed", actor, affectedentity: bednumber });
    res.status(200).json({ queryresult, status: true });
}));
//get all not deleted and vacant be by ward
// Get all vacant and not-deleted beds in a specific ward
exports.getAvailableBedsByWard = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { wardid } = req.params;
    if (!wardid) {
        throw new Error("Ward ID is required");
    }
    const query = {
        ward: wardid,
        status: config_1.default.bedstatus[0],
        isDeleted: false
    };
    const queryresult = yield (0, bed_1.readallbeds)(query, "", "ward");
    res.status(200).json({ queryresult, status: true });
}));
//delete a bed
exports.softDeleteBed = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { isDeleted } = req.body; // true or false
    if (!id || typeof isDeleted !== "boolean") {
        throw new Error("Both Bed ID and valid isDeleted (true or false) are required.");
    }
    // Fetch current bed data
    const bed = yield (0, bed_1.readonebed)({ _id: id }, "");
    if (!bed) {
        throw new Error("Bed not found.");
    }
    // Block operation if bed is occupied
    if (bed.status === config_1.default.bedstatus[1]) {
        throw new Error("Cannot delete or restore an occupied bed.");
    }
    // Adjust vacantbed count based on deletion or restoration
    const adjustment = isDeleted ? -1 : 1;
    if (isDeleted !== bed.isDeleted)
        yield (0, wardmanagement_1.updatewardmanagement)(bed.ward, { $inc: { vacantbed: adjustment, totalbed: adjustment } });
    // Apply soft delete / restore
    const queryresult = yield (0, bed_1.updatebed)(id, { isDeleted });
    res.status(200).json({ queryresult, status: true });
}));
// Read all beds
exports.getallbeds = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const queryresult = yield (0, bed_1.readallbeds)({}, '', 'ward');
    res.status(200).json({ queryresult, status: true });
}));
// Update a bed
exports.updatebeds = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { bednumber } = req.body;
    const { firstName, lastName } = req.user.user;
    const actor = `${firstName} ${lastName}`;
    (0, otherservices_1.validateinputfaulsyvalue)({ bednumber });
    const existing = yield (0, bed_1.readonebed)({ bednumber }, '');
    if (existing) {
        throw new Error(`Bed ${config_1.default.error.erroralreadyexit}`);
    }
    const queryresult = yield (0, bed_1.updatebed)(id, {
        bednumber
    });
    yield (0, audit_1.createaudit)({ action: "Updated Bed", actor, affectedentity: bednumber });
    res.status(200).json({ queryresult, status: true });
}));
