import express from 'express';
import {
    CreateHistopatholgyService,
    CreateMultipleTestReport,
    getAllHistopathologyDashboard,
<<<<<<< HEAD
    getHistopathologyRecordById,
    getHistopathologyRecordByPatientId
=======
    getHistopathologyRecordById
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
} from '../controllers/histopathology/histopathology.controller';

const router = express.Router();

router.post("", CreateHistopatholgyService);
router.get("", getAllHistopathologyDashboard); // getAllHistopathologyPaginatedHandler
router.get("/:id", getHistopathologyRecordById);
router.post("/:id/tests", CreateMultipleTestReport);
<<<<<<< HEAD
router.get("/patient/:id", getHistopathologyRecordByPatientId);
=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
////test/:id to post to post all exam/result
/// put /:id to update record details
export default router;