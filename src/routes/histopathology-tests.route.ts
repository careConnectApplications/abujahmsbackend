import express from 'express';
import { CreateReportTest, getAllHistopathologyExamRecordPaginatedHandler, getHistopathologyTestById, getHistopathologyTestDetails } from '../controllers/histopathology/histopathologytest.controller';

const router = express.Router();

router.post("", CreateReportTest);
router.get("/:id", getHistopathologyTestById);
router.get("", getAllHistopathologyExamRecordPaginatedHandler);
router.get("/test-details/:id", getHistopathologyTestDetails)

export default router;