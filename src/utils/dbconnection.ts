import mongoose  from 'mongoose';
import configuration from '../config';
function dbconnect(){
    const database =configuration.environment === "test"?process.env.LOCALDATABASE:process.env.DOCKERDATABASE
   // const database =  'mongodb://mongo_db:27017/ims';
    mongoose.set('strictQuery', true);
    return mongoose.connect(database as string,{
        useNewUrlParser: true,
       // useUnifiedTopology: true,
        directConnection:true,
        family: 4,

    } as object).then(()=> console.log('MongoDb Connected')).catch((e:string) => console.log(e));
}
export  default dbconnect;
