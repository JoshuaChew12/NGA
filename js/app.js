window.$=id=>document.getElementById(id);
window.getUser=()=>{

try{
return JSON.parse(localStorage.user||"{}");
}catch(e){return {};}

};

let currentPage=null;

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
pageContainer.innerHTML=await res.text();

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

document.getElementById("page-script")?.remove();
const s=document.createElement("script");

s.id="page-script";
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

const user=getUser();
if(!user.token){location.href="index.html";return;}
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
