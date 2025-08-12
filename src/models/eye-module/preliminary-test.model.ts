import mongoose, { Schema } from "mongoose";

export const preliminaryTestSchema = new Schema({
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

const preliminaryTest = mongoose.model("PreliminaryTest", preliminaryTestSchema);
export default preliminaryTest;