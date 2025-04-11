import express from 'express';
import {protect} from "../utils/middleware";
import {readAlldeliverynoteByPatient, updatedeliverynote, createdeliverynote} from '../controllers/deliverynote/deliverynote';
const router = express.Router();


router.post('/createdeliverynote/:id', createdeliverynote);
router.put('/updatedeliverynote/:id', updatedeliverynote);
router.get('/readalldeliverynotepatient/:patient', readAlldeliverynoteByPatient);



export default router;

