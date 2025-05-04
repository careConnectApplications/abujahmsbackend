import express from 'express';
import {protect} from "../utils/middleware";
import {readAllnutritionByPatient, updatenutritions, createnutritions} from '../controllers/nutrition/nutrition';
const router = express.Router();


router.post('/createnutritions/:id', createnutritions);
router.put('/updatenutritions/:id', updatenutritions);
router.get('/readallnutritionbypatient/:patient', readAllnutritionByPatient);



export default router;

