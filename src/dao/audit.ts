import Audit,{auditinterface} from '../models/audit';
export async function createaudit(input:auditinterface){
    try{
        //create audit
        return await Audit.create(input);

    }
    catch(e:any){
        throw new Error(e.message);
    }

}


export async function readallaudit(query:any,selectquery:any) {
    try {
      const auditdetails = await Audit.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalauditdetails = await Audit.find(query).countDocuments();
      return { auditdetails, totalauditdetails };
    } catch (err:any) {
      console.log(err);
      throw new Error(err.message);
    }
  };