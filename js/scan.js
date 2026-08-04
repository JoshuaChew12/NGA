/* =====================================
   NGA Worship Check-in
   Scan V6 Stable
===================================== */
window.scanner=null;
window.scanning=false;
window.scanLock=false;
window.cameras=[];
window.currentCamera=0;
window.frontCamera=-1;
window.backCamera=-1;
window.cameraLoaded=false;
window.switchingCamera=false;

/* INIT */
async function initScan(){
window.scanLock=false;
if(window.scanning)return;
await startCamera();
}

/* START CAMERA */
async function startCamera(){

if(window.scanning)return;

try{

showLoading(true);
if(!window.cameras.length){window.cameras=await Html5Qrcode.getCameras();}
const cams=window.cameras;
if(!cams.length){
showLoading(false);
showResult("❌","Camera Error","No Camera Found");
return;
}

if(!window.cameraLoaded){

window.frontCamera=cams.findIndex(c=>/front|user/i.test(c.label));
window.backCamera=cams.findIndex(c=>/back|rear|environment/i.test(c.label));
if(window.backCamera<0)window.backCamera=0;
if(window.frontCamera<0){
window.frontCamera=cams.findIndex((c,i)=>i!==window.backCamera);
}
window.currentCamera=window.backCamera;
window.cameraLoaded=true;

}

const cam=cams[Math.max(0,Math.min(window.currentCamera,cams.length-1))];
window.scanner=new Html5Qrcode("reader");
await window.scanner.start(

cam.id,

{
fps:12,
qrbox:(w,h)=>{
const s=Math.min(w,h)*0.72;
return{
width:s,
height:s
};
}
},

onScanSuccess,

()=>{}

);

window.scanning=true;
showLoading(false);

}catch(e){

console.log(e);
showLoading(false);

showResult(
"❌",
"Camera Error",
"Unable to open camera"
);

}

}

/* STOP CAMERA */
async function stopCamera(){

if(!window.scanner)return;

try{

if(window.scanning){await window.scanner.stop();}
await window.scanner.clear();

}catch(e){console.log(e);}

window.scanner=null;
window.scanning=false;
await new Promise(r=>setTimeout(r,300));

}

async function switchCamera(){

if(window.scanLock)return;
if(window.switchingCamera)return;
window.switchingCamera=true;

try{

if(window.frontCamera<0){
showResult(
"📷",
"Camera",
"Front Camera Not Available"
);
return;
}

window.currentCamera=
window.currentCamera===window.backCamera
?window.frontCamera
:window.backCamera;

await stopCamera();
await startCamera();

}catch(e){console.log(e);

}finally{window.switchingCamera=false;}

}

/* QR SUCCESS */
async function onScanSuccess(text){

if(window.scanLock)return;
window.scanLock=true;
await stopCamera();
window.switchingCamera=false;
const id=text.trim().toUpperCase();
resetIdleTimer();

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

playSound("error");
vibrate("error");

}

setTimeout(async()=>{
hideResult();
window.scanLock=false;
await startCamera();
},3000);

}

/* LOADING */
function showLoading(show){

const m=document.getElementById("loadingMask");
if(m)
m.classList.toggle("hidden",!show);

}

/* CLEANUP */
async function cleanupScan(){

window.scanLock=true;
await stopCamera();

}
