  import {readallclinics} from "./dao/clinics";
  
const configuration = {
  status:["inactive", "active","pending payment","paid","pending vitals","scheduled","complete","processed","pending vital","inprogress"],
  defaultPassword: "HMSB",

  settings: async function(){
    const {clinicdetails} = await readallclinics({},{"clinic":1, "id":1,"_id":0});
    return (
      {
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
  servicecategory:[
    {category: "Patient Registration", type:["Patient Registration"]}, 
    {category: "Appointment", type:["Patient Followup", "Consultation"]},
    {category: "Teleconsultation", type:["Free evisit", "Teleconsultation"]},
    {category: "Lab", type:["PCV", "ESR", "Clothing Profile","Widal"], department:"Hematology"}
  ],
  testnames:["PCV", "ESR", "Clothing Profile","Widal"],
  testsubcomponent:[
      {type:"Widal", subcomponent:["Salmonella Typhi A (O) (H)","Salmonella Paratyphi A (O) (H)","Salmonella Paratyphi B (O) (H)","Salmonella Paratyphi C (O) (H)","Diagnostic Titre","Monocytes","Eosinophils","Basophils","Comments"]},
      {type:"PCV", subcomponent:["PCV%"]},
      {type:"ESR", subcomponent:["ESR (mm/hr)"]},
      {type:"Clothing Profile", subcomponent:["PT (Seconds)","APTT (Seconds)","INR"]}
  ],

  roles:[
    {role: "Doctor", roleId:"1"},
    {role: "Pharmacist", roleId:"2"},
    {role: "Receptionist", roleId:3},
    {role: "Nurse", roleId:"4"},
    {role: "Cashier", roleId:"5"},
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

  }],
  paymenttype:["patientregistration"],
  allowedfilesize: 500,
  usertemplate: "userslist",
  useruploadfilename:"usersload",
  useruploaddirectory:"uploads",
  userdownloadsdirectory:"downloads",
  error:{
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
    errorencryptingpassword:"Error in encrypting Password",
    errorvalidatingpassword:"Error in Validating Password",
    errorfilextension: "File extension not allowed",
    errorfilelarge: "File should not be greater than 500kb",
    errorfileupload: "Error in uploading file",
    errorisrequired: "is required",
    errorservicecategory:"service category does not exist in the list of accepted categories",
    errornopriceset:"No Price has been set for this service",
    protectroutes: "Authorization error: You are not an authorise user in this application", 
    errormustbenumber: "must be a number",

  },
    environment: "test",
  //environment: "prod",

}
export default configuration;
