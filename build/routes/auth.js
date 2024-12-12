"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import {registration,login,updatestatus,getallusers,getusertypes} from '../controllers/user';
const auth_1 = require("../controllers/auth/auth");
const router = express_1.default.Router();
router.post('/signup', auth_1.signup);
//getusertypes
exports.default = router;
