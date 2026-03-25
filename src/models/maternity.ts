import { Schema, model, Document } from "mongoose";

// TypeScript Interfaces
interface IMotherData {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  pulse: number;
  temperature: number;
  respiration: number;
  statusAfterDelivery: "Alive" | "Dead";
}

interface INewBornData {
  newBornStatus: "Live Birth" | "Fresh Still Birth" | "Macerated Still Birth" | "Birth with Deformities";
  apgarScore1Min: number;
  apgarScore5Min: number;
  apgarScore10Min: number;
  weightKg: number;
}

interface IBabiesData {
  liveBirth: boolean;
  freshStillBirth: boolean;
  maceratedStillBirth: boolean;
  asphyxia: boolean;
  lowBirthWeight: boolean;
  macrosomicBabies: boolean;
  earlyNeoNatalDeath: boolean;
  bornBeforeArrival: boolean;
  preMaturity: boolean;
}




interface IDeliveryData {
  placenta: "Complete" | "Retained";
  membranes: "Complete" | "Incomplete";
  cord: "Normal" | "Abnormal";
  placentaWeight: number;
  drugsGiven: string;
  bloodLoss: number;
  perinealTear: "First degree" | "Second degree" | "Third degree" | "Fourth degree";
  episiotomy: "Lateral" | "Medical" | "Others";
  bornBeforeArrival: boolean;
  obstetricComplication: string;
  obstetricCare: string;
  deliveryComment: string;
  deliveredBy: string;
  perinealStatus: "Intact" | "Not Intact";
  typeDelivery: "SVD" | "Vacuum Delivery" | "Forceps Delivery" | "Elective Caesarean Section" | "Emergency Caesarean Section";
  multipleGestation: "Twin Delivery" | "Triplet Delivery" | "Quadruplet Delivery";
  mva: string;
  obstetricsFistulaServices: string;
}

interface IFirstStageLabour extends Document {
  dateExamined: Date;
  inducedLabour: boolean;
  phase: "Active" | "Latent";
  duration: string;
  contraction: string;
  selectDrug: string;
  palpationExamination: string;
  obstetricComplication: string;
  noOfVE: string;
  lastMenstrualPeriod: Date;
  expectedDayOfDelivery: Date;
  notes: string;
  cervicalDilation: number;
  foetalHeartRate: string;
  comments: string;
  patient?: any;
  doctor?: any;
  updatedBy?:any;
}

interface ISecondStageLabour extends Document {
  modeOfDelivery: string;
  contraction: string;
  deliveryDate: Date;
  deliveryTime: string;
  duration: string;
  selectDrug: string;
  preferredDrugs: string;
  foetalMonitoring: string;
  route: string;
  obstetricComplication: string;
  obstetricCare: string;
  lastMenstrualPeriod: Date;
  expectedDayOfDelivery: Date;
  cervicalDilatation: number;
  comments: string;
  patient?: any;
  doctor?: any;
}

interface IThirdStageLabour extends Document {
  mother: IMotherData;
  newBorn: INewBornData;
  delivery: IDeliveryData;
  babiesData: IBabiesData;
  patient?: any;
  doctor?: any;
}

interface INameData {
  lastName: string;
  firstName: string;
  middleName?: string;
}

interface IBirthRegister extends Document {
  dateOfChildRegistration: Date;
  under1YearRegistration: boolean;
  sex: "Male" | "Female";
  placeOfBirth: string;
  childName: INameData;
  fatherFullName: INameData;
  motherFullName: INameData;
  motherAge: string;
  fathersStateOfOrigin: string;
  residentialAddress: string;
  phoneNumber: string;
  birthCertificateIssue: Date;
  birthCertificateCollected: Date;
  patient?: any;
}

interface IOutcomeOfVisit {
  visit: "LAMA" | "DOPR" | "Discharge" | "Refer";
  visitFor: string;
  outcomeOfVisit: "Not Treated" | "Treated" | "Admitted" | "Referred out" | "Transportation";
  associatedProblems: string;
  services: string[];
  neonatalComplications: string[];
  counselling: string[];
}

interface IPostnatalCare extends Document {
  typeOfVisit: "New" | "Revisit";
  parity: string;
  motherWeeks: string;
  motherDays: string;
  newBornWeeks: string;
  newBornDays: string;
  sexOfChild: "Male" | "Female";
  kangarooMotherCare: "Required" | "Not Required";
  numberOfBabiesDelivered: number;
  outcomeOfVisit: IOutcomeOfVisit;
  patient?: any;
  doctor?: any;
}

interface IMortalityRegister extends Document {
  name: string;
  sex: "Male" | "Female";
  dateOfBirth: Date;
  age: string;
  patientCardNumber: string;
  healthFacility: string;
  ward: string;
  state: string;
  lga: string;
  maternalMortality: boolean;
  maternalDeath: string;
  other: string;
  neonatalDeath: string;
  neonatalOther: string;
  Deathunderfive:string;
  DeathunderfiveOther:string;
    patient?: any;
}

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
const firstStageLabourSchema = new Schema<IFirstStageLabour>({
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
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null
  },
  updatedBy:String
}, {
  timestamps: true
});

// 2nd Stage Labour Schema
const secondStageLabourSchema = new Schema<ISecondStageLabour>({
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
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null
  }
}, {
  timestamps: true
});

// Subdocument schemas for 3rd Stage Labour
const motherDataSchema = new Schema({
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

const newBornDataSchema = new Schema({
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

const babiesDataSchema = new Schema({
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

const deliveryDataSchema = new Schema({
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
const thirdStageLabourSchema = new Schema<IThirdStageLabour>({
  mother: motherDataSchema,
  newBorn: newBornDataSchema,
  delivery: deliveryDataSchema,
  babiesData: babiesDataSchema,
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null
  }
}, {
  timestamps: true
});

// Birth Register Schema with subdocuments for names
const nameDataSchema = new Schema({
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

const birthRegisterSchema = new Schema<IBirthRegister>({
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
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null
  }
}, {
  timestamps: true
});

// Postnatal Care Schema with subdocument for outcome
const outcomeOfVisitSchema = new Schema({
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

const postnatalCareSchema = new Schema<IPostnatalCare>({
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
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null
  }
}, {
  timestamps: true
});

// Mortality Register Schema
const mortalityRegisterSchema = new Schema<IMortalityRegister>({
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
    enum:[
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
    enum:[
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
    type: Schema.Types.ObjectId,
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
export const FirstStageLabour = model<IFirstStageLabour>('FirstStageLabour', firstStageLabourSchema);
export const SecondStageLabour = model<ISecondStageLabour>('SecondStageLabour', secondStageLabourSchema);
export const ThirdStageLabour = model<IThirdStageLabour>('ThirdStageLabour', thirdStageLabourSchema);
export const BirthRegister = model<IBirthRegister>('BirthRegister', birthRegisterSchema);
export const PostnatalCare = model<IPostnatalCare>('PostnatalCare', postnatalCareSchema);
export const MortalityRegister = model<IMortalityRegister>('MortalityRegister', mortalityRegisterSchema);

// Export all models as default
export default {
  FirstStageLabour,
  SecondStageLabour,
  ThirdStageLabour,
  BirthRegister,
  PostnatalCare,
  MortalityRegister
};
