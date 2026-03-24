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
exports.readallpostanaetheticrecoverychart = readallpostanaetheticrecoverychart;
exports.createpostanaetheticrecoverychart = createpostanaetheticrecoverychart;
exports.readonepostanaetheticrecoverychart = readonepostanaetheticrecoverychart;
exports.updatepostanaetheticrecoverychart = updatepostanaetheticrecoverychart;
exports.updatepostanaetheticrecoverychartquery = updatepostanaetheticrecoverychartquery;
const postanaetheticrecoverychart_1 = __importDefault(require("../models/postanaetheticrecoverychart"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallpostanaetheticrecoverychart(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postanaetheticrecoverycharts = yield postanaetheticrecoverychart_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totalpostanaetheticrecoverycharts = yield postanaetheticrecoverychart_1.default.find(query).countDocuments();
            return { postanaetheticrecoverycharts, totalpostanaetheticrecoverycharts };
        }
        catch (err) {
            console.log(err);
<<<<<<< HEAD
            throw new Error("Failed to retrieve post-anaesthetic recovery chart data");
=======
            throw new Error(config_1.default.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
        }
    });
}
;
function createpostanaetheticrecoverychart(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const postanaetheticrecoverychart = new postanaetheticrecoverychart_1.default(input);
            return yield postanaetheticrecoverychart.save();
        }
        catch (err) {
            console.log(err);
<<<<<<< HEAD
            throw new Error("Failed to create post-anaesthetic recovery chart");
=======
            throw new Error(config_1.default.error.errorusercreate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
        }
    });
}
//find one
function readonepostanaetheticrecoverychart(query, selectquery, populatequery, populatequerysecond) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield postanaetheticrecoverychart_1.default.findOne(query).select(selectquery).populate(populatequery).populate(populatequerysecond).sort({ createdAt: -1 });
        }
        catch (err) {
            console.log(err);
<<<<<<< HEAD
            throw new Error("Failed to retrieve post-anaesthetic recovery chart data");
=======
            throw new Error(config_1.default.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
        }
    });
}
//update  appointment by id
function updatepostanaetheticrecoverychart(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postanaetheticrecoverychart = yield postanaetheticrecoverychart_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!postanaetheticrecoverychart) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return postanaetheticrecoverychart;
        }
        catch (err) {
            console.log(err);
<<<<<<< HEAD
            throw new Error("Failed to update post-anaesthetic recovery chart");
=======
            throw new Error(config_1.default.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
        }
    });
}
//update  appointment by query
function updatepostanaetheticrecoverychartquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postanaetheticrecoverychart = yield postanaetheticrecoverychart_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!postanaetheticrecoverychart) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return postanaetheticrecoverychart;
        }
        catch (err) {
            console.log(err);
<<<<<<< HEAD
            throw new Error("Failed to update post-anaesthetic recovery chart");
=======
            throw new Error(config_1.default.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
        }
    });
}
