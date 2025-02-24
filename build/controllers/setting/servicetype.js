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
exports.createservicetypes = void 0;
exports.getallservicetypes = getallservicetypes;
exports.updateservicetypes = updateservicetypes;
exports.getpharmacyservicetype = getpharmacyservicetype;
const config_1 = __importDefault(require("../../config"));
const servicetype_1 = require("../../dao/servicetype");
const otherservices_1 = require("../../utils/otherservices");
//add patiient
var createservicetypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { servicetype, servicecategory, department } = req.body;
        //validate service category
        (0, otherservices_1.validateinputfaulsyvalue)({ servicetype, servicecategory, department });
        var id = `${servicetype[0]}${(0, otherservices_1.generateRandomNumber)(5)}${servicetype[servicetype.length - 1]}`;
        //validate that category is in the list of accepted category
        //get token from header
        /*
        var settings = await configuration.settings();
        if(req.body.servicecategory == settings.servicecategory[0]){
          req.body.servicetype=settings.servicecategory[0]
        }
          */
        //validation
        const foundservicetype = yield (0, servicetype_1.readoneservicetype)({ category: servicecategory }, '');
        //update servicetype for New Patient Registration
        if (foundservicetype) {
            throw new Error(`service category ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, servicetype_1.createservicetype)({ type: servicetype, category: servicecategory, department, id });
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.createservicetypes = createservicetypes;
//read all service type
function getallservicetypes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, servicetype_1.readallservicetype)({}, '');
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
function updateservicetypes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { servicetype, department } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ servicetype, department });
            const foundservicetype = yield (0, servicetype_1.readoneservicetype)({ _id: id }, '');
            //update servicetype for New Patient Registration
            if (!foundservicetype) {
                throw new Error(`service category ${config_1.default.error.errornotfound}`);
            }
            for (var i = 0; i < servicetype.length; i++) {
                if ((foundservicetype.type).includes(servicetype[i]))
                    throw new Error(`${servicetype[i]} ${config_1.default.error.erroralreadyexit}`);
            }
            var queryresult = yield (0, servicetype_1.updateservicetype)({ _id: id }, { $push: { type: { $each: servicetype } }, department });
            // var queryresult = await updateservicetype(id, {clinic});
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
//get pharmacy service type
function getpharmacyservicetype(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, servicetype_1.readoneservicetype)({ category: config_1.default.category[1] }, '');
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
/*
if(foundservicetype){
          for(var i =0; i < servicetype.length; i++){
            if((foundservicetype.type).includes(servicetype[i]))
            throw new Error(`${servicetype[i]} ${configuration.error.erroralreadyexit}`);

        }
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
