import express from 'express';
import { CreateReportTest, getAllHistopathologyExamRecordPaginatedHandler, getHistopathologyTestById } from '../controllers/histopathology/histopathologytest.controller';

const router = express.Router();

router.post("", CreateReportTest);
router.get("/:id", getHistopathologyTestById);
router.get("", getAllHistopathologyExamRecordPaginatedHandler);

export default router;