//reports
import express from 'express';
import {protect} from "../utils/middleware";
import {reports,reportsummary} from '../controllers/reportingandanalytics/reportingandanalytics';
import {settingsresponse,settingsummaryresponse} from '../controllers/settings/settings';
const router = express.Router();

router.get('/reports/:querytype/:querygroup/:startdate?/:enddate?', reports);
router.get('/reportsummary/:querytype/:startdate?/:enddate?', reportsummary);
router.get('/settings', settingsresponse);
router.get('/settingsummaryresponse', settingsummaryresponse);

//settingsummaryresponse


export default router;

