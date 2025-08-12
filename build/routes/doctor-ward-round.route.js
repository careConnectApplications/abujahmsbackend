"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctor_ward_round_controller_1 = require("../controllers/doctor-ward-round/doctor-ward-round.controller");
const router = express_1.default.Router();
router.route("")
    .get(doctor_ward_round_controller_1.getAllDoctorWardNotes)
    .post(doctor_ward_round_controller_1.createDoctorWardNote);
router.route("/:id")
    .get(doctor_ward_round_controller_1.getDoctorWardNoteById)
    .put(doctor_ward_round_controller_1.updateDoctorWardAdmissionNote);
exports.default = router;
