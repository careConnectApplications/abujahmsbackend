  import {readallclinics} from "./dao/clinics";
  import  {readallservicetype}  from "./dao/servicetype";
  
const configuration = {
  medicationchartfrequency:["Start","Daily","BD","TDS","QDS","PRM","NOCTE","4 Hours","8 Hours","12 Hours"],
  medicationchartroute:["oral","caudal block","continuous epidural","continuous intra-arterial infusion","continuous IV infusion","continuous nebulization","continuous subcutaneous infusion","continuous intrathecal infusion","cervical","dental","epidural","otic (ear)","endotracheal","feeding tube","G-tube",
  "hand bulb nebulizer","intra-articular","intrabursal","intra-cavernosal","intradermal","Infiltration","irrigation","inhalation","Intracardiac","intrapleural","IM"],
  defaultphonenumber:"00000000000",
  status:["inactive", "active","pending payment","paid","pending vitals","scheduled","complete","processed","pending vital","inprogress","pending","new","accept","reject"],
  admissionstatus:["toadmit","admited","totransfer","transfered","todischarge", "discharged"],
  clinictype: ["department","clinic","pharmacy","radiology","procedure"],
  defaultPassword: "HMSB",
  category:["Appointment","Pharmacy", "Lab","Patient Registration","Radiology","Procedure"],
  ishmo:["No","Yes"],

  settings: async function(){
    const {clinicdetails} = await readallclinics({},{"clinic":1, "id":1,"_id":0});
    const {servicetypedetails} = await readallservicetype({},{type:1,category:1,department:1,_id:0});

   
const servicetypedetail:any = servicetypedetails.filter((item:any)=>item.category == this.category[2]);
console.log('service', servicetypedetail);
var service:any=[];
for(var i =0; i < servicetypedetail.length ; i++){
 // var temp:any =(servicetypedetail.servicetypedetails)[i].type;
 var tem =servicetypedetail[i].type;
 service.push(...tem);

};

    
    return (
      {
        cptcodes:["Anesthesia for Procedure ans Services on the head","Anesthesia for Procedure ans Services on the neck"],
        dxcodes:["other amebic genitourinary infections","Other amebic infections"],
        priority:["Urgent", "Routine","Non-Urgent"],
        presentingcomplaints:["Ankle/Foot Symptom Or C/O Lower Limb Symptom","Anosmia","Black Faeces Or C/O Melaena","A Back Symptom","A Head Symptom"],
        diagnosis:["A04.9 Bacterial intestinal infection, unspecified","A05 Other bacterial foodborne intoxications, not elsewhere classified","A05.1 Botulism food poisoning"],
        voluntorysterilization:["Male","Female"],
        typeofiud:["Hormonal", "Copper"],
        typeofimplants:["Implanon(IMP)","Jadelle(JD)","Others"],
        nursingdiagnosis: ["Acute Confusion","Acute Substance Withdrawal","Adult Pressure Injury","Anxiety","Autonomic Dysreflexia",""],
        familyplanningyesnooption: ["Yes","No"],
        typeoffamilyplanningclient: ["Post Abortion Care (PAC)","Post-Partum Family Planning(PPFP)","Routine"],
        nameofinjectable: ["Depo medroxyprogrsterone ","Noristerat(NOR)","Others"],
        typeofbarriermethods: ["Internal Condom","External Condom","Spermicide","Sponge","Diaphragm","Cervical Cap"],
        liquor:["0","+1","+2","+3"],
        moulding:["0","+1","+2","+3"],
        cervicaldilationb:["3.0","4.0","5.0","5.5","6.0","6.5","7.0","7.5","8.0","8.5","9.0","9.5","10.0"],
        descentofhead:["5/5","4/5","3/5","2/5","1/5","0/5"],
        contraction:["1/10","2/10","3/10","4/10","5/10","6/10","7/10"],
        administrationroute:["Oral(PO)","Intravenous(IV)","intramuscular(IM)","Subcutaneous(SC or SQ)","Intradermal (ID)","Topical","Transdermal","Inhalation","Nasal","Rectal","Vaginal","Ophathalmic","Otic","Buccal","Sublingual","Intrathecal","Epidural","Intra-arterial","Intraosseous(IO)","intraperitoneal","Intracardiac","Intraocular","Intra-articular","Intravesical","Intrapleural","Intralymphatic","Intrauterine","Intracavernous","Urethral","Intrasynovial","Intralesional","Enteral(via feeding tube)","Intracerebral","Intracerebroventricular(ICV)","Percutaneous","Nasogastric","Nasoduodenal/Nasojejunal"],
        vaccinetype:["Live-Attenuated","Inactivated","Subunit,Recombinant,Polysaccharide,and conjugate", "Toxoid","mRNA","Protein Subunit","DNA","Virus-Like Particle(VLP)","Whole-cell","Autogenous","Cancer"],
        consent:["Full consent", "Partial consent","No consent","Emergency consent","Proxy or Substitute consent","Presumed","Research or Study consent","Assent and Dissent","Cultural or Community Consent"],
        immunizationstatus:["Completed","Partially completed","Not Administered"],
        reporter:["Patient reported","Provider reported","public health registry"],
        oralfluids:["Water","Beverages","Soups"],
        medication:["IV", "Oral"],
        drainage:["Chest Tubes", "Surgical Drains"],
        typeofinsulin:["Rapid-acting","Long-acting","Mixed"],
        insulinroute:["Subcutaneous","Insulin Pump"],
        insulinsymptoms:["Sweating","Dizziness","Confusion"],
        insulininterventionprovided:["Oral","Glucose","IV"],
        admissionstatus:["admited","totransfer","transfered","todischarge", "discharged"],
        medicationchartfrequency:["Start","Daily","BD","TDS","QDS","PRM","NOCTE","4 Hours","8 Hours","12 Hours"],
        medicationchartroute:["oral","caudal block","continuous epidural","continuous intra-arterial infusion","continuous IV infusion","continuous nebulization","continuous subcutaneous infusion","continuous intrathecal infusion","cervical","dental","epidural","otic (ear)","endotracheal","feeding tube","G-tube",
        "hand bulb nebulizer","intra-articular","intrabursal","intra-cavernosal","intradermal","Infiltration","irrigation","inhalation","Intracardiac","intrapleural","IM"],
        clinictype: ["department","clinic","pharmacy","radiology","procedure"],
        presentingcompalintcode:
        [
"518298011 Ankle/Foot Symptom Or C/) Lower Limb Symptom",
"543378014 Anosmia",
"517930010 Black Faeces [Symptom] Or C/O Melaena",
"271717401 C/O - A Black Symptom",
"664514017 C/O - A Head Symptom",
"664505010 C/O - A Headache",
"664483015 C/O - A Neck Symptom",
"2546333013 C/O - Akathisia",
"664489016 C/O - Ankle Symptom",
"664506011 C/O - Anosmia",
"2547486015 C/O - Bizarre Dreams",
"543047018 C/O Catarrh",
"664518019 C/O Cough",
"664515016 C/O - Debility Malaise",
"2546406013 C/O - Dreams",
"664509016 C/O - Excess Tears",
"664498018 C/O - Feeling Depressed",
"664502013 C/O - Feeling Unhappy",
"664490013 C/O Foot Symptom",
"2547153013 C/O - Illusions Seen"
        ],
        nausea:
        [
        "None",
        "Mild",
        "Moderate",
        "Severe",
        "Resolved"
        ],
        
        typeofdiet:
        [
        "Regular",
        "Diabetic",
        "Mechanical Soft",
        "Liquid",
        "Clear Liquid",
        "Sips",
        "Formula",
        "NPO"
        ],
        
        giboweleliminationpattern:
        [
        "Constipation",
        "Diarrhea",
        "Flatulence",
        "Impaction",
        "Incontinent of bowels",
        "Normal bowel pattern for Patient"
        ],
        
        bmfrequency:
        [
        "Weekly",
        "Every 3 days",
        "Every other day",
        "1-3 times per day",
        "Greater than 3 times per day"
        ],
        
        bmusualtimeoftheday:
        [
        "Morning",
        "Morning and night",
        "Afternoon",
        "Night"
        ],
        
        bmregularity:[
        "Irregular",
        "Regular"
        ],
        
        usualconsistency:[
        "Dry",
        "Normal",
        "Hard",
        "Liquid",
        "Loose",
        "Soft"
        ],
        
        consistency:[
        "Normal",
        "Soft",
        "Clots Present",
        "Creamy",
        "Dry",
        "Frothy",
        "Hard",
        "Liquid",
        "Loose",
        "Mucoid",
        "Seedy",
        "Tarry"
        ],
        
        color:
        [
        "Clay colored",
        "Black tarry",
        "Blood tinged",
        "Blood frank",
        "Bright red stool",
        "Dark red stool",
        "Brown",
        "Green",
        "Yellow",
        "Orange stool",
        "Red streaked stool"
        ],
        amount:[
        "Negative",
        "Small",
        "Moderate",
        "Large"
        ],
        
        appearance:
        [
        "Irregular contour",
        "Distended",
        "Mass",
        "rigid",
        "Distended abdominal vein",
        "Cullen's sign",
        "Distinct protrusions",
        "Rash",
        "Firm",
       "Flat",
        "Inguinal Hernia",
        "Symmetrical contour",
        "Obese",
        "Pendulous"
        ],
        
        guboweleleiminationpattern:
        [
        "Constipation",
        "Diarrhea",
        "Flatulence",
        "Impaction",
        "Incontinent of bowels",
        "Normal bowel pattern for Patient"
        ],
        
        consistencystool:
        [
        "Normal",
        "Soft",
        "Clots present",
        "Creamy",
        "Dry",
        "Frothy",
        "Hard",
        "Liquid",
        "Loose",
        "Mucoid",
        "Seedy",
        "Tarry"
      ],



apgarscoreafteroneminute:["1","2","3","4","5","6","7","8","9","10"],
deliverytype:["Vagina Delivery","Caesarean Scetion"],
delivery:["Pre-term","Term"],
typeofassisteddelivery:["Vacuum Assisted", "Forceps"],
feedingofthechild:["Exclusive Breastfeeding","Bottle Feeding","Both"],
immunization:["Fully Immunized","Ongoing Immunization","Not Fully Immunized"],
heartsound:[
"Abnormal S1",
"S4",
"Abnormal S2",
"S3",
"Absent S2",
"Split S1",
"Normal heart Sounds",
"Loud S1",
"S1",
"Normal S2",
"Normal S3 in young person",
"S3 gallop",
"Reduced intensity S1",
"Split S2"

],
heartmurmurgrade:
[
"Heart murmur grade I",
"Heart murmur grade II",
"Heart murmur grade III",
"Heart murmur grade IV",
"Heart murmur grade V",
"Heart murmur grade VI"
],
heartmurmurpitch:[
"Crescendo murmur",
"Crescendo-desrescendo murmur",
"Desrescendo murmur",
"High- pitched",
"low- pitched",
"medium- pitched"
],
murmurlocationausculation:[  
"Apical",
"Base",
"2nd intercoastal space",
"3rd  intercoastal space",
"4th  intercoastal space",
"5th  intercoastal space",
"Left midclavicular line",
"Left sternal border",
"Right  sternal border"
],
	jugularveindistention:[  
"present",
"Absent"
  ]
,
heartmurmurquality:[ 
"Musical",
"Squeaking",
"Blowing",
"Harsh",
"Rumbling"
],
heartmurmurtiming:[
"Early diastolic",
"Early systolic",
"late diastolic",
"late systolic",
"mid diastolic",
"mid systolic",
"pansystolic/holosystolic"
],
murmurradiatingtobodylocation:[
"Apex",
"Left Axilla",
"Neck"
],
temperatureextremities:[
"Cold",
"Hot",
"Warm" 
],

tissueperfusionassessmentimpression:[
"Within defined limits",
"other"
],
respiratoryrhythm:[
"Acidotic hyperventilation",
"Air hunger",
"Apneustic",
"Blots",
"Cheyne-strokes",
"Cluster breathing",
"Dyspnea",
"Gasping for air",
"Irregular breathing",
"Sighing"
],
respiratoryeffort:[
"Unlabored",
"Labored",
"Accessory muscle used",
"Orthopnea",
"Dyspnea"
],
breathingsoundausculation:[
"Clear",
"Rales/crackles",
"Stridor",
"Rhonchus",
"Wheezes"
],
respiratoryassessmentimpression:[
"Within defined limits",
"Others"
],
localizedbreathsounds:[
"Left lung",
"Right lung",
"Bilateral lungs",
"Right upper lobe",
"Left upper lobe",
"Right lower lobe",
"Left lower lobe",
"Right middle lobe",
"Left lung base",
"Right lung base",
"Bilateral lung bases"
],
bowelsoundausculation:[
"Bowel sound absent",
"Hyperactive bowel sound",
"Bowel sound loud",
"Bowel sound quiet",
"Hypoactive bowel sounds",
"Normal bowel sounds",
"Tympanic bowel sounds"
],
bsquadausculation:[
"RLQ",
"RUQ",
"LLQ",
"LUQ"
],
bowelsoundbyqualityausculation:[
"Tinkling",
"Borborgymi",
"High pitched",
"Low pitched"
],
physiologicfindingbypalpation:[
"Guarding",
"Mass",
"Rigid",
"Firm",
"No guarding",
"Tender",
"Rebound tenderness",
"Taut"
],

gIassessmentimpression:[
"Within defined limits",
"Others"
],
urineturbidity:[
"Clear",
"cloudy"
],
voidingpattern:[
"Anuria",
"Hesitancy",
"Dribbling",
"Dysuria",
"Put on hemodialysis",
"Incontinence",
"Condom catheter",
"Increased urinary frequency",
"Intermittent urinary incontinence",
"Strains to void",
"Nocturia",
"Enuresis",
"Voids spontaneously without difficulty",
"Oliguria",
"Patient on peritoneal dialysis",
"Polyuria",
"Suprapubic catheter",
"Unable to void",
"Urethra catheter",
"Urgency",
"Urostomy"
],
otherelementurine:[
"Mucous threads",
"Stones",
"Sediments",
"Clots"
],

urinecollectiondevice:[
"Condom catherter",
"Suprapubic catherter",
"Urethral catherter",
"Foley catherter",
"Urostomy"
],

genitourinaryassessmentimpression:[
"Within defined limits",
"Others",
],


voidingpatterngu:[
"Anuria",
"Hesitancy",
"Dribbling",
"Dysuria",
"Put on hemodialysis",
"Incontinence",
"Condom catheter",
"Increased urinary frequency",
"Intermittent urinary incontinence",
"Strains to void",
"Nocturia",
"Enuresis",
"Voids spontaneously without difficulty",
"Oliguria"

],
levelofconsciousness:[
"Confussed",
"Lethargic",
"Obtunded",
"Stuporous",
"Unresponsive",
"Alert"
],

personalbar:[
"Yes",
"No"
],
time:[ 
"Yes",
"No"
],

arousal:[
"Open eyes spontaneously",
"Arouses to voices",
"Arouses to touch/gentle shaking",
"Arouses to repeated stimulation",
"Arouses to vigorous stimulation",
"Arouses to pain",
"unresponsive"
],

place:[
"Yes",
"No"
],

orientationassessmentimpression:[
"Within defined limits",
"Others"
],

speechclarity:[
"Appropriate for age",
"Coherent",
"Slurred",
"Rambling",
"Limited enunciation",
"incoherent"
],

patientmood:[
"interested",
"sad",
"frightened",
"alert",
"excited",
"Ashamed",
"Upset",
"Happy",
"Strong",
"Nervous",
"Guilty",
"Energetic",
"Scared",
"Calm"
],

patientmemory:[
"Long term memory intact",
"Long term memory poor",
"Short term memory intact",
"Short term memory poor"
],

abilitytoconcentration:[
"No difficulty concentrating",
"Poor concentration",
"Difficulty concentrating",
"Unable to concentrate"
],

attention:[
"Difficulty directing attention",
"Directs attention",
"Does not direct attention",
"Unable to direct attention"
],

cni:[
"Pass", 
"fail"
],

pupillaryresponse:[
"Reactive to light",
"Sluggishly reactive to light",
"Not reactive to light",
"Reactive to accommodation",
"Not reactive to accommodation",
"Other"
],

pupilshape:[
"Dilated",
"Cat eye",
"Pinpoint",
"Irregular",
"Round",
"Tear drop"
],

pupilneurologyassessmentimpression:[
"Within defined limits",
"Others"
],
muscletone:[
"Muscle tone assymetric",
"Decreased muscle tone",
"Flaccid muscle",
"Fluctuating muscle tone",
"Rigor"
],

musclestrength:[
"Trace muscle activation",
"Muscle activation with gravity eliminated",
"Muscle activation against gravity, full range of motion",
"Muscle activation against some resistance",
"Muscle activation against examiner’s full resistance"
],
involuntarymovement:[
"Coarse tremor",
"Fine tremor",
"Intention tremor",
"Parkinsonian tremor",
"Spasm/tic"
],

drt:[
"None",
"1+",
"2+",
"3+"
],

oculocephalic:[
"Absent",
"Present",
"Indeterminate"
],

paralysistype:[
"Hemiplegia",
"Monoplegia",
"Paraplegia",
"Quadripelgia/tetrapelgia"
],

musculoskeletalassessmentimpression:[
"Within defined limits",
"Others"
],

paresthesiatype:[
"Burning",
"Skin-crawling",
"Itching",
"Numbness and Tingling",
"Pins and needles",
"Pricking"
],



  assessment:[
"Anxiety disorder of childhood or adolescence (disorder)",
"Parathyroid structure (body structure)",
"Ferrous (59-Fe) sulfate (substance)",
"Chronic pharyngitis (disorder)",
"Cyanocobalamin (57-Co)(substance)",
"Current drinker of alcohol(finding)",
"Acinetobacter johnsonil( organism)",
"Female first cousin(person)",
"Bone plate, device(physical object)",
"Dementia associated with alcoholism (disorder)",
"Structure of central axillary lymph node (body structure)",
"Czech (ethnic group)",
"Melnick-fraser syndrome (disorder)",
"Acute myringitis (disorder)",
"Skin structure of imbilicus (body structure)",
"Reactive hypoglycemia (disorder )",
"Occipital headache (finding)",
"Altrioventricular bundle structure (body structure)",
"Kemicterus fue to isoimmunization (disorder)",
"Heart valve disorder (disorder)"

  ],
  diagonosis:[
"Other amebic genitourinary infections",
"Other amebic infections",
"Amebiasis, unspecified",
"Other protozoal intestinal diseases",
"Balantidiasis",
"Giarldiasis(lambliasis)",
"Isosporiasis",
"Cyclosporiasis",
"Other specified protozoal intestinal diseases",
"Accute gastroenteropathy due to other small round viruses",
"Adenoviral enteritis",
"Other viral enteritis",
"Calcivirus enteritis",
"Astrovirus enterirtis",
"Other specified protozoal diseases",
"Protozoal intestinal disease, unspecified",
"Viral and other specified intestinal infections",
"Rotaviral enteritis",
"Acute gastroenteropathy due to Norwalk agent and other small round viruses",
"Acute gastroenteropathy due to Norwalk agent"

  ],
  icpc2:[
"Medical exam/eval complete",
"Medical exam/health evaluation partial/pre op check",
"Sensitivity test",
"Microbiological/immunological test",
"Blood test",
"Urine test",
"Feaces test",
"Histological/exfoliative cytology",
"Other laboratory test NEC",
"Physical function test",
"Diagnostic endoscopy",
"Diagnostic Radiology/imaging",
"Electrical tracings",
"Other diagnostic procedures",
"Preventive immunizations/medication",
"Observe/educate/advice/diet",
"Consult with primary care provider",
"Consult with specialist",
"Clarification/Discuss Patients’s RFE",
"Other preventive procedure"

  ],
        //main
  generalphysicalexaminations:{
main:[
{type:"hair", options:["normal","alopecia","fluffy"]},
{type:"hairnote" },
{type:"face",  options:["normal","acromegly","cushingnoid","down syndrome","marfanoid","myxedematous","thyrotoxic","parkinsonism","others"]},
{type:"facenote"},
{type:"jaundice", options:["yes", "no"]},
{type:"jaundicenote"},
{type: "cyanosis", options:["yes central","yes peripheral", "no"]},
{type: "cyanosisnote"},
{type: "pallor", options:["not pale","pale"]},
{type: "pallornote"},
{type: "oral", options:["normal","ulcers","erythematous","hypertrophied","pigmented"]},
{type: "oralnote"},
{type: "lymphnodes", options:["localized","generalized","normal"]},
{type: "lymphnodesnote"},
{type:"ederma", options:["absent",	"present unilateral non-pitting","present unilateral pitting","present bi-lateral non-pitting","present bi-lateral and pitting"]},
{type:"edermanote"},
{type: "lastmenstrationperiod"},
{type: "lastmenstrationperiodnote"},
{type: "generalphysicalexamination"}
  ],
  paediatricspecgeneral:[
    {type:"currentlengthheight"},
    {type: "currentlengthheightpercentage"},
    {type: "currentlengthheightenote"},
    {type: "currentweight"},
    {type: "currentweightnote"},
    {type: "percentageofweightexpected"},
    {type: "headcircumference"},
    {type: "anteriorfontanelle", options:["present","absent"]},
    {type: "posteriorfontanelle", options:["present", "absent"]},
    {type: "chestcircumference"},
    {type: "limbexamination"},
    {type: "generalnote"}
  ],
  paediatricspecneuro: [
    {type: "reflexes", options:["normal", "abnormal"]},
    {type: "rootingreflexes", options:["normal", "abnormal"]},
    {type: "suckreflexes", options:["normal", "abnormal"]},
    {type: "mororeflexes", options:["normal", "abnormal"]},
    {type: "tonicneckreflexes",options:["normal", "abnormal"]},
    {type: "graspreflexes", options:["normal", "abnormal"]},
    {type: "steppingreflexes", options:["normal", "abnormal"]},
    {type: "neuronote"}]
},
  servicecategory:servicetypedetails,
  pharmacycategory:["Medication Inventory","Non Medication Inventory"],
  category:configuration.category,
  //testnames:["PCV", "ESR", "Clothing Profile","Widal"],
  testnames:service,
  testsubcomponent:[
      {type:"Widal", subcomponent:["Salmonella Typhi A (O) (H)","Salmonella Paratyphi A (O) (H)","Salmonella Paratyphi B (O) (H)","Salmonella Paratyphi C (O) (H)","Diagnostic Titre","Monocytes","Eosinophils","Basophils","Comments"]},
      {type:"PCV", subcomponent:["PCV%"]},
      {type:"ESR", subcomponent:["ESR (mm/hr)"]},
      {type:"Clothing Profile", subcomponent:["PT (Seconds)","APTT (Seconds)","INR"]}
  ],

  roles:[
    {role: "Medical Director", roleId:"1"},
    {role: "Pharmacist", roleId:"2"},
    {role: "HOD Cashier", roleId:3},
    {role: "General Nurse", roleId:"4"},
    {role: "Cashier", roleId:"5"},
    {role: "Medical Doctor", roleId:"6"},
    {role: "Nurse/Midwife", roleId:"7"},
    {role: "Theatre Nurse", roleId:"8"},
    {role: "Radiologist", roleId:"9"},
    {role: "Lab technician", roleId:"10"},
    {role: "Pharmacy Technician", roleId:"11"},
    {role: "Accountant", roleId:"12"},
    {role: "Record Officers", roleId:"13"},
    {role: "HOD Records", roleId:"14"},
    {role: "Dental Technician", roleId:"15"},
    {role: "Dental Therapist", roleId:"16"},
    {role: "ENT Nurse", roleId:"17"},
    {role: "Physiotheraphy", roleId:"18"},
    {role: "Admin", roleId:"19"}
  ],
  clinics: clinicdetails,
  /*
  clinics:[
  {clinic: "General Outpatient Clinic", id:1},
  {clinic: "Pediatric Outpatient", id:2},
   {clinic: "Medical Outpatient", id:3},
   {clinic:"Surgical Outpatient", id:4},
	{clinic: "ANC", id: 5},
   {clinic: "Labour room", id:6},
   {clinic: "Gynae Emergency room", id:7},
   {clinic: "Emergency Pediatric Unit", id:8},
   {clinic: "Accident and Emergency", id:9},
   {clinic: "Orthopedic Clinic", id:10},
    {clinic: "Eye Care", id:11},
	{clinic: "Dialysis Unit", id:12},
  {clinic: "Dental Unit", id:13},
  {clinic: "Scanning", id:14},
  {clinic: "X-ray", id:15},
  {clinic: "ENT", id:16},
  {clinic:"KTCHMA", id:17},
  {clinic: "N H I S", id:18},
   {clinic:"ART Clinic", id:19}

  ],
  */
  gender:["Male", "Female"],
}
)
  },

  downloadtemplatetypes:[{
    type:"userbulkdownloadtemplate", fileName:"usercreationtemplate.xlsx"
   

  },
  {
   
    type:"stockbulkdownloadtemplate", fileName:"inventory.xlsx"

  }
],

  paymenttype:["patientregistration"],
  allowedfilesize: 500,
  usertemplate: "userslist",
  stocktemplate: "stocklist",
  useruploadfilename:"usersload",
  pharmacyuploadfilename:"pharmacyload",
  useruploaddirectory:"uploads",
  userdownloadsdirectory:"downloads",
  error:{
    errorelevendigit:"Phone must be 11 digit",
    erroruserread: "Error in reading user",
    errorusercreate: "Error in creating user",
    errordownload:"Error downloading the file",
    errorinvalidcredentials: "Invalid credentials",
    erroruserupdate: "Error in updating users",
    errornoemailpassword:"Please Provide Email and Password",
    errorinvaliduser:"invalid credentials",
    errordeactivate:"You have been Deactivated",
    errorpasswordmismatch:"Wrong Password Detected",
    erroralreadyexit: "already exist",
    errorvacantspace:"has no vancant bed",
    errorencryptingpassword:"Error in encrypting Password",
    errorvalidatingpassword:"Error in Validating Password",
    errorfilextension: "File extension not allowed",
    errorfilelarge: "File should not be greater than 500kb",
    errorfileupload: "Error in uploading file",
    errorisrequired: "is required",
    erroroption: "value selected is not part of the available options",
    errorservicecategory:"service category does not exist in the list of accepted categories",
    errornopriceset:"No Price has been set for this service",
    erroravailability:"Is out of stock",
    protectroutes: "Authorization error: You are not an authorise user in this application", 
    errormustbenumber: "must be a number",
    errornotfound:"not found",
    errortasknotpending:"Task not pending on you",
    errorpayment:"This service has not been paid for",
    errorreferrer: "You are not the preferred consultant for this referrer",
    errorgreaterthan:"Cannot be greater",
    errorservicetray: "This service no more exist in your service tray"

  },
    environment: "test",
  //environment: "prod",

}
export default configuration;
