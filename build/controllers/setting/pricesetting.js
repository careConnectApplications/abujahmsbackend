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
exports.getpriceofservice = exports.createprices = void 0;
exports.getallprices = getallprices;
exports.updateprices = updateprices;
exports.updatepricestatus = updatepricestatus;
exports.searchtest = searchtest;
exports.searchprocedure = searchprocedure;
exports.searchradiology = searchradiology;
const config_1 = __importDefault(require("../../config"));
const price_1 = require("../../dao/price");
const otherservices_1 = require("../../utils/otherservices");
const audit_1 = require("../../dao/audit");
const pricingmodel_1 = require("../../dao/pricingmodel");
const patientmanagement_1 = require("../../dao/patientmanagement");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const hmocategorycover_1 = require("../../dao/hmocategorycover");
//add patiient
var createprices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var { servicecategory, amount, servicetype, isHMOCover } = req.body;
        if (!isHMOCover) {
            isHMOCover = config_1.default.ishmo[0];
        }
        //validate that category is in the list of accepted category
        /*
        if(!((configuration.settings.servicecategory).includes(servicecategory))){
          throw new Error(configuration.error.errorservicecategory);

        }
          */
        //get token from header
        // var settings =await configuration.settings();
        const foundPricingmodel = yield (0, pricingmodel_1.readonepricemodel)({ pricingtype: config_1.default.pricingtype[1] });
        if (req.body.servicecategory == config_1.default.category[3] && !foundPricingmodel) {
            req.body.servicetype = config_1.default.category[3];
        }
        //validation
        (0, otherservices_1.validateinputfaulsyvalue)({ servicecategory, amount, servicetype });
        const foundPrice = yield (0, price_1.readoneprice)({ servicecategory, servicetype, isHMOCover });
        //update servicetype for New Patient Registration
        if (foundPrice) {
            throw new Error(`service category and type ${config_1.default.error.erroralreadyexit}`);
        }
        const queryresult = yield (0, price_1.createprice)(req.body);
        const { firstName, lastName } = (req.user).user;
        var actor = `${firstName} ${lastName}`;
        yield (0, audit_1.createaudit)({ action: "Created Price", actor, affectedentity: servicetype });
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.createprices = createprices;
//read all patients
function getallprices(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryresult = yield (0, price_1.readallprices)({}, {});
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
function updateprices(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id } = req.params;
            const { firstName, lastName } = (req.user).user;
            var actor = `${firstName} ${lastName}`;
            var queryresult = yield (0, price_1.updateprice)(id, req.body);
            yield (0, audit_1.createaudit)({ action: "Updated Price", actor, affectedentity: queryresult.servicetype });
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
function updatepricestatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const response = yield (0, price_1.readoneprice)({ _id: id });
            const status = (response === null || response === void 0 ? void 0 : response.status) == config_1.default.status[0] ? config_1.default.status[1] : config_1.default.status[0];
            const queryresult = yield (0, price_1.updateprice)(id, { status });
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
function searchtest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { searchparams } = req.params;
            const queryresult = yield (0, price_1.readallprices)({ servicecategory: config_1.default.category[2], servicetype: { $regex: searchparams, $options: 'i' } }, { servicetype: 1, _id: 0 });
            res.status(200).json({
                queryresult: queryresult.pricedetails,
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//search procedure
function searchprocedure(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { searchparams } = req.params;
            const queryresult = yield (0, price_1.readallprices)({ servicecategory: config_1.default.category[5], servicetype: { $regex: searchparams, $options: 'i' } }, { servicetype: 1, _id: 0 });
            res.status(200).json({
                queryresult: queryresult.pricedetails,
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//search radiology
//search procedure
function searchradiology(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { searchparams } = req.params;
            const queryresult = yield (0, price_1.readallprices)({ servicecategory: config_1.default.category[4], servicetype: { $regex: searchparams, $options: 'i' } }, { servicetype: 1, _id: 0 });
            res.status(200).json({
                queryresult: queryresult.pricedetails,
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//get price of services /////////////
exports.getpriceofservice = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const { servicetype } = req.body;
    // Validate inputs early
    if (!id || !servicetype) {
        throw new Error("Patient ID and service type are required.");
    }
    // Fetch patient with insurance populated
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, "insurance", "");
    if (!foundPatient) {
        throw new Error(`Patient does not ${config_1.default.error.erroralreadyexit}`);
    }
    // Fetch price for the service type
    const price = yield (0, price_1.readoneprice)({ servicetype });
    if ((price === null || price === void 0 ? void 0 : price.amount) == null) {
        throw new Error(`${config_1.default.error.errornopriceset} ${servicetype}`);
    }
    // Get HMO coverage percentage or default to 0
    let insurance = yield (0, hmocategorycover_1.readonehmocategorycover)({ hmoId: (_a = foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.insurance) === null || _a === void 0 ? void 0 : _a._id, category: price.servicecategory }, { hmopercentagecover: 1 });
    const hmoPercentageCover = (_b = insurance === null || insurance === void 0 ? void 0 : insurance.hmopercentagecover) !== null && _b !== void 0 ? _b : 0;
    // Calculate patient amount
    const amount = (0, otherservices_1.calculateAmountPaidByHMO)(Number(hmoPercentageCover), Number(price.amount));
    // Respond with calculated amount
    res.status(200).json({ price: amount, status: true });
}));
