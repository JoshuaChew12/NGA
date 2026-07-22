const pageContainer=document.getElementById("pageContainer");

const routes={
home:{html:"pages/home.html",js:"js/home.js",init:"loadHome"},
manual:{html:"pages/manual.html",js:"js/manual.js",init:"loadManual"},
scan:{html:"pages/scan.html",js:"js/scan.js",init:"loadScan"},
search:{html:"pages/search.html",js:"js/search.js",init:"loadSearch"},
register:{html:"pages/register.html",js:"js/register.js",init:"loadRegister"}
};

let currentPage="";
let currentScript=null;

async function loadPage(name){

if(currentPage===name)return;

if(window.stopScanner)window.stopScanner();

const r=routes[name];
if(!r)return;

const html=await fetch(r.html+"?v=1").then(x=>x.text());

pageContainer.innerHTML=html;

if(currentScript)currentScript.remove();

await new Promise(resolve=>{

const s=document.createElement("script");
s.src=r.js+"?v=1";
s.onload=()=>{
currentScript=s;
resolve();
};
document.body.appendChild(s);

});

if(window[r.init])window[r.init]();

document.querySelectorAll("#bottomNav button").forEach(b=>{
b.classList.toggle("active",b.dataset.page===name);
});

currentPage=name;

}

document.querySelectorAll("#bottomNav button").forEach(b=>{
b.onclick=()=>loadPage(b.dataset.page);
});

loadPage("home");
