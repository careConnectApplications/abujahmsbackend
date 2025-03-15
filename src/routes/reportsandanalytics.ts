//reports
import express from 'express';
import {protect} from "../utils/middleware";
import {reports,reportsummary,cashierreport} from '../controllers/reportingandanalytics/reportingandanalytics';
import {settingsresponse,settingsummaryresponse,cashiersettings} from '../controllers/settings/settings';
const router = express.Router();

router.get('/reports/:querytype/:querygroup/:startdate?/:enddate?', reports);
router.get('/reportsummary/:querytype/:startdate?/:enddate?', reportsummary);
router.get('/settings', settingsresponse);
router.get('/settingsummaryresponse', settingsummaryresponse);
router.get('/cashiersettings', cashiersettings);
router.get('/cashierreport/:email/:startdate?/:enddate?', cashierreport);
//cashierreport

//settingsummaryresponse


export default router;

