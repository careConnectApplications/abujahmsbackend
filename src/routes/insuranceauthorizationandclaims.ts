//
//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
import{readallbyreferenceid,groupreadAwaitingAuthorizationRadiologyoptimized,groupreadAwaitingAuthorizationProcedureoptimized,groupreadawatingauthorizationpharmacytransaction,groupreadawatingauthorizationlabtransaction,readallhistopathologyAwaitingAuthorization}  from '../controllers/insuranceclaimsandauthorization/insuranceandclaims';
const router = express.Router();

router.get('/readawaitingauthorizationradiologyoptimized', groupreadAwaitingAuthorizationRadiologyoptimized);
router.get('/readawaitingauthorizationprocedureoptimized', groupreadAwaitingAuthorizationProcedureoptimized);
router.get('/readawaitingauthorizationpharmacytransaction', groupreadawatingauthorizationpharmacytransaction);
router.get('/readawaitingauthorizationlabtransaction', groupreadawatingauthorizationlabtransaction);
router.get('/readallhistopathologyawaitingauthorization', readallhistopathologyAwaitingAuthorization);
router.get('/readallbyreferenceid', readallbyreferenceid);  









export default router;
