"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pathograph_1 = require("../controllers/pathograph/pathograph");
const router = express_1.default.Router();
router.post('/createpathographs/:id', pathograph_1.createpathographs);
router.put('/updatepathographs/:id', pathograph_1.updatepathographs);
router.get('/readallpathographbypatient/:patient', pathograph_1.readAllpathographByPatient);
router.put('/markascompletepathographs/:id', pathograph_1.markascomplete);
exports.default = router;
