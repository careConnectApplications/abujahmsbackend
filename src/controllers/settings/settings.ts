import { AnyARecord } from "dns";
import { readwardaggregate, readclinicaggregate } from "../../dao/reports";
export const settings = async function () {
    try {
        const clinic: any = [

            {
                $group: {
                    _id: "$clinic",  // Group by 'userId'

                }
            },
            {
                $project: {
                    clinic: "$_id",  // Rename _id to userId
                    _id: 0           // Exclude _id
                }
            }


        ];
        const ward = [
            {
                $group: {
                    _id: "$wardname",  // Group by 'userId'

                }
            },
            {
                $project: {
                    wardname: "$_id",  // Rename _id to userId
                    _id: 0           // Exclude _id
                }
            }

        ];
        const wards = await readwardaggregate(ward);
        const clinics = await readclinicaggregate(clinic);
        const wardNames = wards.map(ward => ward.wardname);
        const clinicNames = clinics.map(clinicname => clinicname.clinic);
        //console.log(check2);
        const reports=[
            {querytype:"financialreport",querygroup:[ "Appointment","Pharmacy", "Lab","Patient Registration","Radiology","Procedure"]},
            {querytype:"appointmentreport",querygroup:clinicNames},
            {querytype:"admissionreport",querygroup:wardNames}
          ];
        const summary=["financialaggreagate","cashieraggregate","appointmentaggregate","admissionaggregate","theatreaggregate"];
          return {reports,summary};
    }
    catch (error: any) {
        console.log("error", error);
        //throw error
    }

}


export async function settingsresponse(req:Request, res:any){
    try{
    //const {clinicdetails} = await readallclinics({},{"clinic":1, "id":1,"_id":0});
    //console.log("clinic", clinicdetails);
    var setting:any = await settings();
        res.status(200).json({
            querygroupsettings:setting.reports,
            status:true
          }); 

    }
    catch(e:any){
        res.json({status: false, msg:e.message});

    }

}
export async function settingsummaryresponse(req:Request, res:any){
    try{
    //const {clinicdetails} = await readallclinics({},{"clinic":1, "id":1,"_id":0});
    //console.log("clinic", clinicdetails);
    var setting:any = await settings();
        res.status(200).json({
            querygroupsettings:setting.summary,
            status:true
          }); 

    }
    catch(e:any){
        res.json({status: false, msg:e.message});

    }

}