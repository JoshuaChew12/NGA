/* =========================================
   NGA Worship Check-in
   Scan Ultimate Core V1
========================================= */
let scanner=null;
let cameraRunning=false;
let torchEnabled=false;
let currentCameraId=null;


/* =========================================
   INIT
========================================= */
async function initScan(){

setStatus("Preparing Camera...");
showLoading(true);
bindScanButtons();
await startCamera();

}


/* =========================================
   START CAMERA
========================================= */
async function startCamera(){

if(cameraRunning)return;

try{

if(typeof Html5Qrcode==="undefined"){
cameraError("Scanner Library Missing");
return;
}

// 获取 Camera
const cameras=await Html5Qrcode.getCameras();
if(!cameras || cameras.length===0){
cameraError("No Camera Found");
return;
}

// 优先后镜头
currentCameraId=selectBackCamera(cameras);

// 创建 Scanner
scanner=new Html5Qrcode("reader");

// 开始
await scanner.start(
currentCameraId,
{
fps:12,
qrbox:function(width,height){
const size=Math.min(width,height)*0.7;
return{width:size,height:size};}
},

decodedText=>{

if(typeof onScanSuccess==="function"){
onScanSuccess(decodedText);
}

},

errorMessage=>{// ignore scan frame errors}

);

cameraRunning=true;

showLoading(false);
setStatus("Camera Ready");
setInfo("Scanning");
await checkTorch();

}catch(err){

console.log(err);
cameraError("Camera Open Failed");

}

}

/* =========================================
   CAMERA SELECT
========================================= */
function selectBackCamera(cameras){

let back=cameras.find(c=>
/back|rear|environment/i
.test(c.label)
);

return back?back.id:cameras[0].id;

}

/* =========================================
   STOP CAMERA
========================================= */
async function stopCamera(){

try{

if(scanner && cameraRunning){
await scanner.stop();
await scanner.clear();
}

}catch(e){console.log(e);}

scanner=null;
cameraRunning=false;
currentCameraId=null;

}

/* =========================================
   TORCH
========================================= */
async function checkTorch(){

try{

if(!scanner)return;
const track=scanner.getRunningTrackSettings();

if(track &&track.torchSupported){
torchBtn.classList.remove("hidden");
}else{torchBtn.classList.add("hidden");}

}catch(e){torchBtn.classList.add("hidden");}

}

async function toggleTorch(){

try{

if(!scanner)return;
torchEnabled=!torchEnabled;
await scanner.applyVideoConstraints({
advanced:[{torch:torchEnabled}]
});

}catch(e){torchEnabled=false;}

}

/* =========================================
   UI STATUS
========================================= */
function setStatus(text){

const el=document.getElementById("cameraStatus");
if(el)el.innerHTML="📷 "+text;

}

function setInfo(text){

const el=document.getElementById("scanInfo");
if(el)el.innerHTML=text;

}

function showLoading(show){

const el=document.getElementById("loadingMask");
if(!el)return;
el.classList.toggle("hidden",!show);

}

function cameraError(msg){

showLoading(false);
setStatus(msg);
setInfo("Camera Error");

}

/* =========================================
   BUTTONS
========================================= */
function bindScanButtons(){

const torch=document.getElementById("torchBtn");
if(torch){torch.onclick=toggleTorch;}

}

/* =========================================
   PAGE CLEANUP
========================================= */
async function cleanupScan(){
await stopCamera();
}

/* =========================================
   HELPERS
========================================= */
function vibrate(){
if(navigator.vibrate){navigator.vibrate(80);}
}

/* =========================================
   NGA Worship Check-in
   Scan Ultimate Logic V1
========================================= */
let scanLocked=false;
let resultTimer=null;

/* =========================================
   QR SUCCESS CALLBACK
========================================= */
async function onScanSuccess(decodedText){

if(scanLocked)return;
// 防止重复扫描
scanLocked=true;

const id=decodedText
.toString().trim().toUpperCase();
if(!id){scanLocked=false;return;}
setInfo("Checking...");

try{

const result=await checkInAPI(id);
handleScanResult(result);

}catch(err){

showResult(
"❌",
"Network Error",
"Unable to connect server"
);
playSound("error");
}

setTimeout(()=>{
scanLocked=false;
setInfo("Scanning");
},1200);

}

/* =========================================
   RESULT HANDLER
========================================= */
function handleScanResult(res){

if(!res){
showResult(
"❌",
"Server Error",
"No Response"
);

playSound("error");
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
vibrate();
return;

}

// DUPLICATE
if(res.type==="duplicate"){
showResult(
"⚠️",
"Already Checked In",
res.chineseName,
{
id:res.memberID,
church:res.homeChurch,
location:res.scanLocation,
time:formatTime(res.time)
}

);

playSound("duplicate");
return;

}

// NOT FOUND
if(res.type==="not_found"){
showResult(
"❌",
"Participant Not Found",
"ID : "+res.memberID||""
);

playSound("notfound");
return;

}

// SESSION
if(res.type==="no_session"){
showResult(
"⏰",
"No Active Session",
"Please check session time"
);

playSound("error");
return;

}

// LOGIN
if(res.type==="invalid_session"||res.type==="inactive_user"){
showResult(
"🔒",
"Session Expired",
"Please login again"
);

playSound("error");
return;

}

// BUSY
if(res.type==="busy"){
showResult(
"⏳",
"Please Wait",
"Processing"
);

return;

}

// OTHER ERROR
showResult(
"❌",
"Check-in Failed",
res.message||"Unknown Error"
);

playSound("error");

}

/* =========================================
   RESULT CARD
========================================= */
function showResult(
icon,
title,
message,
data={}
){

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

// reset class
card.className="scan-result";
if(title==="Welcome"){
card.classList.add("success");
}

else if(title==="Already Checked In"){
card.classList.add("warning");
}

else{card.classList.add("error");}

card.classList.remove("hidden");

resultTimer=setTimeout(()=>{
card.classList.add("hidden");
},5000);

}

/* =========================================
   SOUND SYSTEM
========================================= */
function playSound(type){

try{
let src="";
switch(type){
case "success":
src="sound/welcome.mp3";
break;

case "duplicate":
src="sound/duplicate.mp3";
break;

case "notfound":
src="sound/notfound.mp3";
break;

default:
src="sound/error.mp3";
}

const audio=new Audio(src);
audio.volume=0.8;
audio.play().catch(()=>{});

}catch(e){}

}

/* =========================================
   FORMAT TIME
========================================= */
function formatTime(value){

if(!value)return "";
const d=new Date(value);
return d.toLocaleTimeString("en-GB",
{hour:"2-digit",minute:"2-digit"}
);

}
