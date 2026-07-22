let homeClock=null;

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

function update(){

const now=new Date();
const clock=document.getElementById("clock");

if(clock){
clock.innerHTML=now.toLocaleTimeString("en-GB");
}

}

update();

homeClock=setInterval(update,1000);

}

// =========================
// DASHBOARD
// =========================
async function loadDashboard(){

try{

const res=await getDashboard();
if(!res.success)return;
const data=res.dashboard||[];
let total=0;
let html=`
<table>
<tr>
<th>Location</th>
<th>Checked In</th>
</tr>
`;

data.slice(1).forEach(r=>{

const location=r[0];
const count=Number(r[1]||0);
total+=count;
html+=`
<tr>
<td>${location}</td>
<td>${count}</td>
</tr>
`;

});

html+="</table>";

document.getElementById("checkCount").innerHTML=total;
document.getElementById("dashboard").innerHTML=html;

}catch(err){console.log(err);}

}

// =========================
// LOGOUT
// =========================
function logout(){

localStorage.removeItem("token");
localStorage.removeItem("user");
location.reload();

}
