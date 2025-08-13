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
exports.countadmission = countadmission;
exports.readalladmission = readalladmission;
exports.createadmission = createadmission;
exports.readoneadmission = readoneadmission;
exports.updateadmission = updateadmission;
exports.updateadmissionbyquery = updateadmissionbyquery;
const admission_1 = __importDefault(require("../models/admission"));
const config_1 = __importDefault(require("../config"));
function countadmission(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield admission_1.default.countDocuments(query);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
//read all patient history
function readalladmission(query, selectquery, populatequery, populatesecondquery, populatethirdquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const admissiondetails = yield admission_1.default.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).populate(populatethirdquery);
            const totaladmissiondetails = yield admission_1.default.find(query).countDocuments();
            return { admissiondetails, totaladmissiondetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(`${config_1.default.error.errorgeneral} reading admission`);
        }
    });
}
;
function createadmission(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appointment = new admission_1.default(input);
            return yield appointment.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readoneadmission(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield admission_1.default.findOne(query).select(selectquery).populate(populatequery);
        }
        catch (err) {
            console.log(err);
            throw new Error(`${config_1.default.error.errorgeneral} creating admission`);
        }
    });
}
//update  appointment by id
function updateadmission(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const admission = yield admission_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!admission) {
                //return json  false response
                throw new Error(config_1.default.error.errorrecordnotfound);
            }
            return admission;
        }
        catch (err) {
            console.log(err);
            throw new Error(`${config_1.default.error.errorgeneral} updating admission`);
        }
    });
}
//update  appointment by query
function updateadmissionbyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const admission = yield admission_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!admission) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return admission;
        }
        catch (err) {
            console.log(err);
            throw new Error(`${config_1.default.error.errorgeneral} updating admission`);
        }
    });
}
