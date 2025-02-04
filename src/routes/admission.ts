import express from 'express';
import {protect} from "../utils/middleware";
import {referadmission} from '../controllers/admissions/admission';
const router = express.Router();


router.post('/referadmission/:id', referadmission);

export default router;

