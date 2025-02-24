"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pricesetting_1 = require("../controllers/setting/pricesetting");
const clinics_1 = require("../controllers/setting/clinics");
const servicetype_1 = require("../controllers/setting/servicetype");
const wardmanagement_1 = require("../controllers/setting/wardmanagement");
const router = express_1.default.Router();
router.post('/createprices', pricesetting_1.createprices);
router.get('/getallprices', pricesetting_1.getallprices);
router.post('/createclinics', clinics_1.createclinics);
router.get('/getallclinic', clinics_1.getallclinic);
router.get('/getonlyclinic', clinics_1.getonlyclinic);
//getonlyclinic
router.put('/updateclinics/:id', clinics_1.updateclinics);
router.put('/updateprices/:id', pricesetting_1.updateprices);
router.put('/updatepricestatus/:id', pricesetting_1.updatepricestatus);
router.post('/createservicetypes', servicetype_1.createservicetypes);
router.get('/getallservicetypes', servicetype_1.getallservicetypes);
router.put('/updateservicetypes/:id', servicetype_1.updateservicetypes);
//getpharmacyservicetype
router.get('/getpharmacyservicetype', servicetype_1.getpharmacyservicetype);
//ward management
router.post('/createward', wardmanagement_1.createward);
router.get('/getallward', wardmanagement_1.getallward);
router.put('/updateward/:id', wardmanagement_1.updateward);
//updateward
exports.default = router;
