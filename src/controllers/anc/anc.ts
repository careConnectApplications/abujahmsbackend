/*
currentmedication:String,
allergies:String,
lmp:Date,
cycle: String,
edd:Date,
gravida:String,
term:String,
preterm:String,
abortions:String, 
ectopic:String, 
stillbirths:String,
noliving:String,
obstetrichistory:[
    obstetrichistoryschema
],

obsterichistory:{
previousstillbirthornewbornloss:Boolean,
historyofthreeormoreconsecutivespontaneousabortions: Boolean,
birthweightoflastbabylessthan450: Boolean,
birthweightoflastbabygreaterthan450:Boolean,
lastpregnancyhospitaladmissionforpeteclampsia: Boolean,
previoussurgeryonreproductivetract:Boolean,
},
currenthistory:{
diagnosedsuspectedmultipleprenancy: Boolean,
agelessthan16: Boolean,
agemorethan40:Boolean,
rhesusnegative:Boolean,
vaginalbleeding:Boolean,
pelvicmass:Boolean,
diastolicbpgreaterthan90: Boolean,
},
generalmedicalhistory:{
diabetesmellitus:Boolean,
renaldisease:Boolean,
cardiacdisease:Boolean,
sicklecelldisease:Boolean,
hivpositive:Boolean,
anyotherseveremedicaldeseaseorconditionspecify:String
},
physicalexamination:{
weight:String,
bloodpressure:String,
pulse:String,
headteetheyesnosethroat:Boolean,
thyroid:Boolean,
chest:Boolean,
breasts:Boolean,
cardiovascular:Boolean,
abdomen:Boolean,
varicoseveins:Boolean,
neurologicalexam:Boolean,
externalgenitalia:Boolean,
cervixvigina:Boolean,
uterus:Boolean,
adnexa:Boolean,
anythingabnormal:String,
additionalcomment:String
},
laboratory:{
haemoglobinhaematocrit:String,
urinalysisprotientsugar:String,
vdrlorrprotientsugar:String,
boodgroupandrhesusstatus:String,
hivtest:String,
urinnemicroscopic:String,
haemoglobin:String,
others:String

},
healtheducationtopicscovered:{
nutrition:String,
restandexercise:String,
malariainpregnancy:String,
safersexinpregnancy:String,
vctforpreventionofmotertochildtrnsmissionofhiv:String,
brthandemergencyreadnessplanning:String,
alcohotobaccoorotherdrugsysed:String,
familyplanningbirthspacing:String,
infantfeedingoptions:String
},

tetanustoxod:{
tetanusfirstdose:Boolean,
tetanusfirstdosedate:Date,
tetanusseconddose:Boolean,
tetatusseonddosedate:Date,
tetanusthirddose:Boolean,
tetanusthirddosedate:Date,
tetatusfourthdose:Boolean,
tetanusfourthdosedate:Date,
tetanusfifthdose:Boolean,
tetanusfifthdosedate:Date
},
ipt:{
iptfirstdose:Boolean,
iptfirstdosedate:Date,
iptseconddose:Boolean,
iptseconddosedate:Date,
iptthirddose:Boolean,
iptthirddosedate:Date,
iptfourthdose:Boolean,
iptfourthdosedate:Date,
iptfifthdose:Boolean,
iptfifthdosedate:Date,
iptsixthdose:Boolean,
iptsixthdosedate:Date
},
ironfolategiven:{
prescription:Boolean,
tablets:Boolean,
ironfolategiven:Date
}
*/
export async function addanc(req:any, res:any){
    /*
    try{
    //
    const {id} = req.params;
    const {email, staffId} = (req.user).user;
    //find doctor and add doctor who examined
    const user = await readone({email, staffId});
   
    //validate id
    //validate other input paramaters
    //search appoint where appoint id = id
    //extract vitals id
    if(req.body.status == 1){
      req.body.status = configuration.status[6];
  
    }
    else if(req.body.status == 2){
      req.body.status = configuration.status[5];
  
    }
    else{
      req.body.status = configuration.status[9];
    }
   
   //validate empty object and initialize
  
   if(!(isObjectAvailable(req.body.medicalhistory))) req.body.medicalhistory={};
   if(!(isObjectAvailable(req.body.paediatricsspecific))) req.body.paediatricsspecific={};
   if(!(isObjectAvailable(req.body.cvs))) req.body.cvs={};
   if(!(isObjectAvailable(req.body.resp))) req.body.resp={};
   if(!(isObjectAvailable(req.body.gi))) req.body.gi={};
   if(!(isObjectAvailable(req.body.gu))) req.body.gu={};
   if(!(isObjectAvailable(req.body.neuro))) req.body.neuro={};
   if(!(isObjectAvailable(req.body.msk))) req.body.msk={};
   if(!(isObjectAvailable(req.body.medicalhistory))) req.body.medicalhistory={};
   if(!(isObjectAvailable(req.body.immunizationhistory))) req.body.immunizationhistory={};
   if(!(isObjectAvailable(req.body.developmentmilestonehistorydetails))) req.body.developmentmilestonehistorydetails={};
   if(!(isObjectAvailable(req.body.prepostnatalhistory))) req.body.prepostnatalhistory={};
   if(!(isObjectAvailable(req.body.historycvs))) req.body.historycvs={};
   if(!(isObjectAvailable(req.body.historyresp))) req.body.historyresp={};
   if(!(isObjectAvailable(req.body.historygi))) req.body.historygi={};
   if(!(isObjectAvailable(req.body.historygu))) req.body.historygu={};
   if(!(isObjectAvailable(req.body.historyneuro))) req.body.historyneuro={};
   if(!(isObjectAvailable(req.body.historymsk))) req.body.historymsk={};
  
    const {height,weight,temperature, bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,status,additionalnote} = req.body;
    const {assessment,assessmentnote,diagosis,diagosisnote,icpc2,icpc2note} = req.body;
    const { hair,hairnote,face,facenote,jaundice,jaundicenote,cyanosis,cyanosisnote,pallor,pallornote,oral,oralnote,lymphnodes,lymphnodesnote,ederma,edermanote,lastmenstrationperiod,lastmenstrationperiodnote,generalphysicalexamination} = req.body;
    const {currentlengthheight,currentlengthheightpercentage,currentlengthheightenote,currentweight,currentweightnote,percentageofweightexpected,headcircumference,anteriorfontanelle,posteriorfontanelle,chestcircumference,limbexamination,generalnote} = (req.body).paediatricsspecific;
    const {reflexes,rootingreflexes,suckreflexes,mororeflexes,tonicneckreflexes,graspreflexes,steppingreflexes,neuronote} = (req.body).paediatricsspecific;
    const {heartrate,bpsystolic,bpdiastolic,capillaryrefilltime,heartraterhythm,heartsound,heartmurmurgrade,heartmurmurquality,heartmurmurpitch,heartmurmurtiming,murmurlocationauscultation,murmurradiatingtobodylocation,jugularveindistention,jugularveindistentionheadup30degree,edema,temperatureextrmities,tissueperfusionassessmentimpression,cvsremark} = (req.body).cvs;
    const {respiratoryrhthm,respiratoryrate,respiratoryeffort,breathsoundsauscultation,localizedbreathsounds,respiratoryassessmentimpression,respremarks} = (req.body).resp;
    const {bowelsoundauscultation,bowelsoundbyqualityauscultation,bsquadauscultation,physiologicfindingbypalpation,giassessmentimpression,giremarks} = (req.body).gi;
    const {urinecolor,urineodor,urineturbidity,urinecollectiondevice,voidingpattern,appearanceurine,otherurine,genitourinaryassessmentimpression,numbervoids,incontinentvoidsurinary,diapercount,perinealpadscount,colorurine,voidingpatterngu,bloodlossvolume,genitouringassessmentimpressions,guremark} =(req.body).gu;
    const {levelofconsciousness,person,place,time,orientationassessmentimpression,levelofarousal,speechclarity,patientmood,patientmemory,abilitytoconcentrate,abilitytodirectattention,cniexam,cniiexam,cniiiexam,cnivexam,cnvexam,cnviexam,cniviiexam,cniviiiexam,cnixexam,cnxexam,cnxiexam,cnxiiexam,pupildiametereyer,pupildiametereyel,pupillaryresponsepupilr,pupillaryresponsepupill,pupilshaperightpupil,pupilshapeleftpupil,pupilassessmentimpression,physiologicfindingopticlens,glasgowcomascale,neurologyassessmentimpression,nueroremarks}= (req.body).neuro;
    const {muscletone,musclestrength,involuntarymovements,activerangeflexionshoulderl,activerangeextensionshoulderl,activerangeexternalrotationshoulderl,activerangeinternalrotationshoulderl,activerangeabductionshoulderl,activerangeadductionshoulderl,activerangeflexionshoulderr,activerangeextensionshoulderr,activerangeexternalrotationshoulderr,activerangeinternalrotationshoulderr,activerangeabductionshoulderr,activerangeadductionshoulderr,activerangeflexionelbowl,activerangeextensionelbowl,activerangeflexionelbowr,activerangeextensionelbowr,activerangeflexionhipl,activerangeextensionhipl,activerangeexternalrotationhipl,activerangeinternalrotationhipl,activerangeabductionhipl,activerangeadductionhipl,activerangeflexionhipr,activerangeextensionhipr,activerangeexternalrotationhipr,activerangeinternalrotationhipr,activerangeabductionhipr,activerangeadductionhipr,activerangeflexionkneel,activerangeextensionkneel,activerangeflexionkneer,activerangeextensionkneer,passiverangeflexionshoulderl,passiverangeextensionshoulderl,passiverangeexternalrotationshoulderl,passiverangeinternalrotationshoulderl,passiverangeabductionshoulderl,passiverangeadductionshoulderl,passiverangeflexionshoulderr,passiverangeextensionshoulderr,passiverangeexternalrotationshoulderr,passiverangeinternalrotationshoulderr,passiverangeabductionshoulderr,passiverangeadductionshoulderr,passiverangeflexionelbowl,passiverangeextensionelbowl,passiverangeflexionelbowr,passiverangeextensionelbowr,passiverangeflexionhipl,passiverangeextensionhipl,passiverangeexternalrotationhipl,passiverangeinternalrotationhipl,passiverangeabductionhipl,passiverangeadductionhipl,passiverangeflexionhipr,passiverangeextensionhipr,passiverangeexternalrotationhipr,passiverangeinternalrotationhipr,passiverangeabductionhipr,passiverangeadductionhipr,dtrachilles,dtrbiceps,dtrbrachioradialis,dtrpatellar,dtrtriceps,babinskisreflex,oculocephalic,paralysistype,paresthesiatype,physiologicfinding,musculoskeletalassessmentimpression,mskremark,passiverangeflexionkneel,passiverangeextensionkneel,passiverangeflexionkneer,passiverangeextensionkneer} =(req.body).msk;
    const {attentiondeficitdisorderhyperactivitydisorder,attentiondeficitdisorderhyperactivitydisordernote,constipation,constipationnote,fatigue,fatiguenote,orthopedicconditions,orthopedicconditionsnote,allergies,allergiesnote,diabetes,diabetesnote,headaches,headachesnote,scoliosis,scoliosisnote,asthma,asthmanote,digestiveproblems,digestiveproblemsnote,hearingdifficulties,hearingdifficultiesnote,seizures,seizuresnote,blooddisorder,blooddisordernote,depressionanxiety,depressionanxietynote,heartproblems,heartproblemsnote,sleepdisturbances,sleepdisturbancesnote,chroniccolds,chroniccoldsnote,dyslexia,dyslexianote,kidneydisorders,kidneydisordersnote,torticollis,torticollisnote,colic,colicnote,earinfections,earinfectionsnote,lymphdisorders,lymphdisordersnote,visiondifficulties,visiondifficultiesnote,autism,autismnote,sensoryprocessingchallenges,sensoryprocessingchallengesnote} = (req.body).medicalhistory;
    const {stressors,stressorsnote,pregnancymedication,pregnancymedicationnote,cigarettealcoholuse,cigarettealcoholusenote,delivery,deliverynote,deliverytype,deliverytypenote,emergencydelivery,emergencydeliverynote,labourinduction,labourinductionnote,birthhistorymedication,birthhistorymedicationnote,assisteddelivery,assisteddeliverynote,typeofassisteddelivery,typeofassisteddeliverynote,complicationsduringdelivery,complicationsduringdeliverynote,apgarscoreafteroneminute,apgarscoreafterfiveminutes,birthweight,birthlengthheight,useofoxygenafterbirth,feedingofthechild,feedingofthechildnote,difficultyinlatchingsucking,difficultyinlatchingsuckingnote} = (req.body).prepostnatalhistory;
    const {agewhenrolledover,satupunsupported,crawled,walked,spokefirstword,spokeinsentences,totaltrianed,anyfoodallergies,contacttypesport,historyofcaraccident,everbeenseenonemergency,otherhistoryoftrauma,historyoffrequentfalls,anysignofmuscleweakness,anyfoodallergiesnote,contacttypesportnote,historyofcaraccidentnote,everbeenseenonemergencynote,otherhistoryoftraumanote,historyoffrequentfallsnote,anysignofmuscleweaknessnote}=(req.body).developmentmilestonehistorydetails;
    const {immunization,hepb0,opv0,bcg,opv1,penta1,pcv1,rota1,opv2,pcv2,rota2,opv3,penta3,pcv3,rota3,ipv,vitamina1,vitamina2,measles,yellowfever,mena,measles2,hpv914,llin}=(req.body).immunizationhistory;
    const {presentingcomplaints,presentingcompalintcode,pastmedicalhistory,drugandallergyhistory,familyandsocialhistory,nutritionhistory,spirituality} = req.body;
    const {cvsassessmentimpression,historyofcvsdisorder,historyofcvssurgicalprocedures,historycvsremark} = (req.body).historycvs
    const {historyofrespiratorydisorders,respremark }=(req.body).historyresp
    const {nausea,typeofdiet,giboweleliminationpattern,bmfrequency,bmusualtimeoftheday,bmregularity,usualconsistency,dateoflastbm,consistency,color,amount,appearance,historyofgidisorders,historyofsurgicalprocedureofgisystem}=(req.body).historygi;
    const {historyofgenitourinarydisorders,historyofsrgicalprocedureforgusyetm,numberstools,fluidoutputemesis,guboweleliminationpattern,consistencystool,historyguremark} = (req.body).historygu;
    const {historyofneurologicdisorders,historyofsurgicalproceduresofnervoussystem,historyneuroremark}= (req.body).historyneuro;
    const {historyofmusculoskeletaldisorders,historyofsurgicalproceduresofmsksystem,historymskremarks}= (req.body).historymsk;
   
  
    //vitals
    const vitals = {height,weight,temperature, bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,bmi:req.body.bmi,status:configuration.status[6]};
    if(height || weight){
      validateinputfornumber({height, weight});
      req.body.bmi = weight/((height/100) * (height/100));
      //validateinputfaulsyvalue({...vitals});
      }
   
   
      
    //general physical examination
    const paediatricsspecificationgeneral={currentlengthheight,currentlengthheightpercentage,currentlengthheightenote,currentweight,currentweightnote,percentageofweightexpected,headcircumference,anteriorfontanelle,posteriorfontanelle,chestcircumference,limbexamination,generalnote};
    const paediatricsspecificationneuro={reflexes,rootingreflexes,suckreflexes,mororeflexes,tonicneckreflexes,graspreflexes,steppingreflexes,neuronote}
    const generalphysicalexaminations ={paediatricsspecification:{general:paediatricsspecificationgeneral, neuro:paediatricsspecificationneuro}, hair,hairnote,face,facenote,jaundice,jaundicenote,cyanosis,cyanosisnote,pallor,pallornote,oral,oralnote,lymphnodes,lymphnodesnote,ederma,edermanote,lastmenstrationperiod,lastmenstrationperiodnote,generalphysicalexamination};
    //assessmentdiagnosis
    const  assessmentdiagnosis = {assessment,assessmentnote,diagosis,diagosisnote,icpc2,icpc2note};
    //physical exaamination  
    const  cvs ={heartrate,bpsystolic,bpdiastolic,capillaryrefilltime,heartraterhythm,heartsound,heartmurmurgrade,heartmurmurquality,heartmurmurpitch,heartmurmurtiming,murmurlocationauscultation,murmurradiatingtobodylocation,jugularveindistention,jugularveindistentionheadup30degree,edema,temperatureextrmities,tissueperfusionassessmentimpression,cvsremark};
    const resp ={respiratoryrhthm,respiratoryrate,respiratoryeffort,breathsoundsauscultation,localizedbreathsounds,respiratoryassessmentimpression,respremarks};
    const gi= {bowelsoundauscultation,bowelsoundbyqualityauscultation,bsquadauscultation,physiologicfindingbypalpation,giassessmentimpression,giremarks};
    const gu={urinecolor,urineodor,urineturbidity,urinecollectiondevice,voidingpattern,appearanceurine,otherurine,genitourinaryassessmentimpression,numbervoids,incontinentvoidsurinary,diapercount,perinealpadscount,colorurine,voidingpatterngu,bloodlossvolume,genitouringassessmentimpressions,guremark};
    const neuro={levelofconsciousness,person,place,time,orientationassessmentimpression,levelofarousal,speechclarity,patientmood,patientmemory,abilitytoconcentrate,abilitytodirectattention,cniexam,cniiexam,cniiiexam,cnivexam,cnvexam,cnviexam,cniviiexam,cniviiiexam,cnixexam,cnxexam,cnxiexam,cnxiiexam,pupildiametereyer,pupildiametereyel,pupillaryresponsepupilr,pupillaryresponsepupill,pupilshaperightpupil,pupilshapeleftpupil,pupilassessmentimpression,physiologicfindingopticlens,glasgowcomascale,neurologyassessmentimpression,nueroremarks};
    const msk={muscletone,musclestrength,involuntarymovements,activerangeflexionshoulderl,activerangeextensionshoulderl,activerangeexternalrotationshoulderl,activerangeinternalrotationshoulderl,activerangeabductionshoulderl,activerangeadductionshoulderl,activerangeflexionshoulderr,activerangeextensionshoulderr,activerangeexternalrotationshoulderr,activerangeinternalrotationshoulderr,activerangeabductionshoulderr,activerangeadductionshoulderr,activerangeflexionelbowl,activerangeextensionelbowl,activerangeflexionelbowr,activerangeextensionelbowr,activerangeflexionhipl,activerangeextensionhipl,activerangeexternalrotationhipl,activerangeinternalrotationhipl,activerangeabductionhipl,activerangeadductionhipl,activerangeflexionhipr,activerangeextensionhipr,activerangeexternalrotationhipr,activerangeinternalrotationhipr,activerangeabductionhipr,activerangeadductionhipr,activerangeflexionkneel,activerangeextensionkneel,activerangeflexionkneer,activerangeextensionkneer,passiverangeflexionshoulderl,passiverangeextensionshoulderl,passiverangeexternalrotationshoulderl,passiverangeinternalrotationshoulderl,passiverangeabductionshoulderl,passiverangeadductionshoulderl,passiverangeflexionshoulderr,passiverangeextensionshoulderr,passiverangeexternalrotationshoulderr,passiverangeinternalrotationshoulderr,passiverangeabductionshoulderr,passiverangeadductionshoulderr,passiverangeflexionelbowl,passiverangeextensionelbowl,passiverangeflexionelbowr,passiverangeextensionelbowr,passiverangeflexionhipl,passiverangeextensionhipl,passiverangeexternalrotationhipl,passiverangeinternalrotationhipl,passiverangeabductionhipl,passiverangeadductionhipl,passiverangeflexionhipr,passiverangeextensionhipr,passiverangeexternalrotationhipr,passiverangeinternalrotationhipr,passiverangeabductionhipr,passiverangeadductionhipr,dtrachilles,dtrbiceps,dtrbrachioradialis,dtrpatellar,dtrtriceps,babinskisreflex,oculocephalic,paralysistype,paresthesiatype,physiologicfinding,musculoskeletalassessmentimpression,mskremark,passiverangeflexionkneel,passiverangeextensionkneel,passiverangeflexionkneer,passiverangeextensionkneer};
    const physicalexamination={cvs,resp,gi,gu,neuro,msk}; 
     //paediatrics
     const medicalhistory ={attentiondeficitdisorderhyperactivitydisorder,attentiondeficitdisorderhyperactivitydisordernote,constipation,constipationnote,fatigue,fatiguenote,orthopedicconditions,orthopedicconditionsnote,allergies,allergiesnote,diabetes,diabetesnote,headaches,headachesnote,scoliosis,scoliosisnote,asthma,asthmanote,digestiveproblems,digestiveproblemsnote,hearingdifficulties,hearingdifficultiesnote,seizures,seizuresnote,blooddisorder,blooddisordernote,depressionanxiety,depressionanxietynote,heartproblems,heartproblemsnote,sleepdisturbances,sleepdisturbancesnote,chroniccolds,chroniccoldsnote,dyslexia,dyslexianote,kidneydisorders,kidneydisordersnote,torticollis,torticollisnote,colic,colicnote,earinfections,earinfectionsnote,lymphdisorders,lymphdisordersnote,visiondifficulties,visiondifficultiesnote,autism,autismnote,sensoryprocessingchallenges,sensoryprocessingchallengesnote};
     const prepostnatalhistory = {stressors,stressorsnote,pregnancymedication,pregnancymedicationnote,cigarettealcoholuse,cigarettealcoholusenote,delivery,deliverynote,deliverytype,deliverytypenote,emergencydelivery,emergencydeliverynote,labourinduction,labourinductionnote,birthhistorymedication,birthhistorymedicationnote,assisteddelivery,assisteddeliverynote,typeofassisteddelivery,typeofassisteddeliverynote,complicationsduringdelivery,complicationsduringdeliverynote,apgarscoreafteroneminute,apgarscoreafterfiveminutes,birthweight,birthlengthheight,useofoxygenafterbirth,feedingofthechild,feedingofthechildnote,difficultyinlatchingsucking,difficultyinlatchingsuckingnote};
     const developmentmilestonehistorydetails ={anyfoodallergiesnote,contacttypesportnote,historyofcaraccidentnote,everbeenseenonemergencynote,otherhistoryoftraumanote,historyoffrequentfallsnote,anysignofmuscleweaknessnote,agewhenrolledover,satupunsupported,crawled,walked,spokefirstword,spokeinsentences,totaltrianed,anyfoodallergies,contacttypesport,historyofcaraccident,everbeenseenonemergency,otherhistoryoftrauma,historyoffrequentfalls,anysignofmuscleweakness};
     const immunizationhistory = {immunization,hepb0,opv0,bcg,opv1,penta1,pcv1,rota1,opv2,pcv2,rota2,opv3,penta3,pcv3,rota3,ipv,vitamina1,vitamina2,measles,yellowfever,mena,measles2,hpv914,llin};
     const paediatrics ={medicalhistory,prepostnatalhistory,developmentmilestonehistorydetails,immunizationhistory};
     //history
     const historycvs ={cvsassessmentimpression,historyofcvsdisorder,historyofcvssurgicalprocedures,historycvsremark};
     const historyresp ={historyofrespiratorydisorders,respremark };
     const historygi={nausea,typeofdiet,giboweleliminationpattern,bmfrequency,bmusualtimeoftheday,bmregularity,usualconsistency,dateoflastbm,consistency,color,amount,appearance,historyofgidisorders,historyofsurgicalprocedureofgisystem};
     const historygu ={historyofgenitourinarydisorders,historyofsrgicalprocedureforgusyetm,numberstools,fluidoutputemesis,guboweleliminationpattern,consistencystool,historyguremark};
     const historyneuro ={historyofneurologicdisorders,historyofsurgicalproceduresofnervoussystem,historyneuroremark};
     const historymsk ={historyofmusculoskeletaldisorders,historyofsurgicalproceduresofmsksystem,historymskremarks};
     const history={cvs:historycvs,resp:historyresp,gi:historygi,gu:historygu,neuro:historyneuro,msk:historymsk,presentingcomplaints,presentingcompalintcode,pastmedicalhistory,drugandallergyhistory,familyandsocialhistory,nutritionhistory,spirituality};
     //validateinputfaulsyvalue({...vitals});
    var queryresult;
    
    //find id 
    var checkadimmison = await readoneadmission({_id:id},{},'');
    
    //if not found create 
    //else update
    if(height || weight ){
        if(checkadimmison){
          queryresult = await updateappointment(id, {$set:{'encounter.history':history,'encounter.paediatrics':paediatrics,'encounter.vitals': vitals,'encounter.generalphysicalexamination':generalphysicalexaminations,'encounter.assessmentdiagnosis':assessmentdiagnosis,'encounter.physicalexamination':physicalexamination},status,additionalnote, doctor:user?._id,admission:checkadimmison._id,patient:checkadimmison.patient});
        }else{
        queryresult = await updateappointment(id, {$set:{'encounter.history':history,'encounter.paediatrics':paediatrics,'encounter.vitals': vitals,'encounter.generalphysicalexamination':generalphysicalexaminations,'encounter.assessmentdiagnosis':assessmentdiagnosis,'encounter.physicalexamination':physicalexamination},status,additionalnote, doctor:user?._id});
        }  
  }
    else{
        if(checkadimmison){
           queryresult = await updateappointment(id, {$set:{'encounter.history':history,'encounter.paediatrics':paediatrics,'encounter.generalphysicalexamination':generalphysicalexaminations,'encounter.assessmentdiagnosis':assessmentdiagnosis,'encounter.physicalexamination':physicalexamination},status,additionalnote, doctor:user?._id,admission:checkadimmison._id,patient:checkadimmison.patient});
        }
        else{
            queryresult = await updateappointment(id, {$set:{'encounter.history':history,'encounter.paediatrics':paediatrics,'encounter.generalphysicalexamination':generalphysicalexaminations,'encounter.assessmentdiagnosis':assessmentdiagnosis,'encounter.physicalexamination':physicalexamination},status,additionalnote, doctor:user?._id});
        }
    
    }
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});
  
    }
      */
  
  }
  