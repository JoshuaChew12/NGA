/* ==========================================
NGA Worship Check-in
HOME MODULE V3
========================================== */

let homeClock=null;

// =========================
// INIT
// =========================
async function initHome(){

startClock();
await loadDashboard();

}

// =========================
// CLEANUP
// =========================
function cleanupHome(){

clearInterval(homeClock);
homeClock=null;

}

// =========================
// CLOCK
// =========================
function startClock(){

cleanupHome();

const clock=document.getElementById("clock");
const day=document.getElementById("todayDay");
const date=document.getElementById("todayDate");

const run=()=>{

const now=new Date();

if(clock)
clock.textContent=
now.toLocaleTimeString("en-GB");

if(day)
day.textContent=
now.toLocaleDateString("en-GB",{
weekday:"long"
});

if(date)
date.textContent=
now.toLocaleDateString("en-GB",{
day:"2-digit",
month:"long",
year:"numeric"
});

};

run();

homeClock=setInterval(run,1000);

}

// =========================
// DASHBOARD
// =========================
async function loadDashboard(){

const box=document.getElementById("dashboard");
const counter=document.getElementById("checkCount");

if(!box)return;

try{

const res=await getDashboard();

if(!res.success){

box.classList.add("hidden");
box.innerHTML="";

if(counter)
counter.textContent="0";

return;

}

let total=0;

const html=(res.dashboard||[])
.slice(1)
.map(r=>{

const count=Number(r[1]||0);

if(!count)
return "";

total+=count;

return `
<div class="dashboard-card">
<div class="dashboard-title">${r[0]}</div>
<div class="dashboard-number">${count}</div>
</div>`;

})
.join("");

if(counter)
counter.textContent=total;

box.classList.toggle("hidden",!html);
box.innerHTML=html;

}catch(err){

console.error(err);

box.classList.add("hidden");
box.innerHTML="";

if(counter)
counter.textContent="0";

}

}
