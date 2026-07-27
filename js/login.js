async function loadLogin(){

const res=await fetch("pages/login.html");
loginContainer.innerHTML=await res.text();
if(typeof initLogin==="function")
initLogin();

}

async function checkSession(){

const token=localStorage.token;
if(!token){loadLogin();return;}

try{

const res=await verifySession();
if(res.success){
localStorage.user=JSON.stringify(res);
location.href="app.html";
}else{
localStorage.clear();
loadLogin();
}

}catch(e){
localStorage.clear();
loadLogin();
}

}

async function initLogin(){

loginBtn.onclick=async()=>{

const username=loginUsername.value.trim();
const password=loginPassword.value.trim();
if(!username||!password){
loginMessage.innerHTML="Please enter username and password";
return;

}

loginBtn.disabled=true;
loginMessage.innerHTML="Checking...";

try{

const res=await loginAPI(username,password);
if(!res.success){
loginMessage.innerHTML=res.message||"Login Failed";
loginBtn.disabled=false;
return;
}

// =====================
// SAVE SESSION
// =====================
localStorage.token=res.token;
localStorage.user=JSON.stringify(res);

// =====================
// OPEN APP
// =====================
loginMessage.innerHTML="Login Success";

setTimeout(()=>{
location.href="app.html";
},300);

}catch(err){
loginMessage.innerHTML="Network Error";
console.log(err);
}

loginBtn.disabled=false;

};

}
