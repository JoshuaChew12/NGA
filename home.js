let homeClock=null;

// =========================
// LOAD HOME
// =========================
async function loadHome(){

startClock();
loadDashboard();

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

const data=res.dashboard;
let total=0;
let html=
`
<table>

<tr>

<th>Location</th>

<th>Checked In</th>

</tr>
`;

for(let i=1;i<data.length;i++){

const location=data[i][0];
const count=Number(data[i][1]||0);
total+=count;

html+=`

<tr>

<td>${location}</td>
<td>${count}</td>

</tr>

`;

}

html+=`</table>`;

// Counter
const counter=document.getElementById("checkCount");
if(counter){counter.innerHTML=total;}

// Dashboard
const dashboard=document.getElementById("dashboard");
if(dashboard){dashboard.innerHTML=html;}

}
catch(err){
console.log("Dashboard Error",err);
}


}

// =========================
// LOGOUT
// =========================
function logout(){

localStorage.removeItem("token");
localStorage.removeItem("user");
location.reload();

}
