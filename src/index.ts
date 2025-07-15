import dotenv from 'dotenv';
import configuration from './config';
import databaseconnection from './utils/dbconnection';
import createServer from './utils/server';


//const currentMilliseconds = moment().valueOf();
//console.log(currentMilliseconds);

dotenv.config();
databaseconnection();

const port = configuration.environment === "test" ? process.env.TESTPORT : process.env.PORT;
const app = createServer(port);

app.listen(port, () => {
    console.log(`Server is listening on Port ${port}`)
})