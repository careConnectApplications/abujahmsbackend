//reports
import express from 'express';
import {protect} from "../utils/middleware";
import {reports} from '../controllers/reportingandanalytics/reportingandanalytics';
import {settingsresponse} from '../controllers/settings/settings';
const router = express.Router();

router.get('/:querytype/:querygroup/:startdate?/:enddate?', reports);
router.get('/settings', settingsresponse);


export default router;

