/* =================================================
NGA Worship Check-in
HOME MODULE V2
================================================= */
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

const run=()=>{

const now=new Date();
const clock=document.getElementById("clock");
if(clock){
clock.innerHTML=now.toLocaleTimeString("en-GB");
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
if(!res.success)return;
const data=res.dashboard||[];
let total=0;
let html=
`
<table>

<tr>
<th>Location</th>
<th>Checked In</th>
</tr>
`;

data.slice(1)
.forEach(row=>{

const location=row[0];
const count=Number(row[1]||0);
total+=count;
html+=
`
<tr>

<td>${location}</td>

<td>${count}</td>

</tr>
`;

});

html+="</table>";

const counter=document.getElementById("checkCount");
if(counter)counter.innerHTML=total;

const box=document.getElementById("dashboard");
if(box)box.innerHTML=html;

}
catch(err){
console.log("Dashboard Error",err);
}


}
