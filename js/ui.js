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
resultTimer=setTimeout(()=>{hideResult();},3000);

}

/* HIDE RESULT */
function hideResult(){

const box=document.getElementById("scanResult");
if(box)box.classList.add("hidden");

}

/* LOADING */
function showLoading(show){

const el=document.getElementById("loadingMask");
if(el)el.classList.toggle("hidden",!show);

}

/* =====================================
   SOUND ENGINE V2 ULTIMATE
===================================== */
let audioCtx=null;

function initAudio(){

if(audioCtx)return;
audioCtx=new(window.AudioContext||window.webkitAudioContext)();
document.removeEventListener("pointerdown",initAudio);

}

document.addEventListener("pointerdown",initAudio,{once:true});

function tone(
freq,
dur,
type="triangle",
vol=.28
){

if(!audioCtx)return;
if(audioCtx.state==="suspended")
audioCtx.resume();

const osc=audioCtx.createOscillator();
const gain=audioCtx.createGain();

osc.type=type;
osc.frequency.value=freq;

gain.gain.setValueAtTime(0,audioCtx.currentTime);
gain.gain.linearRampToValueAtTime(vol,audioCtx.currentTime+.01);

gain.gain.exponentialRampToValueAtTime(
0.0001,
audioCtx.currentTime+dur
);

osc.connect(gain);
gain.connect(audioCtx.destination);

osc.start();
osc.stop(audioCtx.currentTime+dur);

}

/* =====================================
   WELCOME
===================================== */
function welcomeSound(){

tone(880,.07);
setTimeout(()=>{tone(1175,.07);},70);
setTimeout(()=>{tone(1568,.16,"sine",.24);},150);

}

/* =====================================
   DUPLICATE
===================================== */
function duplicateSound(){

tone(560,.12);
setTimeout(()=>{tone(430,.18);},120);

}

/* =====================================
   ERROR
===================================== */
function errorSound(){

tone(280,.15,"sawtooth",.22);
setTimeout(()=>{tone(180,.25,"sawtooth",.20);},150);

}

/* =====================================
   PLAYER
===================================== */
function playSound(type){

switch(type){

case"success":
welcomeSound();
break;

case"duplicate":
duplicateSound();
break;

default:
errorSound();

}

}

/* =====================================
   VIBRATE
===================================== */
function vibrate(type){

if(!navigator.vibrate)return;

switch(type){

case"success":
navigator.vibrate(70);
break;

case"duplicate":
navigator.vibrate([80,60,80]);
break;

default:
navigator.vibrate(250);

}

}

/* FORMAT TIME */
function formatTime(v){

if(!v)return "";

return new Date(v).toLocaleTimeString("en-GB",
{hour:"2-digit",minute:"2-digit"}
);

}
