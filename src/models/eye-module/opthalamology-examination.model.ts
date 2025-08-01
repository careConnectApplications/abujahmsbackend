import mongoose, { Schema } from "mongoose";

const eyeSideSchema = {
    OD: { type: String, trim: true },
    OS: { type: String, trim: true }
};

export const ophthalmologyExaminationSchema = new Schema({
    slitLamp: {
        adnexa: eyeSideSchema,
        lids: eyeSideSchema,
        tearBreak: eyeSideSchema,
        conjunctiva: eyeSideSchema,
        cornea: eyeSideSchema,
        antChamber: eyeSideSchema,
        depth: eyeSideSchema,
        cells: eyeSideSchema,
        flare: eyeSideSchema,
        iris: eyeSideSchema,
        colour: eyeSideSchema,
        angles: eyeSideSchema,
        pupil: eyeSideSchema,
        lens: eyeSideSchema,
        clarity: eyeSideSchema,
        antCaps: eyeSideSchema,
        postCaps: eyeSideSchema,
        cortex: eyeSideSchema,
        nucleus: eyeSideSchema
    },
    ophthalmoscopy: {
        opticDisc: eyeSideSchema,
        size: eyeSideSchema,
        ratio: eyeSideSchema,
        appearance: eyeSideSchema,
        nerveFiber: eyeSideSchema,
        retina: eyeSideSchema,
        macula: eyeSideSchema,
        postRetina: eyeSideSchema,
        vessels: eyeSideSchema,
        periphery: eyeSideSchema,
        vitreous: eyeSideSchema
    },

    refraction: {
        sphere: eyeSideSchema,
        cyl: eyeSideSchema,
        axis: eyeSideSchema,
        add: eyeSideSchema,
        hPrism: eyeSideSchema,
        hBase: eyeSideSchema,
        vPrism: eyeSideSchema,
        vBase: eyeSideSchema,
        vc: eyeSideSchema,
        bcva: eyeSideSchema
    },
    phorias: {
        distAt: {
            unnamed: String,
            horizontal: { type: String, trim: true },
            vertical: { type: String, trim: true },
            base: { type: String, trim: true },
            refEye: { type: String, trim: true },
        },
        nearAt: {
            unnamed: String,
            horizontal: { type: String, trim: true },
            vertical: { type: String, trim: true },
            base: { type: String, trim: true },
            refEye: { type: String, trim: true },
        },
        method: {
            input1: { type: String, trim: true },
            input2: { type: String, trim: true },
        }
    },
    nextAppointmentDate: { type: Date, default: null }
}, { timestamps: true });

const ophthalmologyExamination = mongoose.model("OphthalmologyExamination", ophthalmologyExaminationSchema);
export default ophthalmologyExamination;