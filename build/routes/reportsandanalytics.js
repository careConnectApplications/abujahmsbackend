"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//reports
const express_1 = __importDefault(require("express"));
const reportingandanalytics_1 = require("../controllers/reportingandanalytics/reportingandanalytics");
const settings_1 = require("../controllers/settings/settings");
const router = express_1.default.Router();
router.get('/reports/:querytype/:querygroup/:startdate?/:enddate?', reportingandanalytics_1.reports);
router.get('/reportsummary/:querytype/:startdate?/:enddate?', reportingandanalytics_1.reportsummary);
router.get('/settings', settings_1.settingsresponse);
router.get('/settingsummaryresponse', settings_1.settingsummaryresponse);
router.get('/cashiersettings', settings_1.cashiersettings);
router.get('/cashierreport/:email/:startdate?/:enddate?', reportingandanalytics_1.cashierreport);
//cashierreport
//settingsummaryresponse
exports.default = router;
