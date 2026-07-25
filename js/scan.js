/* =====================================
   NGA Worship Check-in
   Scan V6 Stable
===================================== */

let scanner=null;
let scanning=false;
let scanLock=false;

/* INIT */
async function initScan(){
scanLock=false;
await startCamera();
}

/* START CAMERA */
async function startCamera(){

if(scanning)return;

try{

showLoading(true);

const cams=await Html5Qrcode.getCameras();

if(!cams.length){
showLoading(false);
showResult("❌","Camera Error","No Camera Found");
return;
}

const cam=
cams.find(c=>
/back|rear|environment/i.test(c.label)
)||cams[0];

scanner=new Html5Qrcode("reader");

await scanner.start(

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

scanning=true;
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

if(!scanner)return;

try{

await scanner.stop();
await scanner.clear();

}catch(e){}

scanner=null;
scanning=false;

}

/* QR SUCCESS */

async function onScanSuccess(text){

if(scanLock)return;

scanLock=true;

await stopCamera();

const id=text.trim().toUpperCase();

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

scanLock=false;

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
