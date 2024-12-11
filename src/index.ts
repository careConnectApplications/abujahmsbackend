import dotenv from 'dotenv';
import createServer from './utils/server';
import configuration from './config';
import databaseconnection from './utils/dbconnection';




dotenv.config();
databaseconnection();
const app=createServer();
const port = configuration.environment === "test"?process.env.TESTPORT:process.env.PORT ;
app.listen(port,()=>{
    console.log(`Server is listening on Port ${port}`)
})