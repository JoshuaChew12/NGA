/* =================================================
NGA Worship Check-in
HOME MODULE V2
================================================= */
window.homeClock=null;

// =========================
// LOAD HOME
// =========================
async function loadHome(){

startClock();
await loadDashboard();

}

// =========================
// CLOCK
// =========================
function startClock(){

clearInterval(homeClock);

const run=()=>{

const now=new Date();
const clock=document.getElementById("clock");
const day=document.getElementById("todayDay");
const date=document.getElementById("todayDate");

// TIME
if(clock){
clock.innerHTML=now.toLocaleTimeString("en-GB");
}

// DAY
if(day){
day.innerHTML=
now.toLocaleDateString("en-GB",{weekday:"long"});
}

// DATE
if(date){
date.innerHTML=now.toLocaleDateString("en-GB",
{
day:"2-digit",
month:"long",
year:"numeric"
}
);

}

};

run();

homeClock=setInterval(run,1000);

}

// =========================
// DASHBOARD
// =========================
async function loadDashboard(){

try{

const res=await getDashboard();
const box=document.getElementById("dashboard");

if(!res.success){
box.classList.add("hidden");
return;
}

const data=res.dashboard||[];
let html="";
let total=0;

data.slice(1).forEach(r=>{

const location=r[0];
const count=Number(r[1]||0);
if(!count)return;
total+=count;

html+=`
<div class="dashboard-card">

<div class="dashboard-title">
${location}
</div>

<div class="dashboard-number">
${count}
</div>

</div>
`;

});

document.getElementById("checkCount").textContent=total;

if(total===0){
box.classList.add("hidden");
box.innerHTML="";
return;
}

box.classList.remove("hidden");
box.innerHTML=html;

}catch(err){

console.log(err);
document
.getElementById("dashboard")
.classList.add("hidden");

}

}
