/* ==========================================
NGA Worship Check-in
APP ROUTER V1
========================================== */
const pageContainer=document.getElementById("pageContainer");
const routes={

home:{
html:"pages/home.html",
js:"js/home.js",
init:"initHome",
cleanup:"cleanupHome"
},

manual:{
html:"pages/manual.html",
js:"js/manual.js",
init:"initManual",
cleanup:"cleanupManual"
},

scan:{
html:"pages/scan.html",
js:"js/scan.js",
init:"initScan",
cleanup:"cleanupScan"
},

search:{
html:"pages/search.html",
js:"js/search.js",
init:"initSearch",
cleanup:"cleanupSearch"
},

register:{
html:"pages/register.html",
js:"js/register.js",
init:"initRegister",
cleanup:"cleanupRegister"
}

};

let currentPage="";
let currentRoute=null;
const loadedJS={};

// =========================
// LOAD PAGE
// =========================
async function loadPage(name){

if(name===currentPage)return;

if(currentRoute&&window[currentRoute.cleanup])
window[currentRoute.cleanup]();

const route=routes[name];
if(!route)return;

try{

const html=await fetch(route.html+"?v=1")
.then(r=>r.text());

pageContainer.innerHTML=html;

await loadScript(route.js);

if(window[route.init])
await window[route.init]();

currentPage=name;
currentRoute=route;

setActiveNav(name);

}catch(err){

console.error(err);

pageContainer.innerHTML=
`<div class="card">
Failed to load page.
</div>`;

}

}

// =========================
// LOAD JS
// =========================
function loadScript(src){

return new Promise((resolve,reject)=>{

if(loadedJS[src]){resolve();return;}
const s=document.createElement("script");
s.src=src+"?v=1";

s.onload=()=>{
loadedJS[src]=true;
resolve();
};

s.onerror=reject;
document.body.appendChild(s);

});

}

// =========================
// ACTIVE NAV
// =========================
function setActiveNav(name){

document
.querySelectorAll("#bottomNav button")
.forEach(btn=>{

btn.classList.toggle("active",
btn.dataset.page===name
);

});

}

// =========================
// NAV CLICK
// =========================
document
.querySelectorAll("#bottomNav button")
.forEach(btn=>{

btn.onclick=()=>{
const page=btn.dataset.page;
if(page)loadPage(page);
};

});

// =========================
// START
// =========================
document.addEventListener("DOMContentLoaded",
()=>loadPage("home")
);
