/* =================================================
NGA Worship Check-in
APP ROUTER V2
================================================= */
let currentPage="homePage";

const pages=[
"homePage",
"manualPage",
"scanPage",
"searchPage",
"registerPage"
];

// ================================
// INIT
// ================================
document.addEventListener(
"DOMContentLoaded",
()=>{

initNavigation();
showPage("homePage");

document
.querySelector(".logout-btn")
?.addEventListener("click",logout);

});

// ================================
// NAVIGATION
// ================================
function initNavigation(){

document
.querySelectorAll("#bottomNav button[data-page]")
.forEach(btn=>{

btn.onclick=()=>{
showPage(btn.dataset.page);
};

});

document
.getElementById("scanNav")
?.addEventListener("click",()=>showPage("scanPage"));

}

// ================================
// SHOW PAGE
// ================================
function showPage(page){

pages.forEach(id=>{
document.getElementById(id)?.classList.remove("active");
});

document.getElementById(page)?.classList.add("active");
currentPage=page;
updateHeader(page);

// HOME ONLY
if(page==="homePage"){loadHome();}

}

// ================================
// HEADER
// ================================
function updateHeader(page){

const header=document.getElementById("appHeader");
const counter=document.getElementById("counterBox");
if(!header||!counter)return;

if(page==="homePage"){
header.style.display="block";
counter.style.display="block";
}

else if(page==="manualPage"||page==="scanPage"
){
header.style.display="none";
counter.style.display="block";
}

else{
header.style.display="none";
counter.style.display="none";
}

}

// ================================
// LOGOUT
// ================================
function logout(){

localStorage.removeItem("token");
localStorage.removeItem("user");
location.reload();

}
