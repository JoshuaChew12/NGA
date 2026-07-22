let homeClock=null;

// ============================
// LOAD HOME
// ============================
async function loadHome(){

const page=document.getElementById("page-home");
page.innerHTML=`

<div class="page-header">

<h1>NGA Worship Check-in</h1>

</div>

<div class="counter-box">

<div class="counter-title">
Checked-in Counter
</div>

<div id="homeCounter"
class="counter-number">
0
</div>

</div>

<div class="clock-box">

<div id="homeTime">
</div>

<div id="homeDate">
</div>

</div>

<div class="dashboard-box">

<h3>Dashboard</h3>

<table id="dashboardTable">

</table>

</div>

<button
class="logout-btn"
onclick="logout()">

Logout

</button>

`;

startHomeClock();
loadHomeDashboard();

}

// ============================
// CLOCK
// ============================
function startHomeClock(){

clearInterval(homeClock);

function run(){

const now=new Date();

document.getElementById("homeTime").innerHTML=
now.toLocaleTimeString("en-GB");

document.getElementById("homeDate").innerHTML=
now.toLocaleDateString("en-GB",
{
weekday:"long",
day:"2-digit",
month:"long",
year:"numeric"
}
);

}

run();

homeClock=setInterval(run,1000);

}

// ============================
// DASHBOARD
// ============================
async function loadHomeDashboard(){

try{

const res=await getDashboard();
if(!res.success)return;

const data=res.dashboard;
let total=0;
let html=`

<tr>

<th>
Location
</th>

<th>
Checked In
</th>

</tr>

`;

for(let i=1;i<data.length;i++){
total+=Number(data[i][1]||0);
html+=`

<tr>

<td>
${data[i][0]}
</td>


<td>
${data[i][1]}
</td>

</tr>

`;

}

document.getElementById("homeCounter")
.innerHTML=total;

document.getElementById("dashboardTable")
.innerHTML=html;

}
catch(err){console.log(err);}

}

// ============================
// LOGOUT
// ============================
function logout(){

localStorage.clear();
location.reload();

}
