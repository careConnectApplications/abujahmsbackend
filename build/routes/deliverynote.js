"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deliverynote_1 = require("../controllers/deliverynote/deliverynote");
const router = express_1.default.Router();
router.post('/createdeliverynote/:id', deliverynote_1.createdeliverynote);
router.put('/updatedeliverynote/:id', deliverynote_1.updatedeliverynote);
router.get('/readalldeliverynotepatient/:patient', deliverynote_1.readAlldeliverynoteByPatient);
exports.default = router;
