import express from 'express';
import {protect} from "../utils/middleware";
import {readAllfamilyplanningByPatient, updatefamilyplanning, createfamilyplanning} from '../controllers/familyplanning/familyplanning';
const router = express.Router();


router.post('/createfamilyplanning/:id', createfamilyplanning);
router.put('/updatefamilyplanning/:id', updatefamilyplanning);
router.get('/readallfamilyplanningbypatient/:patient', readAllfamilyplanningByPatient);



export default router;

