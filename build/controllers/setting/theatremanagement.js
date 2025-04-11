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
exports.createtheatre = void 0;
exports.getalltheatre = getalltheatre;
exports.updatetheatre = updatetheatre;
const config_1 = __importDefault(require("../../config"));
const theatre_1 = require("../../dao/theatre");
const clinics_1 = require("../../dao/clinics");
const otherservices_1 = require("../../utils/otherservices");
const audit_1 = require("../../dao/audit");
//add patiient
var createtheatre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bedspecialization, theatrename, totalbed, occupiedbed } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ bedspecialization, theatrename });
        (0, otherservices_1.validateinputfornumber)({ totalbed, occupiedbed });
        //validate that totalbed is created or equal to occupiedbed
        if (occupiedbed > totalbed) {
            throw new Error(`Occupied bed ${config_1.default.error.errorgreaterthan} Total bed`);
        }
        const vacantbed = totalbed - occupiedbed;
        var theatreid = `${theatrename[0]}${(0, otherservices_1.generateRandomNumber)(5)}${theatrename[theatrename.length - 1]}`;
        //validate specialization
        const foundSpecilization = yield (0, clinics_1.readoneclinic)({ clinic: bedspecialization }, '');
        if (!foundSpecilization) {
            throw new Error(`Specialization doesnt ${config_1.default.error.erroralreadyexit}`);
        }
        // validate ward
        const foundtheatre = yield (0, theatre_1.readonetheatremanagement)({ theatrename }, '');
        if (foundtheatre) {
            throw new Error(`Theatre ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, theatre_1.createtheatremanagement)({ bedspecialization, vacantbed, theatrename, totalbed, occupiedbed, theatreid });
        const { firstName, lastName } = (req.user).user;
        var actor = `${firstName} ${lastName}`;
        yield (0, audit_1.createaudit)({ action: "Created Theatre", actor, affectedentity: theatrename });
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.createtheatre = createtheatre;
//read all wards
function getalltheatre(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, theatre_1.readalltheatremanagement)({}, '');
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
function updatetheatre(req, res) {
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
            var queryresult = yield (0, theatre_1.updatetheatremanagement)(id, { bedspecialization, vacantbed, totalbed, occupiedbed });
            const { firstName, lastName } = (req.user).user;
            var actor = `${firstName} ${lastName}`;
            yield (0, audit_1.createaudit)({ action: "Updated Theatre", actor, affectedentity: queryresult.theatrename });
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
