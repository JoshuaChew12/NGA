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

showLoading(false);


}catch(e){

console.log(e);

showResult(
"❌",
"Camera Error",
"Unable to open camera"
);

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

return;

}


// OTHER ERROR

showResult(
"❌",
"Check-in Failed",
res.message||res.type||"Unknown Error"
);


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
