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
exports.createward = void 0;
exports.getallward = getallward;
exports.updateward = updateward;
const config_1 = __importDefault(require("../../config"));
const wardmanagement_1 = require("../../dao/wardmanagement");
const clinics_1 = require("../../dao/clinics");
const otherservices_1 = require("../../utils/otherservices");
const audit_1 = require("../../dao/audit");
//add patiient
var createward = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bedspecialization, wardname, totalbed, occupiedbed } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ bedspecialization, wardname });
        (0, otherservices_1.validateinputfornumber)({ totalbed, occupiedbed });
        //validate that totalbed is created or equal to occupiedbed
        if (occupiedbed > totalbed) {
            throw new Error(`Occupied bed ${config_1.default.error.errorgreaterthan} Total bed`);
        }
        const vacantbed = totalbed - occupiedbed;
        var wardid = `${wardname[0]}${(0, otherservices_1.generateRandomNumber)(5)}${wardname[wardname.length - 1]}`;
        //validate specialization
        const foundSpecilization = yield (0, clinics_1.readoneclinic)({ clinic: bedspecialization }, '');
        if (!foundSpecilization) {
            throw new Error(`Specialization doesnt ${config_1.default.error.erroralreadyexit}`);
        }
        // validate ward
        const foundWard = yield (0, wardmanagement_1.readonewardmanagement)({ wardname }, '');
        if (foundWard) {
            throw new Error(`Ward ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, wardmanagement_1.createwardmanagement)({ bedspecialization, vacantbed, wardname, totalbed, occupiedbed, wardid });
        const { firstName, lastName } = (req.user).user;
        var actor = `${firstName} ${lastName}`;
        yield (0, audit_1.createaudit)({ action: "Created Ward", actor, affectedentity: wardname });
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.createward = createward;
//read all wards
function getallward(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, wardmanagement_1.readallwardmanagement)({}, '');
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
//update ward
function updateward(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { bedspecialization, totalbed, occupiedbed } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ bedspecialization });
            (0, otherservices_1.validateinputfornumber)({ totalbed, occupiedbed });
            //validate that totalbed is created or equal to occupiedbed
            if (occupiedbed > totalbed) {
                throw new Error(`Occupied bed ${config_1.default.error.errorgreaterthan} Total bed`);
            }
            const vacantbed = totalbed - occupiedbed;
            var queryresult = yield (0, wardmanagement_1.updatewardmanagement)(id, { bedspecialization, vacantbed, totalbed, occupiedbed });
            const { firstName, lastName } = (req.user).user;
            var actor = `${firstName} ${lastName}`;
            yield (0, audit_1.createaudit)({ action: "Updated Ward", actor, affectedentity: queryresult.wardname });
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
