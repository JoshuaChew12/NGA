/* =====================================================
APP ROUTER V1
===================================================== */


const pageContainer=
document.getElementById("pageContainer");


const routes={


home:{
id:"homePage"
},


manual:{
id:"manualPage"
},


scan:{
id:"scanPage"
},


search:{
id:"searchPage"
},


register:{
id:"register-Page"
}


};





function loadPage(name){


const route=
routes[name];


if(!route)
return;



const old=
document.getElementById(route.id);



if(old){

pageContainer.innerHTML=
old.outerHTML;


return;

}



pageContainer.innerHTML="";


}





function setActiveNav(name){


document
.querySelectorAll("#bottomNav button")
.forEach(btn=>{

btn.classList.remove("active");


if(btn.dataset.page===name)
btn.classList.add("active");


});


}





function navigate(name){


loadPage(name);


setActiveNav(name);



/*
future:

load page html

load page js

*/

}





document
.querySelectorAll("#bottomNav button")
.forEach(btn=>{


btn.onclick=()=>{


const page=
btn.dataset.page;


if(page){

navigate(page);

}


};


});





/* SCAN BUTTON */


const scanNav=
document.getElementById("scanNav");


if(scanNav){


scanNav.onclick=()=>{

navigate("scan");

};


}





/* START */


navigate("home");
