import express from 'express';
import {
    CreateHistopatholgyService,
    CreateMultipleTestReport,
    getAllHistopathologyDashboard,
    getHistopathologyRecordById
} from '../controllers/histopathology/histopathology.controller';

const router = express.Router();

router.post("", CreateHistopatholgyService);
router.get("", getAllHistopathologyDashboard); // getAllHistopathologyPaginatedHandler
router.get("/:id", getHistopathologyRecordById);
router.post("/:id/tests", CreateMultipleTestReport);
////test/:id to post to post all exam/result
/// put /:id to update record details
export default router;