const configuration = {
  status:["inactive", "active","pending payment","paid","pending vitals","scheduled","examined","processed"],
  defaultPassword: "HMSB",
  settings:{
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

  },
    environment: "test",
  //environment: "prod",

}
export default configuration;
