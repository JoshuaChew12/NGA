/* =====================================
   NGA Worship Check-in
   Scan V5.3 Ultimate Performance
===================================== */
let scanner=null;
let cameraRunning=false;
let scanLocked=false;
let resultTimer=null;

/* INIT */
async function initScan(){
showLoading(true);
await startCamera();
}

/* CAMERA */
async function startCamera(){

if(cameraRunning)return;

try{

const cameras=await Html5Qrcode.getCameras();
if(!cameras.length)throw"Camera Missing";

const cam=cameras.find(c=>
/back|rear|environment/i.test(c.label)
)?.id||cameras[0].id;

scanner=new Html5Qrcode("reader");

await scanner.start(

cam,
{fps:15,
qrbox:(w,h)=>{
let s=Math.min(w,h)*.7;
return{width:s,height:s};
}

},

onScanSuccess,
()=>{}

);

cameraRunning=true;
showLoading(false);
}catch(e){

console.log(e);
showLoading(false);
showResult("❌","Camera Error","Unable to open camera");

}

}

/* PAUSE / RESUME */
async function pauseScanner(){

try{
if(scanner&&cameraRunning)await scanner.pause(true);
}catch(e){}

}

async function resumeScanner(){

try{
if(scanner&&cameraRunning)await scanner.resume();
}catch(e){}

}

/* STOP */
async function stopCamera(){

try{

if(scanner&&cameraRunning){
await scanner.stop();
await scanner.clear();
}

}catch(e){}

scanner=null;
cameraRunning=false;

}

async function cleanupScan(){
await stopCamera();
}

/* LOADING */
function showLoading(v){

const el=document.getElementById("loadingMask");
if(el)el.classList.toggle("hidden",!v);

}

/* QR SUCCESS */
async function onScanSuccess(text){

if(scanLocked)return;
scanLocked=true;
await pauseScanner();

const id=String(text).trim().toUpperCase();
if(!id){
await resumeScanner();
scanLocked=false;
return;
}

try{
const res=await checkInAPI(id);
handleScanResult(res);
}catch(e){
showResult("❌","Network Error","Unable to connect server");
playSound("error");
}

setTimeout(async()=>{
await resumeScanner();
scanLocked=false;
},3500);

}

/* RESULT */
function handleScanResult(res){

if(!res){
showResult("❌","Server Error","No Response");
playSound("error");
return;
}

if(res.success){
showResult("✅","Welcome",res.englishName||res.chineseName,
{
id:res.memberID,
church:res.homeChurch,
location:res.scanLocation,
time:formatTime(res.time)
});

playSound("success");
vibrate();
return;
}

if(res.type==="duplicate"){
showResult("⚠️","Already Checked In",res.chineseName,
{
id:res.memberID,
church:res.homeChurch,
location:res.scanLocation,
time:formatTime(res.time)
});

playSound("duplicate");
return;
}

if(res.type==="not_found"){
showResult("❌","Participant Not Found","ID : "+res.memberID);

playSound("notfound");
return;
}

showResult("❌","Check-in Failed",res.message||"Unknown Error");

playSound("error");
}

/* POPUP */
function showResult(
icon,
title,
message,
data={}
){

pauseScanner();
const card=document.getElementById("scanResult");
if(!card)return;
clearTimeout(resultTimer);

resultIcon.innerHTML=icon;
resultTitle.innerHTML=title;
resultMessage.innerHTML=message;
resultID.innerHTML=data.id||"";
resultChurch.innerHTML=data.church||"";
resultLocation.innerHTML=data.location||"";
resultTime.innerHTML=data.time||"";
card.className="scan-result";
card.classList.add(
title==="Welcome"
?"success":
title==="Already Checked In"
?"warning":
"error"
);
card.classList.remove("hidden");

resultTimer=setTimeout(async()=>{
card.classList.add("hidden");
await resumeScanner();
scanLocked=false;
},3500);

}

/* SOUND */
function playSound(type){

const src=
type==="success"?"sound/welcome.mp3":
type==="duplicate"?"sound/duplicate.mp3":
type==="notfound"?"sound/notfound.mp3":
"sound/error.mp3";

try{
new Audio(src).play().catch(()=>{});
}catch(e){}

}

/* HELPERS */
function vibrate(){
navigator.vibrate?.(80);
}

function formatTime(v){

if(!v)return"";

return new Date(v)
.toLocaleTimeString("en-GB",
{hour:"2-digit",minute:"2-digit"});

}
