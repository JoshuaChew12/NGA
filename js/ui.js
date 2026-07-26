/* =====================================
   NGA Worship Check-in
   UI V6 Stable
===================================== */
let resultTimer = null;
let audioCtx = null;

/* =========================
   RESULT
========================= */
function handleResult(res){

if(!res){
showResult("❌","Server Error","No Response");
playSound("error");
vibrate("error");
return;
}

if(res.success){

showResult(
"✅",
"Welcome",
memberName(res),
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

if(res.type==="duplicate"){

showResult(
"⚠️",
"Already Checked In",
memberName(res),
{
id:res.memberID,
church:res.homeChurch,
location:res.scanLocation,
time:formatTime(res.time)
}
);

playSound("duplicate");
vibrate("duplicate");
return;

}

showResult(
"❌",
"Check-in Failed",
res.message||res.type||"Unknown Error"
);

playSound("error");
vibrate("error");

}

/* =========================
   POPUP
========================= */
function showResult(icon,title,msg,data={}){

const box=document.getElementById("scanResult");
if(!box)return;

document.getElementById("resultIcon").innerHTML=icon;
document.getElementById("resultTitle").innerHTML=title;
document.getElementById("resultMessage").innerHTML=msg;

document.getElementById("resultID").innerHTML=data.id||"";
document.getElementById("resultChurch").innerHTML=data.church||"";
document.getElementById("resultLocation").innerHTML=data.location||"";
document.getElementById("resultTime").innerHTML=data.time||"";

box.className="scan-result";

if(title==="Welcome")
box.classList.add("success");
else if(title==="Already Checked In")
box.classList.add("warning");
else
box.classList.add("error");

box.classList.remove("hidden");

clearTimeout(resultTimer);

resultTimer=setTimeout(hideResult,3000);

}

function hideResult(){

const box=document.getElementById("scanResult");

if(box)
box.classList.add("hidden");

}

/* =========================
   SOUND
========================= */
function initAudio(){

if(!audioCtx){

audioCtx=new(
window.AudioContext||
window.webkitAudioContext
)();

}

if(audioCtx.state==="suspended")
audioCtx.resume();

}

function playSound(type){

initAudio();

switch(type){

case"success":
tone(880,.10);
setTimeout(()=>tone(1175,.12),120);
break;

case"duplicate":
tone(650,.12);
setTimeout(()=>tone(520,.18),140);
break;

case"error":
tone(260,.28);
break;

}

}

function tone(freq,duration){

const osc=audioCtx.createOscillator();
const gain=audioCtx.createGain();

osc.type="triangle";
osc.frequency.value=freq;

gain.gain.setValueAtTime(
0.22,
audioCtx.currentTime
);

gain.gain.exponentialRampToValueAtTime(
0.001,
audioCtx.currentTime+duration
);

osc.connect(gain);
gain.connect(audioCtx.destination);

osc.start();
osc.stop(audioCtx.currentTime+duration);

}

/* =========================
   VIBRATE
========================= */
function vibrate(type){

if(!navigator.vibrate)return;

switch(type){

case"success":
navigator.vibrate(80);
break;

case"duplicate":
navigator.vibrate([80,60,80]);
break;

case"error":
navigator.vibrate(220);
break;

}

}

/* =========================
   TIME
========================= */
function formatTime(v){
return v ? String(v).slice(0,16) : "";
}

function memberName(res){

const cn=(res.chineseName||"").trim();
const en=(res.englishName||"").trim();
if(cn&&en)
return ${cn} ${en};
return cn||en||"";

}
