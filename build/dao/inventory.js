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
exports.readallinventory = readallinventory;
exports.createinventory = createinventory;
exports.readoneinventory = readoneinventory;
exports.updateinventory = updateinventory;
exports.updateinventoryquery = updateinventoryquery;
const inventory_1 = __importDefault(require("../models/inventory"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallinventory(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const inventorydetails = yield inventory_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totalinventorydetails = yield inventory_1.default.find(query).countDocuments();
            return { inventorydetails, totalinventorydetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createinventory(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //console.log('///////////',input);
            const inventory = new inventory_1.default(input);
            return yield inventory.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readoneinventory(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield inventory_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  inventory  by id
function updateinventory(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const inventory = yield inventory_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!inventory) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return inventory;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updateinventoryquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const inventory = yield inventory_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!inventory) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return inventory;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
