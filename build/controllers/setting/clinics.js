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
exports.createclinics = void 0;
exports.getallclinic = getallclinic;
exports.getonlyclinic = getonlyclinic;
exports.updateclinics = updateclinics;
const config_1 = __importDefault(require("../../config"));
const clinics_1 = require("../../dao/clinics");
const otherservices_1 = require("../../utils/otherservices");
const audit_1 = require("../../dao/audit");
//add patiient
var createclinics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { clinic, type } = req.body;
        const { firstName, lastName } = (req.user).user;
        var actor = `${firstName} ${lastName}`;
        (0, otherservices_1.validateinputfaulsyvalue)({ clinic, type });
        var id = `${clinic[0]}${(0, otherservices_1.generateRandomNumber)(5)}${clinic[clinic.length - 1]}`;
        //validate that category is in the list of accepted category
        //get token from header
        /*
        var settings = await configuration.settings();
        if(req.body.servicecategory == settings.servicecategory[0]){
          req.body.servicetype=settings.servicecategory[0]
        }
          */
        //validation
        const foundClinic = yield (0, clinics_1.readoneclinic)({ clinic }, '');
        //update servicetype for New Patient Registration
        console.log(foundClinic);
        if (foundClinic) {
            throw new Error(`clinic ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, clinics_1.createclinic)({ clinic, type, id });
        //create audit log
        yield (0, audit_1.createaudit)({ action: "Created Clinic/Department/Pharmacy", actor, affectedentity: clinic });
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.createclinics = createclinics;
//read all patients
function getallclinic(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, clinics_1.readallclinics)({}, '');
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//get only clinics
//read all patients
function getonlyclinic(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, clinics_1.readallclinics)({ type: config_1.default.clinictype[1] }, '');
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//update a price
function updateclinics(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { clinic, type } = req.body;
            const { firstName, lastName } = (req.user).user;
            var actor = `${firstName} ${lastName}`;
            (0, otherservices_1.validateinputfaulsyvalue)({ clinic, id, type });
            var queryresult = yield (0, clinics_1.updateclinic)(id, { clinic, type });
            yield (0, audit_1.createaudit)({ action: "Update Clinic/Department/Pharmacy", actor, affectedentity: clinic });
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
/*
  export async function updatepricestatus(req:any, res:any){
    const {id} = req.params;
    try{
        const response = await readoneprice({_id:id});
       const status= response?.status == configuration.status[0]? configuration.status[1]: configuration.status[0];
        const queryresult:any =await updateprice(id,{status});
        res.status(200).json({
            queryresult,
            status:true
          });

    }
    catch(e:any){
        console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

}
*/
