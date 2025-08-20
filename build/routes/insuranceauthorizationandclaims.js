"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//
//scheduleappointment
const express_1 = __importDefault(require("express"));
const insuranceandclaims_1 = require("../controllers/insuranceclaimsandauthorization/insuranceandclaims");
const router = express_1.default.Router();
router.get('/readawaitingauthorizationradiologyoptimized', insuranceandclaims_1.groupreadAwaitingAuthorizationRadiologyoptimized);
router.get('/readawaitingauthorizationprocedureoptimized', insuranceandclaims_1.groupreadAwaitingAuthorizationProcedureoptimized);
router.get('/readawaitingauthorizationpharmacytransaction', insuranceandclaims_1.groupreadawatingauthorizationpharmacytransaction);
router.get('/readawaitingauthorizationlabtransaction', insuranceandclaims_1.groupreadawatingauthorizationlabtransaction);
router.get('/readallhistopathologyawaitingauthorization', insuranceandclaims_1.readallhistopathologyAwaitingAuthorization);
router.get('/readallbyreferenceid', insuranceandclaims_1.readallbyreferenceid);
router.post('/authorizeclaims/:referencecategory/:id', insuranceandclaims_1.authorizeTransaction);
router.get('/fetchinsuranceclaims', insuranceandclaims_1.fetchInsuranceClaims);
router.put('/updateinsuranceclaimstatus/:claimId', insuranceandclaims_1.updateInsuranceClaimStatus);
router.post('/groupauthorizeclaims/:referencecategory/:testid', insuranceandclaims_1.authorizeTransactiongroup);
exports.default = router;
