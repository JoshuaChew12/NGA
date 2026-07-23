/* =====================================
 NGA Worship Check-in
 Scan V5.2 Ultimate
===================================== */
let scanner=null;
let cameraRunning=false;
let scanLocked=false;
let resultTimer=null;

/* INIT */
async function initScan(){

initAudio();
showLoading(true);
await startCamera();

}

/* CAMERA START */
async function startCamera(){

if(cameraRunning)return;

try{

if(typeof Html5Qrcode==="undefined"){
showResult("❌","Scanner Error","Library Missing");
return;
}

const cameras=await Html5Qrcode.getCameras();
if(!cameras.length){
showResult("❌","Camera Error","No Camera Found");
return;
}

let cam=cameras.find(c=>
/back|rear|environment/i.test(c.label)
)||cameras[0];

scanner=new Html5Qrcode("reader");
await scanner.start(
cam.id,

{
fps:12,

qrbox:(w,h)=>{
let s=Math.min(w,h)*0.7;
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
showResult("❌","Camera Error","Unable to open camera");

}

}


/* CAMERA STOP */
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


/* QR SUCCESS */

async function onScanSuccess(text){

if(scanLocked)return;

scanLocked=true;


const id=text
.toString()
.trim()
.toUpperCase();


if(!id){

scanLocked=false;
return;

}


/*
立即停止 camera
*/

await stopCamera();


showResult(
"⏳",
"Processing",
"Checking participant..."
);


try{

const res=await checkInAPI(id);

handleResult(res);


}catch(e){

showResult(
"❌",
"Network Error",
"Unable to connect server"
);

}


setTimeout(async()=>{

hideResult();

await startCamera();

scanLocked=false;


},3000);


}


/* RESULT HANDLER */

function handleResult(res){


if(!res){

showResult(
"❌",
"Server Error",
"No Response"
);

playSound("error");
vibrate("error");

return;

}


// SUCCESS

if(res.success){

showResult(
"✅",
"Welcome",
res.englishName||res.chineseName,
{
id:res.memberID,
church:res.homeChurch,
location:res.scanLocation,
time:formatTime(res.time)
}
);

playSound("success");
vibrate("success");

return;

}


// DUPLICATE

if(res.type==="duplicate"){

showResult(
"⚠️",
"Already Checked In",
res.englishName||res.chineseName,
{
id:res.memberID,
church:res.homeChurch,
time:formatTime(res.time)
}
);

playSound("duplicate");
vibrate("duplicate");

return;

}


// OTHER ERROR

showResult(
"❌",
"Check-in Failed",
res.message||res.type||"Unknown Error"
);

playSound("error");
vibrate("error");

}


/* RESULT UI */

function showResult(icon,title,msg,data={}){

const box=document.getElementById("scanResult");

if(!box)return;


resultIcon.innerHTML=icon;

resultTitle.innerHTML=title;

resultMessage.innerHTML=msg;


resultID.innerHTML=data.id||"";
resultChurch.innerHTML=data.church||"";
resultLocation.innerHTML=data.location||"";
resultTime.innerHTML=data.time||"";


box.className="scan-result";


if(title==="Welcome")
box.classList.add("success");

else if(title==="Already Checked In")
box.classList.add("warning");

else
box.classList.add("error");


box.classList.remove("hidden");


clearTimeout(resultTimer);


resultTimer=setTimeout(()=>{

hideResult();

},3000);


}


/* HIDE RESULT */

function hideResult(){

const box=document.getElementById("scanResult");

if(box)
box.classList.add("hidden");

}


/* LOADING */

function showLoading(show){

const el=document.getElementById("loadingMask");

if(el)
el.classList.toggle(
"hidden",
!show
);

}

/* ===============================
   SOUND ENGINE V1
=============================== */

let audioCtx=null;

function initAudio(){

if(!audioCtx){
audioCtx=
new (window.AudioContext||
window.webkitAudioContext)();
}

if(audioCtx.state==="suspended"){
audioCtx.resume();
}

}


/* ===============================
   PLAY SOUND
=============================== */

function playSound(type){

try{

initAudio();

switch(type){

case "success":
tone(880,.15);
setTimeout(()=>tone(1200,.18),160);
break;


case "duplicate":
tone(600,.25);
setTimeout(()=>tone(500,.25),280);
break;


case "notfound":
tone(300,.35);
setTimeout(()=>tone(220,.35),380);
break;


case "error":
tone(250,.4);
break;


default:
tone(700,.2);

}

}catch(e){

console.log("sound error",e);

}

}


/* ===============================
   TONE GENERATOR
=============================== */

function tone(freq,duration){

const osc=audioCtx.createOscillator();

const gain=audioCtx.createGain();


osc.type="sine";

osc.frequency.value=freq;


gain.gain.setValueAtTime(
0.25,
audioCtx.currentTime
);

gain.gain.exponentialRampToValueAtTime(
0.001,
audioCtx.currentTime+duration
);


osc.connect(gain);

gain.connect(audioCtx.destination);


osc.start();

osc.stop(
audioCtx.currentTime+duration
);

}

function vibrate(type){

if(!navigator.vibrate)
return;


if(type==="success")
navigator.vibrate(80);


else if(type==="duplicate")
navigator.vibrate([100,80,100]);


else
navigator.vibrate(300);


}

/* FORMAT TIME */

function formatTime(v){

if(!v)return "";

return new Date(v)
.toLocaleTimeString(
"en-GB",
{
hour:"2-digit",
minute:"2-digit"
}
);

}


/* CLEANUP */

async function cleanupScan(){

await stopCamera();

}
