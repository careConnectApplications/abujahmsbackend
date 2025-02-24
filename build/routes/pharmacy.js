"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stock_1 = require("../controllers/inventory/stock");
const pharmacy_1 = require("../controllers/pharmacy/pharmacy");
const router = express_1.default.Router();
//router.get('/getallusers',getallusers);
//router.put('/updateusers/:id', updateusers);
//router.put('/updatestatus/:id', updatestatus);
router.post('/bulkstockupload', stock_1.bulkuploadinventory);
router.get('/getallpharmacystock', stock_1.getallpharmacystock);
router.post('/createstock', stock_1.createstock);
router.put('/updatestocks/:id', stock_1.updatestocks);
//pharmacy
router.post('/pharmacyorder/:id', pharmacy_1.pharmacyorder);
router.get('/readallpharmacytransaction', pharmacy_1.readallpharmacytransaction);
router.put('/dispense/:id', pharmacy_1.dispense);
//readallpharmacytransactionbypartient
router.get('/readallpharmacytransactionbypartient/:patient', pharmacy_1.readallpharmacytransactionbypartient);
//updateusers
exports.default = router;
