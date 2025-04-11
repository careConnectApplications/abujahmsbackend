import {readallaudit} from "../../dao/audit";



  //get lab order by patient
  export const readAllaudit = async (req:any, res:any) => {
    try {
      const queryresult = await readallaudit({},{});
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };