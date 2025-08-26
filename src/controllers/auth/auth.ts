import configuration from "../../config";
import bcrypt from "bcryptjs";
import { readone, createuser, updateuser } from "../../dao/users";
import { readallclinics } from "../../dao/clinics";
import { isValidPassword, sendTokenResponse, mail, validateinputfaulsyvalue, isValidPhoneNumber } from "../../utils/otherservices";
import { getRolesById } from "../../dao/roles";
import catchAsync from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../errors";


//sign in
export var signin = async (req: any, res: any) => {
    try {
        //destructure email and password
        const { email, password } = req.body;
        var requirepasswordchange;
        if (password == configuration.defaultPassword) {
            requirepasswordchange = true;

        }
        else {
            requirepasswordchange = false;

        }

        //validate email and password
        if (!email || !password) {
            throw new Error(configuration.error.errornoemailpassword);
        }
        //find user

        const user = await readone({ email });

        //check if user exit
        if (!user) {
            throw new Error(configuration.error.errorinvaliduser);
        }


        //chek if user is active
        if (user.status === configuration.status[0]) {
            throw new Error(configuration.error.errordeactivate);
             
        }

        //check if password match
        const isMatch = await isValidPassword(password, user.password);
        if (!isMatch) {
            throw new Error(configuration.error.errorpasswordmismatch);
        }
        //respond with token
        var queryresult = sendTokenResponse(user);
        res.status(200).json({ queryresult, status: true, requirepasswordchange });
    }
    catch (error: any) {
        res.status(403).json({ status: false, msg: error.message });

    }
}


//signup users 
export var signup = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

    //get token from header
    const { email, firstName, title, staffId, lastName, country, state, city, address, age, dateOfBirth, gender, licence, phoneNumber, role, degree, profession, employmentStatus, nativeSpokenLanguage, otherLanguage, readWriteLanguage, clinic, zip, specializationDetails } = req.body;
    //get role id
    var roleId = (configuration.roles).filter((e: any) => e.role == role)[0].roleId;
    req.body.roleId = roleId;
    validateinputfaulsyvalue({ email, firstName, phoneNumber, lastName, gender, role, clinic });
    const foundUser = await readone({ $or: [{ email }, { phoneNumber }] });

    if (foundUser) {
        return next(new ApiError(401, `User with this email or phonenumber  already exists`));
    }

    if (!isValidPhoneNumber(phoneNumber)) {
        return next(new ApiError(409, configuration.error.errorNotValidPhoneNumber))
    }

    req.body.password = configuration.defaultPassword;

    //get user permissions
    const permissions = getRolesById(+roleId)?.defaultPermissions || [];
    req.body.specialPermissions = permissions;

    //other validations
    const queryresult = await createuser(req.body);

    if (!queryresult) {
        return next(new ApiError(403, 'operation failed!'));
    }

    //const message = `Your account creation on Gotruck APP is successful. \n Login Email: ${email} \n Portal Link: https://google.com/ \n Default-Password: truck \n Please Login and change your Password`;
    //await mail(email, "Account Registration Confrimation", message);
    res.status(200).json({ queryresult, status: true });
})

//settings
export async function settings(req: Request, res: any) {
    try {
        //const {clinicdetails} = await readallclinics({},{"clinic":1, "id":1,"_id":0});
        //console.log("clinic", clinicdetails);
        var settings = await configuration.settings();
        console.log(settings);
        res.status(200).json({
            ...settings,
            status: true
        });

    }
    catch (e: any) {
        res.json({ status: false, msg: e.message });

    }

}






