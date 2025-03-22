"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const thearteadmission_1 = require("../controllers/thearteadmission/thearteadmission");
const router = express_1.default.Router();
router.post('/refertheatreadmission/:id', thearteadmission_1.refertheatreadmission);
router.get('/getallreferedfortheatreadmission/:theatre', thearteadmission_1.getallreferedfortheatreadmission);
router.put('/updatetheatreadmissionstatus/:id', thearteadmission_1.updatetheatreadmissionstatus);
// admission from doctor
router.get('/getalltheatreadmissionbypatient/:patient', thearteadmission_1.getalltheatreadmissionbypatient);
router.get('/gettheatreadmissiontoday', thearteadmission_1.gettheatreadmissiontoday);
//gettheatreadmissiontoday
exports.default = router;
