import express from 'express';
import { CreateReportTest, getHistopathologyTestById } from '../controllers/histopathology/histopathologytest.controller';

const router = express.Router();

router.post("", CreateReportTest);
router.get("/:id", getHistopathologyTestById);

export default router;