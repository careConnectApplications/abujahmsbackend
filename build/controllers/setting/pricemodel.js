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
exports.createpricingmodel = void 0;
exports.getpricingmodel = getpricingmodel;
exports.updatepricingmodel = updatepricingmodel;
const config_1 = __importDefault(require("../../config"));
const pricingmodel_1 = require("../../dao/pricingmodel");
const otherservices_1 = require("../../utils/otherservices");
const audit_1 = require("../../dao/audit");
//add patiient
var createpricingmodel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { pricingtype, exactnameofancclinic, exactnameofservicetypeforadult, exactnameofservicetypeforchild } = req.body;
        const { firstName, lastName } = (req.user).user;
        var actor = `${firstName} ${lastName}`;
        (0, otherservices_1.validateinputfaulsyvalue)({ pricingtype, exactnameofancclinic, exactnameofservicetypeforadult, exactnameofservicetypeforchild });
        const foundPricingmodel = yield (0, pricingmodel_1.readonepricemodel)({});
        if (foundPricingmodel) {
            throw new Error(`Pricing Model ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, pricingmodel_1.createpricemodel)({ pricingtype, exactnameofancclinic, exactnameofservicetypeforadult, exactnameofservicetypeforchild });
        //create audit log
        yield (0, audit_1.createaudit)({ action: "Created Pricing Model", actor, affectedentity: pricingtype });
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.createpricingmodel = createpricingmodel;
//read all patients
function getpricingmodel(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, pricingmodel_1.readonepricemodel)({});
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
function updatepricingmodel(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { pricingtype, exactnameofancclinic, exactnameofservicetypeforadult, exactnameofservicetypeforchild } = req.body;
            const { firstName, lastName } = (req.user).user;
            var actor = `${firstName} ${lastName}`;
            (0, otherservices_1.validateinputfaulsyvalue)({ pricingtype, exactnameofancclinic, exactnameofservicetypeforadult, exactnameofservicetypeforchild });
            var queryresult = yield (0, pricingmodel_1.updatepricemodel)(id, { pricingtype, exactnameofancclinic, exactnameofservicetypeforadult, exactnameofservicetypeforchild });
            yield (0, audit_1.createaudit)({ action: "Update Pricing Model", actor, affectedentity: pricingtype });
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
