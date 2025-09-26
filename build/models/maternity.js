"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MortalityRegister = exports.PostnatalCare = exports.BirthRegister = exports.ThirdStageLabour = exports.SecondStageLabour = exports.FirstStageLabour = void 0;
const mongoose_1 = require("mongoose");
// Common enums that are reused across schemas
const obstetricComplicationEnum = [
    "Breech Presentation",
    "Induction of Labour",
    "Preterm Labour",
    "Manual Removal of Placenta",
    "Post-Partum Hemorrhage (PPH)",
    "Premature Rapture of Membrane (PROM)",
    "Ante Partum Hemorrhage (APH)",
    "Placenta Previa",
    "Abruptio Placenta",
    "Pre - Eclampsia",
    "Eclampsia",
    "Maternal Death",
    "Pregnancy Induced Hypertension (PIH)"
];
const selectDrugEnum = [
    "Others",
    "Dextrose Water",
    "Misoprostol",
    "Normal Saline",
    "Oxytocin"
];
const obstetricCareEnum = [
    "Manual Placenta removal",
    "Antibiotics",
    "Oxytocin",
    "Anticonvulsant",
    "Blood transfusion",
    "Others"
];
const routeEnum = [
    "Oral",
    "Intraocular",
    "Intraotic",
    "Nasal",
    "Sublingual",
    "Buccal",
    "Inhaled",
    "Enteral",
    "Rectal",
    "Vaginal",
    "Transdermal",
    "Subcutaneous",
    "Intramuscular",
    "Intravenous",
    "Intra-Arterial"
];
// 1st Stage Labour Schema
const firstStageLabourSchema = new mongoose_1.Schema({
    dateExamined: {
        type: Date,
        required: true
    },
    inducedLabour: {
        type: Boolean,
        default: false
    },
    phase: {
        type: String,
        enum: ["Active", "Latent"],
        required: true
    },
    duration: {
        type: String
    },
    contraction: {
        type: String
    },
    selectDrug: {
        type: String,
        enum: selectDrugEnum
    },
    palpationExamination: {
        type: String
    },
    obstetricComplication: {
        type: String,
        enum: obstetricComplicationEnum
    },
    noOfVE: {
        type: String,
        enum: ["1", "2", "3", "4", "5", "6"]
    },
    lastMenstrualPeriod: {
        type: Date
    },
    expectedDayOfDelivery: {
        type: Date
    },
    notes: {
        type: String
    },
    cervicalDilation: {
        type: Number,
        min: 4,
        max: 10
    },
    foetalHeartRate: {
        type: String
    },
    comments: {
        type: String
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null
    },
    doctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null
    },
    updatedBy: String
}, {
    timestamps: true
});
// 2nd Stage Labour Schema
const secondStageLabourSchema = new mongoose_1.Schema({
    modeOfDelivery: {
        type: String,
        enum: [
            "Spontaneous Vaginal Delivery (SVD)",
            "C-Section (CS)",
            "Assisted Vaginal Delivery",
            "Breech Delivery",
            "Forceps-Assisted Delivery",
            "Vacuum-Assisted Delivery",
            "Emergency C.S"
        ],
        required: true
    },
    contraction: {
        type: String
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    deliveryTime: {
        type: String
    },
    duration: {
        type: String
    },
    selectDrug: {
        type: String,
        enum: ["Dextrose Water", "Misoprostol", "Normal Saline", "Oxytocin"]
    },
    preferredDrugs: {
        type: String
    },
    foetalMonitoring: {
        type: String
    },
    route: {
        type: String,
        enum: routeEnum
    },
    obstetricComplication: {
        type: String,
        enum: obstetricComplicationEnum
    },
    obstetricCare: {
        type: String,
        enum: obstetricCareEnum
    },
    lastMenstrualPeriod: {
        type: Date
    },
    expectedDayOfDelivery: {
        type: Date
    },
    cervicalDilatation: {
        type: Number,
        min: 4,
        max: 10
    },
    comments: {
        type: String,
        maxlength: 1000
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null
    },
    doctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null
    }
}, {
    timestamps: true
});
// Subdocument schemas for 3rd Stage Labour
const motherDataSchema = new mongoose_1.Schema({
    bloodPressureSystolic: {
        type: String
    },
    bloodPressureDiastolic: {
        type: String
    },
    pulse: {
        type: String
    },
    temperature: {
        type: String
    },
    respiration: {
        type: String
    },
    statusAfterDelivery: {
        type: String,
        enum: ["Alive", "Dead"],
        required: true
    }
});
const newBornDataSchema = new mongoose_1.Schema({
    newBornStatus: {
        type: String,
        enum: ["Live Birth", "Fresh Still Birth", "Macerated Still Birth", "Birth with Deformities"],
        required: true
    },
    apgarScore1Min: {
        type: Number,
        min: 0,
        max: 10
    },
    apgarScore5Min: {
        type: Number,
        min: 0,
        max: 10
    },
    apgarScore10Min: {
        type: Number,
        min: 0,
        max: 10
    },
    weightKg: {
        type: String
    }
});
const babiesDataSchema = new mongoose_1.Schema({
    liveBirth: {
        type: Boolean,
        default: false
    },
    freshStillBirth: {
        type: Boolean,
        default: false
    },
    maceratedStillBirth: {
        type: Boolean,
        default: false
    },
    asphyxia: {
        type: Boolean,
        default: false
    },
    lowBirthWeight: {
        type: Boolean,
        default: false
    },
    macrosomicBabies: {
        type: Boolean,
        default: false
    },
    earlyNeoNatalDeath: {
        type: Boolean,
        default: false
    },
    bornBeforeArrival: {
        type: Boolean,
        default: false
    },
    preMaturity: {
        type: Boolean,
        default: false
    }
});
const deliveryDataSchema = new mongoose_1.Schema({
    placenta: {
        type: String,
        enum: ["Complete", "Retained"]
    },
    membranes: {
        type: String,
        enum: ["Complete", "Incomplete"]
    },
    cord: {
        type: String,
        enum: ["Normal", "Abnormal"]
    },
    placentaWeight: {
        type: String
    },
    drugsGiven: {
        type: String
    },
    bloodLoss: {
        type: String
    },
    perinealTear: {
        type: String,
        enum: ["First degree", "Second degree", "Third degree", "Fourth degree"]
    },
    episiotomy: {
        type: String,
        enum: ["Lateral", "Medical", "Others"]
    },
    bornBeforeArrival: {
        type: Boolean,
        default: false
    },
    obstetricComplication: {
        type: String,
        enum: obstetricComplicationEnum
    },
    obstetricCare: {
        type: String,
        enum: obstetricCareEnum
    },
    deliveryComment: {
        type: String,
        maxlength: 1000
    },
    deliveredBy: {
        type: String
    },
    perinealStatus: {
        type: String,
        enum: ["Intact", "Not Intact"]
    },
    typeofDelivery: {
        type: String,
        enum: ["SVD", "Vacuum Delivery", "Forceps Delivery", "Elective Caesarean Section", "Emergency Caesarean Section"]
    },
    multipleGestation: {
        type: String,
        enum: ["Twin Delivery", "Triplet Delivery", "Quadruplet Delivery"]
    },
    mva: {
        type: String,
        enum: ["Missed", "Induced", "Criminal"]
    },
    obstetricsFistulaServices: {
        type: String,
        enum: [
            "New cases (Women presenting with Fistula)",
            "Admitted Fistula cases",
            "First Repair",
            "Second Repair",
            "Surgery for Fistula repair",
            "Discharges after Fistula surgery",
            "Closed and dry Fistula at discharge"
        ]
    }
});
// 3rd Stage Labour Schema with all subdocuments
const thirdStageLabourSchema = new mongoose_1.Schema({
    mother: motherDataSchema,
    newBorn: newBornDataSchema,
    delivery: deliveryDataSchema,
    babiesData: babiesDataSchema,
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null
    },
    doctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null
    }
}, {
    timestamps: true
});
// Birth Register Schema with subdocuments for names
const nameDataSchema = new mongoose_1.Schema({
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String
    }
});
const birthRegisterSchema = new mongoose_1.Schema({
    dateOfChildRegistration: {
        type: Date,
        required: true
    },
    under1YearRegistration: {
        type: Boolean,
        default: false
    },
    sex: {
        type: String,
        enum: ["Male", "Female"],
        required: true
    },
    placeOfBirth: {
        type: String
    },
    childName: nameDataSchema,
    fatherFullName: nameDataSchema,
    motherFullName: nameDataSchema,
    motherAge: {
        type: String
    },
    fathersStateOfOrigin: {
        type: String
    },
    residentialAddress: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    birthCertificateIssue: {
        type: Date
    },
    birthCertificateCollected: {
        type: Date
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null
    }
}, {
    timestamps: true
});
// Postnatal Care Schema with subdocument for outcome
const outcomeOfVisitSchema = new mongoose_1.Schema({
    visit: {
        type: String,
        enum: ["LAMA", "DOPR", "Discharge", "Refer"]
    },
    visitFor: {
        type: String
    },
    outcomeOfVisit: {
        type: String,
        enum: ["Not Treated", "Treated", "Admitted", "Referred out", "Transportation"]
    },
    associatedProblems: {
        type: String,
        maxlength: 1000
    },
    services: [{
            type: String,
            enum: ["Blood pressure", "Vaginal Examination", "HB", "PCV", "Urinalysis"]
        }],
    neonatalComplications: [{
            type: String,
            enum: [
                "Newborn with danger signs",
                "Newborn with danger Signs given first dose of antibiotics and referred",
                "Neonatal Tetanus",
                "Neonatal Jaundice"
            ]
        }],
    counselling: [{
            type: String,
            enum: [
                "Maternal Nutrition",
                "Exclusive Breast Feeding",
                "Complementary Feeding",
                "Family Planning",
                "Female Genital Mutilation",
                "Infection Prevention",
                "Others"
            ]
        }]
});
const postnatalCareSchema = new mongoose_1.Schema({
    typeOfVisit: {
        type: String,
        enum: ["New", "Revisit"],
        required: true
    },
    parity: {
        type: String
    },
    motherWeeks: {
        type: String
    },
    motherDays: {
        type: String
    },
    newBornWeeks: {
        type: String
    },
    newBornDays: {
        type: String
    },
    sexOfChild: {
        type: String,
        enum: ["Male", "Female"]
    },
    kangarooMotherCare: {
        type: String,
        enum: ["Required", "Not Required"]
    },
    numberOfBabiesDelivered: {
        type: Number
    },
    outcomeOfVisit: outcomeOfVisitSchema,
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null
    },
    doctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null
    }
}, {
    timestamps: true
});
// Mortality Register Schema
const mortalityRegisterSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        enum: ["Male", "Female"],
        required: true
    },
    dateOfBirth: {
        type: Date
    },
    age: {
        type: String
    },
    patientCardNumber: {
        type: String
    },
    ward: {
        type: String
    },
    state: {
        type: String
    },
    lga: {
        type: String
    },
    maternalMortality: {
        type: Boolean,
        default: false
    },
    maternalDeath: {
        type: String,
        enum: [
            "Post-partum haemorrhage",
            "Sepsis",
            "Obstructed labour",
            "Abortion",
            "Malaria",
            "Anaemia",
            "HIV",
            "Other"
        ]
    },
    other: {
        type: String,
        maxlength: 1000
    },
    neonatalDeath: {
        type: String,
        enum: [
            "Prematurity",
            "Neonatal Tetanus",
            "⁠Continental Malformation",
            "⁠Others"
        ]
    },
    neonatalOther: {
        type: String,
        maxlength: 1000
    },
    Deathunderfive: {
        type: String,
        enum: [
            "Malaria",
            "⁠Pneumonia",
            "Malnutrition",
            "Others"
        ]
    },
    DeathunderfiveOther: {
        type: String,
        maxlength: 1000
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null
    },
}, {
    timestamps: true
});
// Add indexes for optimization
firstStageLabourSchema.index({ patient: 1 });
firstStageLabourSchema.index({ doctor: 1 });
firstStageLabourSchema.index({ dateExamined: -1 });
firstStageLabourSchema.index({ phase: 1 });
secondStageLabourSchema.index({ patient: 1 });
secondStageLabourSchema.index({ doctor: 1 });
secondStageLabourSchema.index({ deliveryDate: -1 });
secondStageLabourSchema.index({ modeOfDelivery: 1 });
thirdStageLabourSchema.index({ patient: 1 });
thirdStageLabourSchema.index({ doctor: 1 });
thirdStageLabourSchema.index({ 'mother.statusAfterDelivery': 1 });
thirdStageLabourSchema.index({ 'newBorn.newBornStatus': 1 });
birthRegisterSchema.index({ patient: 1 });
birthRegisterSchema.index({ dateOfChildRegistration: -1 });
birthRegisterSchema.index({ sex: 1 });
postnatalCareSchema.index({ patient: 1 });
postnatalCareSchema.index({ doctor: 1 });
postnatalCareSchema.index({ typeOfVisit: 1 });
mortalityRegisterSchema.index({ dateOfBirth: -1 });
mortalityRegisterSchema.index({ maternalMortality: 1 });
mortalityRegisterSchema.index({ neonatalDeath: 1 });
// Create and export models
exports.FirstStageLabour = (0, mongoose_1.model)('FirstStageLabour', firstStageLabourSchema);
exports.SecondStageLabour = (0, mongoose_1.model)('SecondStageLabour', secondStageLabourSchema);
exports.ThirdStageLabour = (0, mongoose_1.model)('ThirdStageLabour', thirdStageLabourSchema);
exports.BirthRegister = (0, mongoose_1.model)('BirthRegister', birthRegisterSchema);
exports.PostnatalCare = (0, mongoose_1.model)('PostnatalCare', postnatalCareSchema);
exports.MortalityRegister = (0, mongoose_1.model)('MortalityRegister', mortalityRegisterSchema);
// Export all models as default
exports.default = {
    FirstStageLabour: exports.FirstStageLabour,
    SecondStageLabour: exports.SecondStageLabour,
    ThirdStageLabour: exports.ThirdStageLabour,
    BirthRegister: exports.BirthRegister,
    PostnatalCare: exports.PostnatalCare,
    MortalityRegister: exports.MortalityRegister
};
