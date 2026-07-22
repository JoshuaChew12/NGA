const API_URL =
"https://script.google.com/macros/s/AKfycbx0J4r_E2dRfHPV7TyJNf4-h-MJzSkfRB4f2aeFi1fRgO-Osw4ekVAADVAL4qWluI4h/exec";


// ==========================
// GET API
// ==========================
async function apiGet(action,params={}){

const query=new URLSearchParams({action,...params});
const res=await fetch(API_URL+"?"+query);
return await res.json();

}

// ==========================
// LOGIN
// ==========================
function loginAPI(username,password){

return apiGet(
"login",{username,password}
);

}

// ==========================
// VERIFY SESSION
// ==========================
function verifySession(){

return apiGet(
"verifysession",{token:localStorage.token||""}
);

}

// ==========================
// DASHBOARD
// ==========================
function getDashboard(){

return apiGet("dashboard");

}

// ==========================
// CHECK IN
// ==========================
function checkInAPI(id){

return apiGet(
"checkin",{id,token:localStorage.token||""}
);

}

// ==========================
// SEARCH
// ==========================
function searchAPI(keyword){

return apiGet("searchparticipant",{keyword});

}

// ==========================
// REGISTER
// ==========================
function registerAPI(data){

return apiGet("register",data);

}
