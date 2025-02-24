"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patientmanagement_1 = require("../controllers/patientmanagement/patientmanagement");
const router = express_1.default.Router();
router.post('/uploadpatientphoto/:id', patientmanagement_1.uploadpix);
router.post('/createpatients', patientmanagement_1.createpatients);
router.get('/getallpatients', patientmanagement_1.getallpatients);
router.put('/updatepatients/:id', patientmanagement_1.updatepatients);
router.get('/getonepatients/:id', patientmanagement_1.getonepatients);
exports.default = router;
