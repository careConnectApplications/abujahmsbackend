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
router.put('/updatepassword/:id', usermanagement_1.updatepassword);
router.put('/updatestatus/:id', usermanagement_1.updatestatus);
router.post('/bulkuploadusers', usermanagement_1.bulkuploadusers);
router.post('/passwordreset/:id', usermanagement_1.passwordreset);
router.get("/roles", usermanagement_1.getAllRoles);
router.put("/:id/permissions", usermanagement_1.updateUserPermissions);
router.get("/:id/permissions", usermanagement_1.getUserPermissions);
router.put("/:id/default-permissions", usermanagement_1.setUserDefaultPermission);
exports.default = router;
