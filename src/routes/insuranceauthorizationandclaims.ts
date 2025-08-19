//
//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
import{readallbyreferenceid,groupreadAwaitingAuthorizationRadiologyoptimized,groupreadAwaitingAuthorizationProcedureoptimized,groupreadawatingauthorizationpharmacytransaction,groupreadawatingauthorizationlabtransaction,readallhistopathologyAwaitingAuthorization,authorizeTransaction,fetchInsuranceClaims,updateInsuranceClaimStatus}  from '../controllers/insuranceclaimsandauthorization/insuranceandclaims';
const router = express.Router();

router.get('/readawaitingauthorizationradiologyoptimized', groupreadAwaitingAuthorizationRadiologyoptimized);
router.get('/readawaitingauthorizationprocedureoptimized', groupreadAwaitingAuthorizationProcedureoptimized);
router.get('/readawaitingauthorizationpharmacytransaction', groupreadawatingauthorizationpharmacytransaction);
router.get('/readawaitingauthorizationlabtransaction', groupreadawatingauthorizationlabtransaction);
router.get('/readallhistopathologyawaitingauthorization', readallhistopathologyAwaitingAuthorization);
router.get('/readallbyreferenceid', readallbyreferenceid);  
router.post('/authorizeclaims/:referencecategory/:id', authorizeTransaction); 
router.get('/fetchinsuranceclaims', fetchInsuranceClaims);
router.put('/updateinsuranceclaimstatus/:claimId', updateInsuranceClaimStatus);

 









export default router;
