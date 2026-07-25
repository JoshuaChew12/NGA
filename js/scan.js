/* =====================================
 NGA Worship Check-in
 Scan V6 Ultimate Lite
===================================== */

let scanner=null;
let cameraRunning=false;
let scanLocked=false;


/* INIT */

async function initScan(){

await startCamera();

}


/* CAMERA START */

async function startCamera(){

if(cameraRunning)return;

try{

if(typeof Html5Qrcode==="undefined"){

showResult(
"❌",
"Scanner Error",
"Library Missing"
);

return;

}


const cameras=
await Html5Qrcode.getCameras();


if(!cameras.length){

showResult(
"❌",
"Camera Error",
"No Camera Found"
);

return;

}


const cam=
cameras.find(c=>
/back|rear|environment/i
.test(c.label)
)
||cameras[0];


scanner=
new Html5Qrcode("reader");


await scanner.start(

cam.id,

{
fps:12,

qrbox:(w,h)=>{

const s=
Math.min(w,h)*0.7;

return{
width:s,
height:s
};

}

},

onScanSuccess,

()=>{}

);


cameraRunning=true;


}catch(e){

console.log(e);

showResult(
"❌",
"Camera Error",
"Unable to open camera"
);

}

}


/* QR SUCCESS */

async function onScanSuccess(text){

if(scanLocked)return;

scanLocked=true;


const id=
text
.toString()
.trim()
.toUpperCase();


if(!id){

scanLocked=false;
return;

}


/*
马上关闭Camera
*/

await stopCamera();


showResult(
"⏳",
"Processing",
"Checking participant..."
);


try{

const res=
await checkInAPI(id);


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


/*
等待结果后恢复
*/

setTimeout(async()=>{


hideResult();


await startCamera();


scanLocked=false;


},3000);


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


/* CLEANUP */

async function cleanupScan(){

await stopCamera();

}
