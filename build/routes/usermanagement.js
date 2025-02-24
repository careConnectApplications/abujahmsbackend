"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usermanagement_1 = require("../controllers/usermanagment/usermanagement");
const router = express_1.default.Router();
router.get('/getallusers', usermanagement_1.getallusers);
router.put('/updateusers/:id', usermanagement_1.updateusers);
router.put('/updatestatus/:id', usermanagement_1.updatestatus);
router.post('/bulkuploadusers', usermanagement_1.bulkuploadusers);
//updateusers
exports.default = router;
