/* =====================================
   NGA Worship Check-in
   Manual V5 Ultimate
===================================== */
async function initManual(){

memberID.focus();

manualBtn.onclick=submitManual;

memberID.onkeydown=e=>{
if(e.key==="Enter")submitManual();
};

}

async function submitManual(){

const id=memberID.value
.trim()
.toUpperCase();

if(!id){
memberID.focus();
return;
}

manualBtn.disabled=true;
manualBtn.innerHTML="Checking...";

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

},3000);

}

function cleanupManual(){}
