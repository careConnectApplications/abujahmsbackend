import express from 'express';
import {protect} from "../utils/middleware";
import { updateancs, createancs, readAllancByPatient} from '../controllers/anc/anc';
const router = express.Router();


router.post('/createanc/:id', createancs);
router.put('/updateanc/:id', updateancs);
router.get('/readallancbypatient/:patient', readAllancByPatient);



export default router;

