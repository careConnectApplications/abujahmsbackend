const configuration = {
  userstatus:["inactive", "active"],
  defaultPassword: "HMSB",
  settings:{
  roles:[
    {role: "Doctor", roleId:"1"},
    {role: "Pharmacist", roleId:"2"}
  ],
  gender:["Male", "Female"],
  },
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
    errorvalidatingpassword:"Error in Validating Password"

  },
    environment: "test",
  //environment: "prod",

}
export default configuration;
