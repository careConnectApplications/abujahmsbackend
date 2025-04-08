import express from 'express';
import {protect} from "../utils/middleware";
import {readAllimmunizationByPatient, updateimmunizations, createimmunizations} from '../controllers/immunization/immunization';
const router = express.Router();


router.post('/createimmunizations/:id', createimmunizations);
router.put('/updateimmunizations/:id', updateimmunizations);
router.get('/readallimmunizationbypatient/:patient', readAllimmunizationByPatient);



export default router;

