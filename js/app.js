window.$=id=>document.getElementById(id);

window.set=function(id,v){
const e=$(id);
if(e)e.innerHTML=v;
};

window.getUser=()=>{
try{
return JSON.parse(localStorage.NGA_user||"{}");
}catch(e){return {};}
};

let currentPage=null;

window.NGA_idleTimer=null;
window.NGA_idleEnabled=false;

const NGA_IDLE_EVENTS=[
"click",
"mousemove",
"keydown",
"touchstart",
"scroll"
];

function startIdleTimer(){

clearIdleTimer();
const user=getUser();
const limit=Number(user.idleLimit||600000);
window.NGA_idleTimer=setTimeout(()=>{autoLogout();},limit);

}

function resetIdleTimer(){
startIdleTimer();
}

function clearIdleTimer(){

if(window.NGA_idleTimer){
clearTimeout(window.NGA_idleTimer);
window.NGA_idleTimer=null;
}

}

function enableIdleTracking(){

if(window.NGA_idleEnabled)return;
window.NGA_idleEnabled=true;

NGA_IDLE_EVENTS.forEach(e=>{
document.addEventListener(e,resetIdleTimer,{passive:true});
});
startIdleTimer();

}

function autoLogout(){

alert("Session expired. Please login again.");
localStorage.removeItem("NGA_token");
localStorage.removeItem("NGA_user");
location.href="index.html";

}

// LOAD PAGE
async function loadPage(page){

if(currentPage===page)return;

// cleanup
if(currentPage){
const fn=window["cleanup"+capitalize(currentPage)];
if(typeof fn==="function")await fn();
}

// html
const res=await fetch("pages/"+page+".html");
$("pageContainer").innerHTML=await res.text();

// js
await loadScript(page);

// init
const init=window["init"+capitalize(page)];
if(typeof init==="function")await init();

setActiveNav(page);
currentPage=page;

}

// LOAD JS
function loadScript(page){

return new Promise(resolve=>{

const old=document.getElementById("page-script");
if(old){
const oldPage=old.dataset.page;
if(oldPage===page){resolve();return;}
old.remove();
}

const s=document.createElement("script");

s.id="page-script";
s.dataset.page=page;
s.src="js/"+page+".js";
s.onload=resolve;
s.onerror=resolve;

document.body.appendChild(s);

});

}

// ACTIVE NAV
function setActiveNav(page){

document
.querySelectorAll("#bottomNav button")
.forEach(b=>
b.classList.toggle("active",
b.dataset.page===page
));

}

// HELPER
function capitalize(s){

return s[0].toUpperCase()+s.slice(1);

}

// SESSION CHECK
async function startApp(){

if(!localStorage.NGA_token){location.href="index.html";return;}
enableIdleTracking();
startFirebaseCounter();
loadPage("home");

}

// NAV
document
.querySelectorAll("#bottomNav button")
.forEach(btn=>{

btn.onclick=()=>{

const page=btn.dataset.page;
if(page)
loadPage(page);

};

});

// START
document.addEventListener("DOMContentLoaded",startApp);
