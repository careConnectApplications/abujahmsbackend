"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.preliminaryTestSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.preliminaryTestSchema = new mongoose_1.Schema({
    visualAcuityUnaided: {
        far: { DIST: String, OD: String, OS: String, OU: String },
        near: { DIST: String, OD: String, OS: String, OU: String },
        pH: { DIST: String, OD: String, OS: String, OU: String },
    },
    visualAcuityAided: {
        far: { OD: String, OS: String, OU: String },
        near: { OD: String, OS: String, OU: String },
        pH: { OD: String, OS: String, OU: String },
    },
    countingFingers: {
        OD: { type: String },
        OS: { type: String },
    },
    handMovement: {
        OD: { type: String },
        OS: { type: String },
    },
    lightPerception: {
        OD: { type: String },
        OS: { type: String },
    },
    noLightPerception: { OD: { type: String }, OS: { type: String }, },
    lightProjection: {
        OD: {
            top: String,
            bottom: String,
            left: String,
            right: String
        },
        OS: {
            top: String,
            bottom: String,
            left: String,
            right: String
        }
    },
    pachymetry: {
        OD: { name: String, date: { type: Date } },
        OS: { name: String, date: { type: Date } },
    },
    tonometry: {
        OD: { name: String, methodOrTime: { type: Date } },
        OS: { name: String, methodOrTime: { type: Date } },
    },
    glaucomaFlowsheet: {
        visualFields: { OD: { type: String }, OS: { type: String }, },
        cupDiskRatio: { OD: { type: String }, OS: { type: String }, },
        iop: { OD: { type: String }, OS: { type: String }, },
    },
    pupillaryDistance: {
        far: { OD: String, OS: String, OU: String },
        near: { OD: String, OS: String, OU: String }
    },
    fieldsFull: { OD: { type: String }, OS: { type: String }, },
    fieldsRestricted: { OD: { type: String }, OS: { type: String }, },
    distance: {
        reading: String,
        work: String
    },
    eyeColour: String,
    hyperEye: String,
    npc: String,
    stereopsis: String,
}, { timestamps: true });
const preliminaryTest = mongoose_1.default.model("PreliminaryTest", exports.preliminaryTestSchema);
exports.default = preliminaryTest;
