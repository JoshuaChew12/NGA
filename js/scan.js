/* =====================================
   NGA Worship Check-in
   Scan V6 Stable
===================================== */
window.scanner=null;
window.scanning=false;
window.scanLock=false;

/* INIT */
async function initScan(){
window.scanLock=false;
await startCamera();
}

/* START CAMERA */
async function startCamera(){

if(window.scanning)return;

try{

showLoading(true);
const cams=await Html5Qrcode.getCameras();
if(!cams.length){
showLoading(false);
showResult("❌","Camera Error","No Camera Found");
return;
}

const cam=cams.find(c=>/back|rear|environment/i.test(c.label))||cams[0];
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
await window.scanner.stop();
await window.scanner.clear();
}catch(e){}

window.scanner=null;
window.scanning=false;

}

/* QR SUCCESS */
async function onScanSuccess(text){

if(window.scanLock)return;
window.scanLock=true;
await stopCamera();
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

await stopCamera();

}
