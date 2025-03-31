import axios from 'axios';
// Get all lab records
export const readicdten = async (req:any, res:any) => {
    try {
     const {diagnosis} = req.body;
     let result = await axios.get(`https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${diagnosis}`);
     let queryresult:any = result.data;
     res.status(200).json({
        queryresult:queryresult[3],
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };