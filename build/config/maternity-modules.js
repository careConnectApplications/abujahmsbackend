"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.counselling = exports.neonatalComplications = exports.services = exports.outcomeOfVisit = exports.visit = exports.sexOfChild = exports.typeOfVisit = exports.kangarooMotherCare = exports.sex = exports.deathUnderFive = exports.neonatalDeath = exports.maternalDeath = exports.obstetricsFistulaServices = exports.mva = exports.multipleGestation = exports.typeOfDelivery = exports.perinealStatus = exports.cord = exports.membranes = exports.placenta = exports.episiotomy = exports.perinealTear = exports.motherStatusAfterDelivery = exports.newBornStatus = exports.modeOfDelivery = exports.route = exports.obstetricCare = exports.cervicalDilation = exports.noOfVE = exports.obstetricComplication = exports.selectDrug = exports.phase = void 0;
exports.phase = [
    "Active",
    "Latent"
];
exports.selectDrug = [
    "Others",
    "Dextrose Water",
    "Misoprostol",
    "Normal Saline",
    "Oxytocin"
];
exports.obstetricComplication = [
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
exports.noOfVE = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6"
];
exports.cervicalDilation = {
    min: 4,
    max: 10,
    options: [4, 5, 6, 7, 8, 9, 10]
};
// Additional enums from the maternity model that might be useful
exports.obstetricCare = [
    "Manual Placenta removal",
    "Antibiotics",
    "Oxytocin",
    "Anticonvulsant",
    "Blood transfusion",
    "Others"
];
exports.route = [
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
exports.modeOfDelivery = [
    "Spontaneous Vaginal Delivery (SVD)",
    "C-Section (CS)",
    "Assisted Vaginal Delivery",
    "Breech Delivery",
    "Forceps-Assisted Delivery",
    "Vacuum-Assisted Delivery",
    "Emergency C.S"
];
exports.newBornStatus = [
    "Live Birth",
    "Fresh Still Birth",
    "Macerated Still Birth",
    "Birth with Deformities"
];
exports.motherStatusAfterDelivery = [
    "Alive",
    "Dead"
];
exports.perinealTear = [
    "First degree",
    "Second degree",
    "Third degree",
    "Fourth degree"
];
exports.episiotomy = [
    "Lateral",
    "Medical",
    "Others"
];
exports.placenta = [
    "Complete",
    "Retained"
];
exports.membranes = [
    "Complete",
    "Incomplete"
];
exports.cord = [
    "Normal",
    "Abnormal"
];
exports.perinealStatus = [
    "Intact",
    "Not Intact"
];
exports.typeOfDelivery = [
    "SVD",
    "Vacuum Delivery",
    "Forceps Delivery",
    "Elective Caesarean Section",
    "Emergency Caesarean Section"
];
exports.multipleGestation = [
    "Twin Delivery",
    "Triplet Delivery",
    "Quadruplet Delivery"
];
exports.mva = [
    "Missed",
    "Induced",
    "Criminal"
];
exports.obstetricsFistulaServices = [
    "New cases (Women presenting with Fistula)",
    "Admitted Fistula cases",
    "First Repair",
    "Second Repair",
    "Surgery for Fistula repair",
    "Discharges after Fistula surgery",
    "Closed and dry Fistula at discharge"
];
exports.maternalDeath = [
    "Post-partum haemorrhage",
    "Sepsis",
    "Obstructed labour",
    "Abortion",
    "Malaria",
    "Anaemia",
    "HIV",
    "Other"
];
exports.neonatalDeath = [
    "Prematurity",
    "Neonatal Tetanus",
    "⁠Continental Malformation",
    "⁠Others"
];
exports.deathUnderFive = [
    "Malaria",
    "⁠Pneumonia",
    "Malnutrition",
    "Others"
];
exports.sex = [
    "Male",
    "Female"
];
exports.kangarooMotherCare = [
    "Required",
    "Not Required"
];
exports.typeOfVisit = [
    "New",
    "Revisit"
];
exports.sexOfChild = [
    "Male",
    "Female"
];
exports.visit = [
    "LAMA",
    "DOPR",
    "Discharge",
    "Refer"
];
exports.outcomeOfVisit = [
    "Not Treated",
    "Treated",
    "Admitted",
    "Referred out",
    "Transportation"
];
exports.services = [
    "Blood pressure",
    "Vaginal Examination",
    "HB",
    "PCV",
    "Urinalysis"
];
exports.neonatalComplications = [
    "Newborn with danger signs",
    "Newborn with danger Signs given first dose of antibiotics and referred",
    "Neonatal Tetanus",
    "Neonatal Jaundice"
];
exports.counselling = [
    "Maternal Nutrition",
    "Exclusive Breast Feeding",
    "Complementary Feeding",
    "Family Planning",
    "Female Genital Mutilation",
    "Infection Prevention",
    "Others"
];
