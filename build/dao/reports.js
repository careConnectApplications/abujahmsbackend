"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readpatientsmanagementaggregate = readpatientsmanagementaggregate;
exports.readpaymentaggregate = readpaymentaggregate;
exports.readhmoaggregate = readhmoaggregate;
exports.readappointmentaggregate = readappointmentaggregate;
exports.readadmissionaggregate = readadmissionaggregate;
exports.readclinicaggregate = readclinicaggregate;
exports.readwardaggregate = readwardaggregate;
exports.readprocedureaggregate = readprocedureaggregate;
exports.readlabaggregate = readlabaggregate;
exports.readradiologyaggregate = readradiologyaggregate;
exports.readprescriptionaggregate = readprescriptionaggregate;
exports.readnutritionaggregate = readnutritionaggregate;
exports.readimmunizationaggregate = readimmunizationaggregate;
exports.readfamilyaggregate = readfamilyaggregate;
exports.readthirdstageLabouraggregate = readthirdstageLabouraggregate;
exports.readsecondstageLabouraggregate = readsecondstageLabouraggregate;
exports.readfirststageLabouraggregate = readfirststageLabouraggregate;
exports.readmortalityregisteraggregate = readmortalityregisteraggregate;
exports.readbirthregisteraggregate = readbirthregisteraggregate;
const payment_1 = __importDefault(require("../models/payment"));
const admission_1 = __importDefault(require("../models/admission"));
const appointment_1 = __importDefault(require("../models/appointment"));
const clinics_1 = __importDefault(require("../models/clinics"));
const wardmanagement_1 = __importDefault(require("../models/wardmanagement"));
const hmomanagement_1 = __importDefault(require("../models/hmomanagement"));
const procedure_1 = __importDefault(require("../models/procedure"));
const lab_1 = __importDefault(require("../models/lab"));
const radiology_1 = __importDefault(require("../models/radiology"));
const prescription_1 = __importDefault(require("../models/prescription"));
const patientmanagement_1 = __importDefault(require("../models/patientmanagement"));
const nutrition_1 = __importDefault(require("../models/nutrition"));
const immunization_1 = __importDefault(require("../models/immunization"));
const familyplanning_1 = __importDefault(require("../models/familyplanning"));
const maternity_1 = require("../models/maternity");
function readpatientsmanagementaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield patientmanagement_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
function readpaymentaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield payment_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
function readhmoaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield hmomanagement_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
function readappointmentaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield appointment_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
function readadmissionaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield admission_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
function readclinicaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield clinics_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e.message);
            throw new Error("Failed to update report");
        }
    });
}
function readwardaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield wardmanagement_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
function readprocedureaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield procedure_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
//  lab aggregate
function readlabaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield lab_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
//radiology
function readradiologyaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield radiology_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
//Prescription
function readprescriptionaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prescription_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
//nutrition
function readnutritionaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield nutrition_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
//immunization
function readimmunizationaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield immunization_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
//family planning
function readfamilyaggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield familyplanning_1.default.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
// Maternity aggregates
function readthirdstageLabouraggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield maternity_1.ThirdStageLabour.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
function readsecondstageLabouraggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield maternity_1.SecondStageLabour.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
function readfirststageLabouraggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield maternity_1.FirstStageLabour.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
function readmortalityregisteraggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield maternity_1.MortalityRegister.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
function readbirthregisteraggregate(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield maternity_1.BirthRegister.aggregate(input);
        }
        catch (e) {
            console.log(e);
            throw new Error("Failed to update report");
        }
    });
}
