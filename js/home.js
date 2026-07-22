let homeClock=null;

// =====================================
// INIT
// =====================================
async function initHome(){

startClock();

await loadDashboard();

logoutBtn.onclick=logout;

}

// =====================================
// CLOCK
// =====================================
function startClock(){

clearInterval(homeClock);

const run=()=>{

const now=new Date();

clock.innerHTML=
now.toLocaleTimeString("en-GB");

todayDay.innerHTML=
now.toLocaleDateString("en-GB",{
weekday:"long"
});

todayDate.innerHTML=
now.toLocaleDateString("en-GB",{
day:"2-digit",
month:"long",
year:"numeric"
});

};

run();

homeClock=setInterval(run,1000);

}

// =====================================
// DASHBOARD
// =====================================
async function loadDashboard(){

dashboard.innerHTML="Loading...";

try{

const res=await getDashboard();

if(!res.success){
dashboard.innerHTML="No data";
return;
}

const rows=res.dashboard||[];

if(rows.length<=1){
dashboard.innerHTML="No attendance";
checkCount.innerHTML=0;
return;
}

let total=0;
let html="";

for(let i=1;i<rows.length;i++){

const location=rows[i][0]||"-";
const count=Number(rows[i][1]||0);

total+=count;

html+=`
<div class="dash-row">
<div>${location}</div>
<b>${count}</b>
</div>
`;

}

dashboard.innerHTML=html;
checkCount.innerHTML=total;

}catch(err){

dashboard.innerHTML="Load failed";
console.log(err);

}

}

// =====================================
// LOGOUT
// =====================================
function logout(){

if(!confirm("Logout?"))return;

clearInterval(homeClock);

localStorage.removeItem("token");
localStorage.removeItem("user");

location.reload();

}

// =====================================
// CLEANUP
// =====================================
function cleanupHome(){

clearInterval(homeClock);

}
