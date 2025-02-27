import { Schema, model } from "mongoose";
const obstetrichistoryschema = new Schema({
    year:Date,
    sexofchild:String,
    gestage:String,
    birthweight:String,
    lengthoflabour:String,
    placeofbirth:String,
    typeofbirth:String,
    comment:String


})
// Define the Clinic Schema
const ancSchema = new Schema({

currentmedication:String,
allergies:String,
lmp:Date,
cycle: String,
edd:Date,
gravida:String,
term:String,
preterm:String,
abortions:String, 
ectopic:String, 
stillbirths:String,
noliving:String,
obstetrichistory:[
    obstetrichistoryschema
],

obsterichistory:{
previousstillbirthornewbornloss:Boolean,
historyofthreeormoreconsecutivespontaneousabortions: Boolean,
birthweightoflastbabylessthan450: Boolean,
birthweightoflastbabygreaterthan450:Boolean,
lastpregnancyhospitaladmissionforpeteclampsia: Boolean,
previoussurgeryonreproductivetract:Boolean,
},
currenthistory:{
diagnosedsuspectedmultipleprenancy: Boolean,
agelessthan16: Boolean,
agemorethan40:Boolean,
rhesusnegative:Boolean,
vaginalbleeding:Boolean,
pelvicmass:Boolean,
diastolicbpgreaterthan90: Boolean,
},
generalmedicalhistory:{
diabetesmellitus:Boolean,
renaldisease:Boolean,
cardiacdisease:Boolean,
sicklecelldisease:Boolean,
hivpositive:Boolean,
anyotherseveremedicaldeseaseorconditionspecify:String
},
physicalexamination:{
weight:String,
bloodpressure:String,
pulse:String,
headteetheyesnosethroat:Boolean,
thyroid:Boolean,
chest:Boolean,
breasts:Boolean,
cardiovascular:Boolean,
abdomen:Boolean,
varicoseveins:Boolean,
neurologicalexam:Boolean,
externalgenitalia:Boolean,
cervixvigina:Boolean,
uterus:Boolean,
adnexa:Boolean,
anythingabnormal:String,
additionalcomment:String
},
laboratory:{
haemoglobinhaematocrit:String,
urinalysisprotientsugar:String,
vdrlorrprotientsugar:String,
boodgroupandrhesusstatus:String,
hivtest:String,
urinnemicroscopic:String,
haemoglobin:String,
others:String

},
healtheducationtopicscovered:{
nutrition:String,
restandexercise:String,
malariainpregnancy:String,
safersexinpregnancy:String,
vctforpreventionofmotertochildtrnsmissionofhiv:String,
brthandemergencyreadnessplanning:String,
alcohotobaccoorotherdrugsysed:String,
familyplanningbirthspacing:String,
infantfeedingoptions:String
},

tetanustoxod:{
tetanusfirstdose:Boolean,
tetanusfirstdosedate:Date,
tetanusseconddose:Boolean,
tetatusseonddosedate:Date,
tetanusthirddose:Boolean,
tetanusthirddosedate:Date,
tetatusfourthdose:Boolean,
tetanusfourthdosedate:Date,
tetanusfifthdose:Boolean,
tetanusfifthdosedate:Date
},
ipt:{
iptfirstdose:Boolean,
iptfirstdosedate:Date,
iptseconddose:Boolean,
iptseconddosedate:Date,
iptthirddose:Boolean,
iptthirddosedate:Date,
iptfourthdose:Boolean,
iptfourthdosedate:Date,
iptfifthdose:Boolean,
iptfifthdosedate:Date,
iptsixthdose:Boolean,
iptsixthdosedate:Date
},
ironfolategiven:{
prescription:Boolean,
tablets:Boolean,
ironfolategiven:Date
}

})

const anc = model('Anc', ancSchema);
export default anc;
