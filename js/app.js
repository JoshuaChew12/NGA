/* =================================
NGA Worship Check-in
APP ROUTER V2
================================= */


window.$=id=>document.getElementById(id);


window.getUser=()=>{

try{

return JSON.parse(
localStorage.user||"{}"
);

}catch(e){

return {};

}

};


let currentPage=null;



// ================================
// LOAD PAGE
// ================================
async function loadPage(page){


if(currentPage===page)
return;


// cleanup old page

if(currentPage){

const fn=
window["cleanup"+capitalize(currentPage)];

if(typeof fn==="function")
await fn();

}



// load html

const res=
await fetch(
"pages/"+page+".html?v=1"
);


const html=
await res.text();



pageContainer.innerHTML=html;



// load js

await loadScript(page);



// init

const init=
window["init"+capitalize(page)];


if(typeof init==="function")
await init();



setActiveNav(page);


currentPage=page;


}



// ================================
// LOAD JS
// ================================
function loadScript(page){


return new Promise(resolve=>{


const old=
document.getElementById(
"page-script"
);


if(old)
old.remove();



const script=
document.createElement("script");


script.id="page-script";

script.src=
"js/"+page+".js?v=1";



script.onload=resolve;


script.onerror=()=>{

console.log(
"JS Load Error:",
page
);

resolve();

};



document.body.appendChild(script);


});


}



// ================================
// NAV ACTIVE
// ================================
function setActiveNav(page){


document
.querySelectorAll("#bottomNav button")
.forEach(btn=>{


btn.classList.toggle(
"active",
btn.dataset.page===page
);


});


}



// ================================
// HELPER
// ================================
function capitalize(str){

return str.charAt(0).toUpperCase()
+
str.slice(1);

}



// ================================
// LOGIN CHECK
// ================================
function checkLogin(){


const user=
localStorage.getItem("user");


if(!user){

console.log(
"Not Login"
);

// 如需要登录页面再打开
// location.href="login.html";


return false;

}


return true;

}



// ================================
// NAV CLICK
// ================================
document
.querySelectorAll("#bottomNav button")
.forEach(btn=>{


btn.onclick=()=>{


const page=
btn.dataset.page;


if(page)
loadPage(page);


};


});




// ================================
// START APP
// ================================

document.addEventListener(
"DOMContentLoaded",
()=>{


loadPage("home");


});
