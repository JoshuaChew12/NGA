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

// hide all
pages.forEach(id=>{
const el=document.getElementById(id);
if(el)el.classList.remove("active");
});

// show target
const target=document.getElementById(page);
if(target){
target.classList.add("active");
currentPage=page;
}

// header control
updateHeader(page);

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
.addEventListener(
"click",
()=>{

if(confirm("Logout?")){location.reload();}

});
