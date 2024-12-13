import express,{Application} from 'express';
import cors from 'cors';
import fileUpload from "express-fileupload";
import auth from "../routes/auth";
import users from "../routes/usermanagement";

function createServer(){
    const app:Application=express();
    //cross origin sharing
    app.use(cors({
      origin: "*",
      }));
    app.use(express.static(__dirname + '/public'));
    //middleware to process json
    app.use(express.json({limit: '50mb'}));
    /*
    app.use(fileUpload({
        useTempFiles: true,
        tempFileDir:path.join(__dirname, 'tmp'),
        createParentPath: true,
    }));
    */
    app.use(fileUpload());
  app.use('/api/v1/downloads', express.static('uploads'));
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/users', users);
    return app;

}
export default createServer;
