/* =====================================
   NGA Worship Check-in
   UI Ultimate V5
===================================== */
let resultTimer=null;
let audioCtx=null;

/* RESULT */
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

if(res.type==="duplicate"){

showResult(
"⚠️",
"Already Checked In",
res.englishName||res.chineseName,
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

/* POPUP */
function showResult(icon,title,msg,data={}){

const box=$("#scanResult");
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

resultTimer=setTimeout(hideResult,3000);

}

function hideResult(){

$("#scanResult")?.classList.add("hidden");

}

/* SOUND */
function initAudio(){

if(!audioCtx)
audioCtx=new(
window.AudioContext||
window.webkitAudioContext
)();

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
tone(600,.16);
setTimeout(()=>tone(470,.18),180);
break;

case"error":
tone(250,.28);
break;

}

}

function tone(f,d){

const o=audioCtx.createOscillator();
const g=audioCtx.createGain();

o.type="triangle";
o.frequency.value=f;

g.gain.setValueAtTime(
0.22,
audioCtx.currentTime
);

g.gain.exponentialRampToValueAtTime(
0.001,
audioCtx.currentTime+d
);

o.connect(g);
g.connect(audioCtx.destination);

o.start();
o.stop(audioCtx.currentTime+d);

}

/* VIBRATE */
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
navigator.vibrate(250);
break;

}

}

/* TIME */
function formatTime(v){

if(!v)return"";

return new Date(v)
.toLocaleTimeString(
"en-GB",
{
hour:"2-digit",
minute:"2-digit"
}
);

}
