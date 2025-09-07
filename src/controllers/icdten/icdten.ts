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

  export const readicdeleven = async (req:any, res:any) => {
    try {
     const {diagnosis} = req.body;
     
    const [icd11Res, icd10Res]:any = await Promise.all([
      axios.get(
        `https://clinicaltables.nlm.nih.gov/api/icd11_codes/v3/search?terms=${encodeURIComponent(diagnosis)}`
      ),
      axios.get(
        `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${encodeURIComponent(diagnosis)}`
      )
    ]);

    const icd11List = icd11Res.data[3] || [];
    const icd10List = icd10Res.data[3] || [];

    // Merge both into one array
    const mergedResults = [...icd11List, ...icd10List];
     res.status(200).json({
        queryresult:mergedResults,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };