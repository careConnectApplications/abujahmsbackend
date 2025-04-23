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
exports.createdailywardreport = exports.readalldailywardreportsByward = exports.readalldailywardreports = void 0;
exports.updatedailywardreport = updatedailywardreport;
const dailywardreport_1 = require("../../dao/dailywardreport");
const wardmanagement_1 = require("../../dao/wardmanagement");
const otherservices_1 = require("../../utils/otherservices");
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
const config_1 = __importDefault(require("../../config"));
// Get all lab records
const readalldailywardreports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryresult = yield (0, dailywardreport_1.readalldailywardreport)({}, {}, 'ward');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readalldailywardreports = readalldailywardreports;
//
const readalldailywardreportsByward = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ward } = req.params;
        const queryresult = yield (0, dailywardreport_1.readalldailywardreport)({ ward }, {}, 'ward');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readalldailywardreportsByward = readalldailywardreportsByward;
const createdailywardreport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName } = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
        var { wardreport, staffname, wardname } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ wardreport, staffname, wardname });
        //validate ward
        const foundWard = yield (0, wardmanagement_1.readonewardmanagement)({ wardname }, '');
        if (!foundWard) {
            throw new Error(`Ward ${config_1.default.error.errornotfound}`);
        }
        const queryresult = yield (0, dailywardreport_1.createdailywardreports)({ ward: foundWard._id, wardreport, staffname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (e) {
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.createdailywardreport = createdailywardreport;
//update vitalcharts
function updatedailywardreport(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            req.body.staffname = `${firstName} ${lastName}`;
            var { wardreport, staffname, wardname } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ wardreport, staffname, wardname });
            const foundWard = yield (0, wardmanagement_1.readonewardmanagement)({ wardname }, '');
            if (!foundWard) {
                throw new Error(`Ward ${config_1.default.error.errornotfound}`);
            }
            var queryresult = yield (0, dailywardreport_1.updatedailywardreports)(id, { wardreport, staffname, ward: foundWard._id });
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
