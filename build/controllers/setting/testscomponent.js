"use strict";
/*
testsubcomponent:[
      {type:"widal", subcomponent:["Salmonella Typhi A (O) (H)","Salmonella Paratyphi A (O) (H)","Salmonella Paratyphi B (O) (H)","Salmonella Paratyphi C (O) (H)","Diagnostic Titre","Monocytes","Eosinophils","Basophils","Comments"]},
      {type:"PCV", subcomponent:["PCV%"]},
      {type:"ESR", subcomponent:["ESR (mm/hr)"]},
      {type:"Clothing Profile", subcomponent:["PT (Seconds)","APTT (Seconds)","INR"]},
      {type:"combo Test", subcomponent:["HbsAg","HbsAb","HbeAg","HbeAb","HbcAb"]},
*/
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
exports.createtestcomponents = void 0;
exports.getalltestcomponent = getalltestcomponent;
exports.gettestcomponentbytestname = gettestcomponentbytestname;
exports.updatetestcomponents = updatetestcomponents;
const config_1 = __importDefault(require("../../config"));
const testcomponent_1 = require("../../dao/testcomponent");
const otherservices_1 = require("../../utils/otherservices");
//add patiient
var createtestcomponents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testname, subcomponients } = req.body;
        // 
        //validate service category
        (0, otherservices_1.validateinputfaulsyvalue)({ testname, subcomponients });
        // validate that testname exist in lab service type
        //validation
        const foundtestname = yield (0, testcomponent_1.readonetestcomponent)({ testname }, '');
        //update servicetype for New Patient Registration
        if (foundtestname) {
            throw new Error(`Test name ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, testcomponent_1.createtestcomponent)({ testname, subcomponients });
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.createtestcomponents = createtestcomponents;
//read all service type
function getalltestcomponent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, testcomponent_1.readalltestcomponent)({}, '');
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
function gettestcomponentbytestname(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { testname } = req.params;
            const queryresult = yield (0, testcomponent_1.readalltestcomponent)({ testname }, '');
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
function updatetestcomponents(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { testname, subcomponients } = req.body;
            (0, otherservices_1.validateinputfaulsyvalue)({ testname, subcomponients });
            const foundtestname = yield (0, testcomponent_1.readonetestcomponent)({ _id: id }, '');
            //update servicetype for New Patient Registration
            if (!foundtestname) {
                throw new Error(`Test name ${config_1.default.error.errornotfound}`);
            }
            var queryresult = yield (0, testcomponent_1.updatetestcomponent)({ _id: id }, { testname, subcomponients });
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
/*
export async function gettestcomponent(req:Request, res:any){
  try{
     
      const queryresult = await readoneservicetype({category: configuration.category[1]},'');
      res.status(200).json({
          queryresult,
          status:true
        });

  }
  catch(e:any){
      res.status(403).json({status: false, msg:e.message});

  }

}
  */
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
