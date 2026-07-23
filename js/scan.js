let scanner=null;
let scanning=false;

const RESULT_DELAY=5000;
const AUTO_START=true;
const AUTO_RESUME=true;
const SOUND=true;
const VIBRATE=true;

// =====================================
// INIT
// =====================================
async function initScan(){

startScanBtn.onclick=startScanner;
stopScanBtn.onclick=stopScanner;

hideResult();

if(AUTO_START)
startScanner();

}

// =====================================
// START
// =====================================
async function startScanner(){

if(scanning)return;

try{

scanner=new Html5Qrcode("reader");

const list=await Html5Qrcode.getCameras();

if(!list.length){
showResult("❌","Camera","No Camera","error");
return;
}

let camera=list[0].id;

const back=list.find(c=>
/back|rear|environment/i.test(c.label)
);

if(back)camera=back.id;

await scanner.start(
camera,
{fps:10,qrbox:250},
onScanSuccess
);

scanning=true;

}catch(e){

showResult("❌","Camera","Open Failed","error");

}

}

// =====================================
// SCAN SUCCESS
// =====================================
async function onScanSuccess(id){

if(!scanning)return;

await stopScanner();

processCheckIn(id.trim());

}

// =====================================
// CHECK IN
// =====================================
async function processCheckIn(id){

try{

const res=await checkInAPI(id);

switch(res.type){

case "success":

playSuccess();

showResult(
"✅",
"Welcome",
(res.chineseName||res.englishName||id),
"success"
);

await loadDashboard();

break;

case "duplicate":

playDuplicate();

showResult(
"⚠️",
"Already Checked In",
res.chineseName||id,
"warning"
);

break;

case "not_found":

playError();

showResult(
"❌",
"Participant Not Found",
id,
"error"
);

break;

default:

playError();

showResult(
"❌",
"Network Error",
res.message||"Please Retry",
"error"
);

}

}catch(e){

playError();

showResult(
"❌",
"Network Error",
"Please Retry",
"error"
);

}

setTimeout(async()=>{

hideResult();

if(AUTO_RESUME)
startScanner();

},RESULT_DELAY);

}

// =====================================
// STOP
// =====================================
async function stopScanner(){

if(!scanner)return;

try{
await scanner.stop();
await scanner.clear();
}catch(e){}

scanner=null;
scanning=false;

}

// =====================================
// RESULT
// =====================================
function showResult(icon,title,msg,type){

resultIcon.innerHTML=icon;
resultTitle.innerHTML=title;
resultMessage.innerHTML=msg;

scanResult.className="scan-result "+type;

}

function hideResult(){

scanResult.className="scan-result hidden";

}

// =====================================
// SOUND
// =====================================
function beep(f,d){

if(!SOUND)return;

const a=new(window.AudioContext||window.webkitAudioContext)();
const o=a.createOscillator();
const g=a.createGain();

o.frequency.value=f;
o.connect(g);
g.connect(a.destination);

o.start();

g.gain.setValueAtTime(.2,a.currentTime);
g.gain.exponentialRampToValueAtTime(.001,a.currentTime+d);

o.stop(a.currentTime+d);

}

function playSuccess(){

if(VIBRATE)navigator.vibrate?.(80);

beep(900,.15);

}

function playDuplicate(){

if(VIBRATE)navigator.vibrate?.([80,80,80]);

beep(650,.12);

setTimeout(()=>beep(650,.12),180);

}

function playError(){

if(VIBRATE)navigator.vibrate?.(250);

beep(250,.5);

}

// =====================================
// CLEANUP
// =====================================
async function cleanupScan(){

await stopScanner();

}
