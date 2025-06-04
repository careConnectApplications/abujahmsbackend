import express from 'express';
import {protect} from "../utils/middleware";
import {refertheatreadmission,getallreferedfortheatreadmission,updatetheatreadmissionstatus,getalltheatreadmissionbypatient,gettheatreadmissiontoday} from '../controllers/thearteadmission/thearteadmission';
import {fillconscentform,readconscentformbytheatreadmission,updatefillconscentform} from '../controllers/conscentodoperations/conscenttodoperations';
import {fillpreoperativeprevisitform, readpreoperativeprevisitformbytheatreadmission,updatefillpreoperativeprevisitform} from "../controllers/preoperativeprevisit/preoperativeprevisit";
import {fillpreanatheticsform,readpreanatheticsformbytheatreadmission,updatepreanatheticsconscentform} from "../controllers/preanathetics/preanathetics";
import {fillanaethesiaform, readreadoneanaethesiaformbytheatreadmission,updateanaethesiaform,readallfoodgivenByTheatreAdmission,createfoodgivens,updatefoodgivens,readalldruggivenByTheatreAdmission,createdruggivens,updatedruggivens } from '../controllers/anaethesia/anaethesia'
import {fillpostanaetheticrecoverychartform, readonepostanaetheticrecoverychartformbytheatreadmission,updatepostanaetheticrecoverychartform, createvitalsignscores, updatevitalsignscores,readallvitalsignscoreByTheatreAdmission} from '../controllers/postanaetheticrecoverychart/postanaetheticrecoverychart'
import {filloperationnote, readoperationnotebytheatreadmission, updatefilloperationnote} from "../controllers/operationnotes/operationnotes"
import {fillhistologyrequestform,readhistologyrequestformytheatreadmission,updatehistologyrequestform} from "../controllers/histologyrequest/histologyrequest";
const router = express.Router();


router.post('/refertheatreadmission/:id', refertheatreadmission);
router.get('/getallreferedfortheatreadmission/:theatre', getallreferedfortheatreadmission);
router.put('/updatetheatreadmissionstatus/:id', updatetheatreadmissionstatus);
// admission from doctor
router.get('/getalltheatreadmissionbypatient/:patient', getalltheatreadmissionbypatient);
router.get('/gettheatreadmissiontoday', gettheatreadmissiontoday);
//conscent
router.post('/fillconscentform/:theatreadmission', fillconscentform);
router.get('/readconscentformbytheatreadmission/:theatreadmission', readconscentformbytheatreadmission);
router.put('/updatefillconscentform/:id', updatefillconscentform);
//preoperative
router.post('/fillpreoperativeprevisitform/:theatreadmission', fillpreoperativeprevisitform);
router.get('/readpreoperativeprevisitformbytheatreadmission/:theatreadmission', readpreoperativeprevisitformbytheatreadmission);
router.put('/updatepreoperativeprevisitform/:id', updatefillpreoperativeprevisitform);
//preanatheticsform
router.post('/fillpreanatheticsform/:theatreadmission', fillpreanatheticsform);
router.get('/readpreanatheticsformbytheatreadmission/:theatreadmission', readpreanatheticsformbytheatreadmission);
router.put('/updatepreanatheticsconscentform/:id', updatepreanatheticsconscentform);
//anaethetic
router.post('/fillanaethesiaform/:theatreadmission', fillanaethesiaform);
router.get('/readreadanaethesiaformbytheatreadmission/:theatreadmission', readreadoneanaethesiaformbytheatreadmission);
router.put('/updateanaethesiaform/:id', updateanaethesiaform);
//drug given ///
router.post('/createdruggivens/:anathesia', createdruggivens);
router.get('/readalldruggivenByTheatreAdmission/:anathesia', readalldruggivenByTheatreAdmission);
router.put('/updatedruggivens/:id', updatedruggivens);
//food given ////
router.post('/createfoodgivens/:anathesia', createfoodgivens);
router.get('/readallfoodgivenByTheatreAdmission/:anathesia', readallfoodgivenByTheatreAdmission);
router.put('/updatefoodgivens/:id', updatefoodgivens);
//postanaethetic
router.post('/fillpostanaetheticrecoverychartform/:theatreadmission', fillpostanaetheticrecoverychartform);
router.get('/readonepostanaetheticrecoverychartformbytheatreadmission/:theatreadmission', readonepostanaetheticrecoverychartformbytheatreadmission);
router.put('/updatepostanaetheticrecoverychartform/:id', updatepostanaetheticrecoverychartform);

//vital signs score ////
router.post('/createvitalsignscores/:postanaetheticrecoverychart', createvitalsignscores);
router.get('/readallvitalsignscoreByTheatreAdmission/:postanaetheticrecoverychart', readallvitalsignscoreByTheatreAdmission);
router.put('/updatevitalsignscores/:id', updatevitalsignscores);
//operation note
router.post('/filloperationnote/:theatreadmission', filloperationnote);
router.get('/readoperationnotebytheatreadmission/:theatreadmission', readoperationnotebytheatreadmission);
router.put('/updatefilloperationnote/:id', updatefilloperationnote);
//histology request
router.post('/fillhistologyrequestform/:theatreadmission', fillhistologyrequestform);
router.get('/readhistologyrequestformytheatreadmission/:theatreadmission', readhistologyrequestformytheatreadmission);
router.put('/updatehistologyrequestform/:id', updatehistologyrequestform);

export default router;

