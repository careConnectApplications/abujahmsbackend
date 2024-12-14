import express from 'express';
import {createpatients,getallpatients} from '../controllers/patientmanagement/patientmanagement';
const router = express.Router();



router.post('/createpatients',createpatients);
router.get('/getallpatients',getallpatients);



export default router;
