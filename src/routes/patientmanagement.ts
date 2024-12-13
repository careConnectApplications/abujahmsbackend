import express from 'express';
import {createpatients} from '../controllers/patientmanagement/patientmanagement';
const router = express.Router();



router.post('/createpatients',createpatients);



export default router;
