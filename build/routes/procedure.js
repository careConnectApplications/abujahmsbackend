"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//
//scheduleappointment
const express_1 = __importDefault(require("express"));
const procedure_1 = require("../controllers/procedure/procedure");
const router = express_1.default.Router();
router.post('/scheduleprocedureorder/:id', procedure_1.scheduleprocedureorder);
router.get('/readallprocedurebypatient/:id', procedure_1.readAllprocedureByPatient);
router.get('/readallprocedurebyclinic/:clinic', procedure_1.readAllprocedureByClinic);
router.put('/updateprocedure/:id', procedure_1.updateprocedures);
router.post('/uploadprocedureresult/:id', procedure_1.uploadprocedureresult);
//readAllprocedureByClinic
//uploadradiologyresult
exports.default = router;
