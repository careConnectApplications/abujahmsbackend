"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration = {
    userstatus: ["inactive", "active"],
    error: {
        erroruserread: "Error in reading user",
        errorusercreate: "Error in creating user",
        errorinvalidcredentials: "Invalid credentials",
        erroruserupdate: "Error in updating users",
        errornoemailpassword: "Please Provide Email and Password",
        errorinvaliduser: "invalid credentials",
        errordeactivate: "You have been Deactivated",
        errorpasswordmismatch: "Password Mismatch"
    },
    environment: "test",
    //environment: "prod",
};
exports.default = configuration;
