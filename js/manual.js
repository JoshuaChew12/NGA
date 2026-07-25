/* =====================================
   NGA Worship Check-in
   Manual V6 Stable
===================================== */

let manualBusy=false;

/* INIT */

async function initManual(){

memberID.focus();

manualBtn.onclick=submitManual;

memberID.onkeydown=e=>{
if(e.key==="Enter")submitManual();
};

}

/* SUBMIT */

async function submitManual(){

if(manualBusy)return;

const id=memberID.value
.trim()
.toUpperCase();

if(!id){
memberID.focus();
return;
}

manualBusy=true;

manualBtn.disabled=true;
manualBtn.innerHTML="Checking...";

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

setTimeout(()=>{

hideResult();

memberID.value="";
memberID.focus();

manualBtn.disabled=false;
manualBtn.innerHTML="Check In";

manualBusy=false;

},3000);

}

/* CLEANUP */

function cleanupManual(){}
