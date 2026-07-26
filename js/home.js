window.homeClock=null;

// =====================================
// INIT
// =====================================
async function initHome(){

startClock();
await loadDashboard();
await loadRecentCheckin();
const btn=$("logoutBtn");
if(btn) btn.onclick=logout;

}

// =====================================
// CLOCK
// =====================================
function startClock(){

clearInterval(window.homeClock);

const run=()=>{

const now=new Date();
const h=now.getHours();

$("greeting").innerHTML=
h<12?"Good Morning":
h<17?"Good Afternoon":
h<20?"Good Evening":
"Good Night";

$("clock").innerHTML=
now.toLocaleTimeString("en-GB");

$("todayDate").innerHTML=
now.toLocaleDateString("en-GB",{
weekday:"long",
day:"2-digit",
month:"long",
year:"numeric"
});

};

run();

window.homeClock=setInterval(run,1000);

}

// =====================================
// DASHBOARD
// =====================================
async function loadDashboard(){

$("dashboard").innerHTML='<div class="loading">Loading...</div>';

try{

const res=await getDashboard();

if(!res.success){
$("dashboard").innerHTML="No data";
$("checkCount").innerHTML=0;
return;
}

const map={};

(res.dashboard||[]).slice(1).forEach(r=>{
map[r[0]]=Number(r[1]||0);
});

const nga=map.NGA||0;
const cic=map.CIC||0;

$("dashboard").innerHTML=`
<div class="dashboard-grid">

<div class="dashboard-item">
<div class="dashboard-location">NGA</div>
<div class="dashboard-number">${nga}</div>
</div>

<div class="dashboard-item">
<div class="dashboard-location">CIC</div>
<div class="dashboard-number">${cic}</div>
</div>

</div>
`;

$("checkCount").innerHTML=nga+cic;

}catch(e){

$("dashboard").innerHTML="Load failed";
$("checkCount").innerHTML=0;
console.log(e);

}

}

async function loadRecentCheckin(){

$("recentCheckin").innerHTML='<div class="loading">Loading...</div>';

try{

const res=await getRecentCheckin();

if(!res.success){
$("recentCheckin").innerHTML="No data";
return;
}

const rows=res.rows||[];

if(!rows.length){
$("recentCheckin").innerHTML="No attendance";
return;
}

$("recentCheckin").innerHTML=rows.map(r=>`

<div class="recent-row">

<div class="recent-id">${r.id}</div>

<div class="recent-name">
${r.cn}<br>
<small>${r.en}</small>
</div>

<div class="recent-time">
${r.time}
</div>

</div>

`).join("");

}catch(e){

$("recentCheckin").innerHTML="Load failed";

}

}

// =====================================
// LOGOUT
// =====================================
function logout(){

if(!confirm("Logout?"))return;

clearInterval(window.homeClock);

localStorage.removeItem("token");
localStorage.removeItem("user");

location.reload();

}

// =====================================
// CLEANUP
// =====================================
function cleanupHome(){

clearInterval(window.homeClock);

}
