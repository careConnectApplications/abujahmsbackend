import express from 'express';
import { CreateReportText } from '../controllers/histopathology/histopathologytest.controller';

const router = express.Router();

router.post("", CreateReportText);
export default router;