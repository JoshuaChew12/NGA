/* =================================================
NGA Worship Check-in
APP ROUTER
================================================= */

// ================================
// GLOBAL
// ================================
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
loadHome();
}
);

// ================================
// NAVIGATION
// ================================
function initNavigation(){

document
.querySelectorAll(
"#bottomNav button[data-page]"
)
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{
const page=btn.dataset.page;
showPage(page);
});

});

// Scan Floating Button
document
.getElementById("scanNav")
.addEventListener(
"click",
()=>{
showPage("scanPage");
});

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
if(page==="homePage"){loadHome();}

}

// ================================
// HEADER RULE
// ================================
function updateHeader(page){

const header=document.getElementById("appHeader");
const counter=document.getElementById("counterBox");

/*
RULE:
Home→ Header + Counter
Manual→ Counter
Scan→ Counter
Search→ Hide
Register→ Hide
*/

if(page==="homePage"){
header.style.display="block";
counter.style.display="block";
}

else if(page==="manualPage" ||page==="scanPage"){
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
document
.querySelector(".logout-btn")
.onclick=logout;
