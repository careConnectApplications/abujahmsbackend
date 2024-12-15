const configuration = {
  userstatus:["inactive", "active"],
  defaultPassword: "HMSB",
  settings:{
  roles:[
    {role: "Doctor", roleId:"1"},
    {role: "Pharmacist", roleId:"2"}
  ],
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
   {clinic: "Orthopedic Clinic", id:9},
    {clinic: "Eye Care", id:10},
	{clinic: "Dialysis Unit", id:11},
  {clinic: "Dental Unit", id:12},
  {clinic: "Scanning", id:13},
  {clinic: "X-ray", id:14},
  {clinic: "ENT", id:15},
  {clinic:"KTCHMA", id:16},
  {clinic: "N H I S", id:16},
   {clinic:"ART Clinic", id:17}

  ],
  gender:["Male", "Female"],
  },
  allowedfilesize: 500,
  usertemplate: "userslist",
  useruploadfilename:"usersload",
  useruploaddirectory:"uploads",
  error:{
    erroruserread: "Error in reading user",
    errorusercreate: "Error in creating user",
    errorinvalidcredentials: "Invalid credentials",
    erroruserupdate: "Error in updating users",
    errornoemailpassword:"Please Provide Email and Password",
    errorinvaliduser:"invalid credentials",
    errordeactivate:"You have been Deactivated",
    errorpasswordmismatch:"Wrong Password Detected",
    erroralreadyexit: "User with this email or password already exist",
    errorencryptingpassword:"Error in encrypting Password",
    errorvalidatingpassword:"Error in Validating Password",
    errorfilextension: "File extension not allowed",
    errorfilelarge: "File should not be greater than 500kb",
    errorfileupload: "Error in uploading file",
    errorisrequired: "is required",

  },
    environment: "test",
  //environment: "prod",

}
export default configuration;
