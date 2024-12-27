import {readalllab} from "../../dao/lab";
// Get all lab records
export const readalllabb = async (req:any, res:any) => {
    try {
        //const {clinic} = (req.user).user;
      //const queryresult = await readalllab({department:clinic},{},'patient','appointment','payment');
      const queryresult = await readalllab({},{},'patient','appointment','payment');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };
  //get lab order by patient
  export const readAllLabByPatient = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {id} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readalllab({patient:id},{},'patient','appointment','payment');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };