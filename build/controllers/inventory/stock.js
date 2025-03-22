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
exports.createstock = void 0;
exports.bulkuploadinventory = bulkuploadinventory;
exports.getallpharmacystock = getallpharmacystock;
exports.getallpharmacystockbyphamarcy = getallpharmacystockbyphamarcy;
exports.updatestocks = updatestocks;
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../config"));
const price_1 = require("../../dao/price");
const servicetype_1 = require("../../dao/servicetype");
;
const otherservices_1 = require("../../utils/otherservices");
//bulk upload users
function bulkuploadinventory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = req.files.file;
            const filename = config_1.default.pharmacyuploadfilename;
            let allowedextension = ['.csv', '.xlsx'];
            let uploadpath = `${process.cwd()}/${config_1.default.useruploaddirectory}`;
            var columnmapping = {
                A: "category",
                B: "servicetype",
                C: "lowstocklevel",
                D: "expirationdate",
                E: "lastrestockdate",
                F: "qty",
                G: "amount",
                H: "pharmacy"
            };
            yield (0, otherservices_1.uploaddocument)(file, filename, allowedextension, uploadpath);
            //convert uploaded excel to json
            var convert_to_json = (0, otherservices_1.convertexceltojson)(`${uploadpath}/${filename}${path_1.default.extname(file.name)}`, config_1.default.stocktemplate, columnmapping);
            //console.log(convert_to_json);
            //save to database
            var { stocklist } = convert_to_json;
            if (stocklist.length > 0) {
                var type = stocklist.map((services) => { return services.servicetype; });
                for (var i = 0; i < stocklist.length; i++) {
                    stocklist[i].servicecategory = config_1.default.category[1];
                    var { servicecategory, category, servicetype, lowstocklevel, expirationdate, lastrestockdate, qty, amount, pharmacy } = stocklist[i];
                    lowstocklevel = Number(lowstocklevel);
                    qty = Number(qty);
                    (0, otherservices_1.validateinputfaulsyvalue)({ pharmacy, servicecategory, category, servicetype, lowstocklevel, expirationdate, lastrestockdate, qty, amount });
                    //ensure record does not exit
                    var id = `${servicetype[0]}${(0, otherservices_1.generateRandomNumber)(5)}${servicetype[servicetype.length - 1]}`;
                    //await  Promise.all([createmanyprice({servicecategory,servicetype},{$set:{servicecategory,category,servicetype,lowstocklevel,expirationdate,lastrestockdate,qty,amount}}),
                    //createmanyservicetype({ category:servicecategory,type: { $nin: [servicetype]} },
                    //{$push: {type: servicetype},$set:{department:servicecategory,category:servicecategory,id}}
                    //)]);
                    yield (0, price_1.createmanyprice)({ servicecategory, servicetype, pharmacy }, { $set: { servicecategory, category, servicetype, lowstocklevel, expirationdate, lastrestockdate, qty, amount, pharmacy } });
                    yield (0, servicetype_1.createmanyservicetype)({ category: servicecategory }, { $push: { type: servicetype }, $set: { department: servicecategory, category: servicecategory, id } });
                    //await  createmanyservicetype({ category:servicecategory,type: { $nin: [servicetype]} },
                    //{$push: {type: servicetype},$set:{department:servicecategory,category:servicecategory,id}}
                    //);
                }
            }
            res.status(200).json({ status: true, queryresult: 'Bulk upload was successfull' });
        }
        catch (e) {
            //logger.error(e.message);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//get all stock
function getallpharmacystock(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //const { clinic} = (req.user).user;
            const queryresult = yield (0, price_1.readallprices)({ servicecategory: config_1.default.category[1] });
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
function getallpharmacystockbyphamarcy(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { clinic } = req.params;
            const queryresult = yield (0, price_1.readallprices)({ servicecategory: config_1.default.category[1], pharmacy: clinic });
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
//add a stock
var createstock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.servicecategory = config_1.default.category[1];
        const { pharmacy, servicecategory, amount, servicetype, category, qty, lowstocklevel, expirationdate, lastrestockdate } = req.body;
        //validations
        (0, otherservices_1.validateinputfaulsyvalue)({ pharmacy, servicecategory, category, servicetype, lowstocklevel, expirationdate, lastrestockdate, qty, amount });
        //ensure record does not exit
        const foundPrice = yield (0, price_1.readoneprice)({ servicecategory, servicetype, pharmacy });
        if (foundPrice) {
            throw new Error(`${servicetype} ${config_1.default.error.erroralreadyexit}`);
        }
        //const queryresult=await createprice({servicecategory,amount,servicetype,category,qty,lowstocklevel,expirationdate,lastrestockdate} );
        var id = `${servicetype[0]}${(0, otherservices_1.generateRandomNumber)(5)}${servicetype[servicetype.length - 1]}`;
        const queryresult = yield Promise.all([
            (0, price_1.createprice)({ servicecategory, amount, servicetype, category, qty, lowstocklevel, expirationdate, lastrestockdate, pharmacy }),
            (0, servicetype_1.createmanyservicetype)({ category: servicecategory, type: { $nin: [servicetype] } }, { $push: { type: servicetype }, $set: { department: servicecategory, category: servicecategory, id } })
        ]);
        // create service type
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.createstock = createstock;
//update stock
function updatestocks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            req.body.servicecategory = config_1.default.category[1];
            const { servicecategory, amount, servicetype, category, qty, lowstocklevel, expirationdate, lastrestockdate, pharmacy } = req.body;
            //validations
            (0, otherservices_1.validateinputfaulsyvalue)({ pharmacy, servicecategory, category, servicetype, lowstocklevel, expirationdate, lastrestockdate, qty, amount });
            const foundPrice = yield (0, price_1.readoneprice)({ _id: id });
            if (!foundPrice) {
                throw new Error(`servicetype ${config_1.default.error.errornotfound}`);
            }
            if (foundPrice.servicecategory !== config_1.default.category[1]) {
                throw new Error(`${foundPrice.servicecategory} ${config_1.default.error.erroralreadyexit}`);
            }
            //var queryresult = await updateprice(id, req.body);
            var servicetypeid = `${servicetype[0]}${(0, otherservices_1.generateRandomNumber)(5)}${servicetype[servicetype.length - 1]}`;
            const queryresult = yield Promise.all([
                (0, price_1.updateprice)(id, { pharmacy, servicecategory, amount, servicetype, category, qty, lowstocklevel, expirationdate, lastrestockdate }),
                (0, servicetype_1.createmanyservicetype)({ category: servicecategory, type: { $nin: [servicetype] } }, { $push: { type: servicetype }, $set: { department: servicecategory, category: servicecategory, id: servicetypeid } })
            ]);
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
//servicetype for pharmacy
