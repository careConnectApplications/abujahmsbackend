"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../utils/middleware");
//import {registration,login,updatestatus,getallusers,getusertypes} from '../controllers/user';
const auth_1 = require("../controllers/auth/auth");
const router = express_1.default.Router();
router.post('/signup', middleware_1.protect, auth_1.signup);
router.post('/signin', auth_1.signin);
router.get('/settings', auth_1.settings);
exports.default = router;
